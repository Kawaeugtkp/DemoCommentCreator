import { randomUUID } from 'node:crypto'
import { getAccountDefs, getAccountEmail } from './accounts'
import { signIn } from './firebase'
import { createComment, getTopic, likeComment, pickSet } from './chepics'

// =====================================================================
//  実行ジョブ（セット選択 → ランダムタイミングでコメント投稿 → いいね）
//  サーバー側のバックグラウンドで進行し、画面はステータスをポーリングする。
// =====================================================================

const COMMENT_WINDOW_MS = 30 * 60 * 1000 // セット選択完了後、30分以内のランダムなタイミングでコメント
const LIKE_WINDOW_MS = 5 * 60 * 1000 // 各コメント投稿後、5分以内のランダムなタイミングでいいね（同一コメント内でも分散）

export interface AccountInput {
  index: number // 1..（アカウント数）
  setNumber: number | null // 画面に表示されたセットの番号(1始まり)。未選択は null
  comment: string // 空文字ならコメントしない
  likeCount: number // そのコメントが受けるいいね数
}

export interface JobLog {
  time: string
  message: string
  level: 'info' | 'warn' | 'error'
}

export interface Job {
  id: string
  status: 'running' | 'completed' | 'failed'
  logs: JobLog[]
  startedAt: number
  finishedAt?: number
  error?: string
}

const jobs = new Map<string, Job>()

export function getJob(id: string): Job | undefined {
  return jobs.get(id)
}

