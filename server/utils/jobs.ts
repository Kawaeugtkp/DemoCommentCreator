import { randomUUID } from 'node:crypto'
import Queue from 'bull'
import { getAccountDefs, getAccountEmail } from './accounts'
import { signIn } from './firebase'
import { createComment, getTopic, likeComment, pickSet } from './chepics'

const COMMENT_WINDOW_MS = 30 * 60 * 1000
const LIKE_WINDOW_MS = 5 * 60 * 1000

export interface AccountInput {
  index: number
  setNumber: number | null
  comment: string
  likeCount: number
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

let queue: Queue.Queue<JobData> | null = null
let workerInitialized = false

interface JobData {
  topicId: string
  inputs: AccountInput[]
}

async function getQueue(): Promise<Queue.Queue<JobData>> {
  if (queue) return queue

  const redisUrl = process.env.REDIS_URL
  if (!redisUrl) {
    throw new Error('REDIS_URL が未設定です')
  }

  queue = new Queue<JobData>('execute-job', redisUrl)

  return queue
}

export async function startJob(topicId: string, inputs: AccountInput[]): Promise<string> {
  const q = await getQueue()
  const jobId = randomUUID()

  await q.add(
    { topicId, inputs },
    {
      jobId,
      attempts: 1,
      removeOnComplete: false,
      removeOnFail: false,
    },
  )

  return jobId
}

export async function getJob(id: string): Promise<Job | undefined> {
  const q = await getQueue()
  const bullJob = await q.getJob(id)

  if (!bullJob) return undefined

  const jobData = bullJob.data as JobData
  const logs: JobLog[] = []

  // ジョブのプログレスデータからログを復元
  // progress()は{logs: JobLog[]}の形式を想定
  if (bullJob._progress) {
    const progress = JSON.parse(String(bullJob._progress))
    if (progress.logs && Array.isArray(progress.logs)) {
      logs.push(...progress.logs)
    }
  }

  return {
    id: bullJob.id!,
    status: bullJob.isCompleted() ? 'completed' : bullJob.isFailed() ? 'failed' : 'running',
    logs,
    startedAt: bullJob.processedOn || bullJob.timestamp,
    finishedAt: bullJob.finishedOn,
    error: bullJob.failedReason,
  }
}

export async function initializeWorker() {
  if (workerInitialized) return

  const q = await getQueue()

  q.process(async (job) => {
    const data = job.data as JobData
    const logs: JobLog[] = []

    async function log(message: string, level: JobLog['level'] = 'info') {
      const entry: JobLog = { time: new Date().toISOString(), message, level }
      logs.push(entry)
      await job.progress({ logs })

      const tag = level === 'error' ? '[ERR]' : level === 'warn' ? '[WARN]' : '[INFO]'
      console.log(`${tag} (job ${job.id}) ${message}`)
    }

    try {
      await runJob(data.topicId, data.inputs, log)
    } catch (e: any) {
      const errorMsg = e?.message ?? String(e)
      await log(`処理が異常終了しました: ${errorMsg}`, 'error')
      throw e
    }
  })

  q.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed:`, err.message)
  })

  q.on('completed', (job) => {
    console.log(`Job ${job.id} completed`)
  })

  workerInitialized = true
}

async function runJob(
  topicId: string,
  inputs: AccountInput[],
  log: (message: string, level?: JobLog['level']) => Promise<void>,
) {
  const password = process.env.ACCOUNT_PASSWORD
  if (!password) throw new Error('ACCOUNT_PASSWORD が未設定です')

  const defs = getAccountDefs()
  const nameOf = (index: number) => defs.find((d) => d.index === index)?.displayName ?? `#${index}`

  log('トピック情報を取得しています...')
  const topic = await getTopic(topicId)
  const setIdByNumber = new Map<number, string>()
  topic.sets.forEach((s, i) => setIdByNumber.set(i + 1, s.set_id))
  log(`トピック「${topic.topic_name}」/ セット数 ${topic.sets.length}`)

  const tokenOf = async (index: number): Promise<string> => {
    const email = getAccountEmail(index)
    if (!email) throw new Error(`ACCOUNT_EMAIL_${index} が未設定です`)
    const r = await signIn(email, password)
    return r.idToken
  }

  const pickers = inputs.filter((a) => a.setNumber != null)
  const accountSetId = new Map<number, string>()

  log(`セット選択を実行します（対象 ${pickers.length} アカウント）`)
  await Promise.all(
    pickers.map(async (a) => {
      const setId = setIdByNumber.get(a.setNumber!)
      if (!setId) {
        log(`${nameOf(a.index)}: セット番号 ${a.setNumber} は存在しません。スキップ`, 'warn')
        return
      }
      try {
        const token = await tokenOf(a.index)
        await pickSet(token, topicId, setId)
        accountSetId.set(a.index, setId)
        log(`${nameOf(a.index)}: セット${a.setNumber} を選択`)
      } catch (e: any) {
        log(`${nameOf(a.index)}: セット選択でエラー: ${e?.message ?? e}`, 'error')
      }
    }),
  )

  const commenters = inputs.filter((a) => a.comment.trim() !== '')
  log(
    `セット選択完了。コメント投稿を ${Math.round(COMMENT_WINDOW_MS / 60000)} 分以内のランダムタイミングで実行し、各コメント投稿後にそのコメントへのいいねを実行します（対象 ${commenters.length} アカウント）`,
  )

  await Promise.all(
    commenters.map(async (a) => {
      const setId = accountSetId.get(a.index)
      if (!setId) {
        log(`${nameOf(a.index)}: セット未選択のためコメントできません。スキップ`, 'warn')
        return
      }

      const delay = Math.floor(Math.random() * COMMENT_WINDOW_MS)
      await sleep(delay)
      let commentId: string
      try {
        const token = await tokenOf(a.index)
        commentId = await createComment(token, topicId, setId, a.comment)
        log(`${nameOf(a.index)}: コメント投稿（+${Math.round(delay / 1000)}秒, comment_id=${commentId}）`)
      } catch (e: any) {
        log(`${nameOf(a.index)}: コメント投稿でエラー: ${e?.message ?? e}`, 'error')
        return
      }

      if (a.likeCount <= 0) return

      const pool = pickers
        .filter((p) => accountSetId.get(p.index) === setId)
        .map((p) => p.index)

      let likers = shuffle(pool).slice(0, a.likeCount)
      if (a.likeCount > pool.length) {
        log(
          `${nameOf(a.index)} のコメント: 指定いいね数 ${a.likeCount} に対し同セット選択者は ${pool.length} 名のみ。${pool.length} 件で実行`,
          'warn',
        )
        likers = pool
      }

      await Promise.all(
        likers.map(async (likerIndex) => {
          const likeDelay = Math.floor(Math.random() * LIKE_WINDOW_MS)
          await sleep(likeDelay)
          try {
            const token = await tokenOf(likerIndex)
            await likeComment(token, setId, commentId)
            log(`${nameOf(likerIndex)} が ${nameOf(a.index)} のコメントにいいね（+${Math.round(likeDelay / 1000)}秒）`)
          } catch (e: any) {
            log(`${nameOf(likerIndex)}: いいねでエラー: ${e?.message ?? e}`, 'error')
          }
        }),
      )
    }),
  )

  log('すべての処理が完了しました')
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