function log(job: Job, message: string, level: JobLog['level'] = 'info') {
  job.logs.push({ time: new Date().toISOString(), message, level })
  // サーバーログにも出す
  const tag = level === 'error' ? '[ERR]' : level === 'warn' ? '[WARN]' : '[INFO]'
  console.log(`${tag} (job ${job.id.slice(0, 8)}) ${message}`)
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** ジョブを開始して jobId を返す（処理自体は非同期で進行） */
export function startJob(topicId: string, inputs: AccountInput[]): string {
  const id = randomUUID()
  const job: Job = { id, status: 'running', logs: [], startedAt: Date.now() }
  jobs.set(id, job)

  // バックグラウンド実行（await しない）
  runJob(job, topicId, inputs).catch((e) => {
    job.status = 'failed'
    job.error = e?.message ?? String(e)
    job.finishedAt = Date.now()
    log(job, `処理が異常終了しました: ${job.error}`, 'error')
  })

  return id
}

async function runJob(job: Job, topicId: string, inputs: AccountInput[]) {
  const password = process.env.ACCOUNT_PASSWORD
  if (!password) throw new Error('ACCOUNT_PASSWORD が未設定です')

  const defs = getAccountDefs()
  const nameOf = (index: number) => defs.find((d) => d.index === index)?.displayName ?? `#${index}`

  // --- 0. トピック取得してセット番号 -> set_id のマップを作る（取得は認証不要） ---
  log(job, 'トピック情報を取得しています...')
  const topic = await getTopic(topicId)
  const setIdByNumber = new Map<number, string>()
  topic.sets.forEach((s, i) => setIdByNumber.set(i + 1, s.set_id))
  log(job, `トピック「${topic.topic_name}」/ セット数 ${topic.sets.length}`)

  // 各アカウントの IDToken を取得する関数（キャッシュ前提）
  const tokenOf = async (index: number): Promise<string> => {
    const email = getAccountEmail(index)
    if (!email) throw new Error(`ACCOUNT_EMAIL_${index} が未設定です`)
    const r = await signIn(email, password)
    return r.idToken
  }

  // --- 1. セット選択 ---
  // setNumber が入力されているアカウントに対して pickSet を実行
  const pickers = inputs.filter((a) => a.setNumber != null)
  // 各アカウントが選択した set_id（後段のいいね対象プール判定に使う）
  const accountSetId = new Map<number, string>() // index -> set_id

  log(job, `セット選択を実行します（対象 ${pickers.length} アカウント）`)
  await Promise.all(
    pickers.map(async (a) => {
      const setId = setIdByNumber.get(a.setNumber!)
      if (!setId) {
        log(job, `${nameOf(a.index)}: セット番号 ${a.setNumber} は存在しません。スキップ`, 'warn')
        return
      }
      try {
        const token = await tokenOf(a.index)
        await pickSet(token, topicId, setId)
        accountSetId.set(a.index, setId)
        log(job, `${nameOf(a.index)}: セット${a.setNumber} を選択`)
      } catch (e: any) {
        log(job, `${nameOf(a.index)}: セット選択でエラー: ${e?.message ?? e}`, 'error')
      }
    }),
  )

  // --- 2 & 3. コメント投稿＋いいね（コメントごとに独立して実行） ---
  // 各コメントは「セット選択完了の直後〜COMMENT_WINDOW_MS 以内のランダムなタイミング」で投稿し、
  // 投稿が成功したら、そのコメントへのいいねを（他コメントの完了を待たず）すぐに開始する。
  // 同一コメントへのいいねも、アカウントごとに LIKE_WINDOW_MS 以内のランダムなタイミングへ分散させる。
  const commenters = inputs.filter((a) => a.comment.trim() !== '')
  log(
    job,
    `セット選択完了。コメント投稿を ${Math.round(COMMENT_WINDOW_MS / 60000)} 分以内のランダムタイミングで実行し、各コメント投稿後にそのコメントへのいいねを実行します（対象 ${commenters.length} アカウント）`,
  )

  await Promise.all(
    commenters.map(async (a) => {
      const setId = accountSetId.get(a.index)
      if (!setId) {
        log(job, `${nameOf(a.index)}: セット未選択のためコメントできません。スキップ`, 'warn')
        return
      }

      // (2) ランダムなタイミングでコメント投稿
      const delay = Math.floor(Math.random() * COMMENT_WINDOW_MS)
      await sleep(delay)
      let commentId: string
      try {
        const token = await tokenOf(a.index)
        commentId = await createComment(token, topicId, setId, a.comment)
        log(job, `${nameOf(a.index)}: コメント投稿（+${Math.round(delay / 1000)}秒, comment_id=${commentId}）`)
      } catch (e: any) {
        log(job, `${nameOf(a.index)}: コメント投稿でエラー: ${e?.message ?? e}`, 'error')
        return
      }

      // (3) このコメントへのいいねを投稿直後に開始（全コメントの完了は待たない）
      if (a.likeCount <= 0) return

      // 同じセットを選んでいるアカウント（本人を含む）がいいね候補プール
      const pool = pickers
        .filter((p) => accountSetId.get(p.index) === setId)
        .map((p) => p.index)

      let likers = shuffle(pool).slice(0, a.likeCount)
      if (a.likeCount > pool.length) {
        log(
          job,
          `${nameOf(a.index)} のコメント: 指定いいね数 ${a.likeCount} に対し同セット選択者は ${pool.length} 名のみ。${pool.length} 件で実行`,
          'warn',
        )
        likers = pool
      }

      // 各いいねを LIKE_WINDOW_MS 以内のランダムなタイミングへ分散
      await Promise.all(
        likers.map(async (likerIndex) => {
          const likeDelay = Math.floor(Math.random() * LIKE_WINDOW_MS)
          await sleep(likeDelay)
          try {
            const token = await tokenOf(likerIndex)
            await likeComment(token, setId, commentId)
            log(job, `${nameOf(likerIndex)} が ${nameOf(a.index)} のコメントにいいね（+${Math.round(likeDelay / 1000)}秒）`)
          } catch (e: any) {
            log(job, `${nameOf(likerIndex)}: いいねでエラー: ${e?.message ?? e}`, 'error')
          }
        }),
      )
    }),
  )

  job.status = 'completed'
  job.finishedAt = Date.now()
  log(job, 'すべての処理が完了しました')
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
