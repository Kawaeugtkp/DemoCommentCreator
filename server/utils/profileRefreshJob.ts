import { randomUUID } from 'node:crypto'
import Queue from 'bull'
import { getAccountDefs, getAccountEmail } from './accounts'
import { signIn } from './firebase'
import { getUserProfile } from './chepics'
import { setProfileOverride } from './profileOverrides'
import type { JobLog } from './jobs'

// 同時に叩くリクエスト数。execute-job と同様、待ち時間の大半が I/O 待ちのため多めに設定。
const CONCURRENCY = 100

export interface RefreshJob {
  id: string
  status: 'running' | 'completed' | 'failed'
  logs: JobLog[]
  startedAt: number
  finishedAt?: number
  error?: string
}

let queue: Queue.Queue<Record<string, never>> | null = null
let workerInitialized = false

async function getQueue(): Promise<Queue.Queue<Record<string, never>>> {
  if (queue) return queue

  const redisUrl = process.env.REDIS_URL
  if (!redisUrl) {
    throw new Error('REDIS_URL が未設定です')
  }

  queue = new Queue('refresh-profiles-job', redisUrl, {
    settings: { maxStalledCount: 0 },
  })

  return queue
}

export async function startRefreshJob(): Promise<string> {
  const q = await getQueue()
  const jobId = randomUUID()

  await q.add(
    {},
    {
      jobId,
      attempts: 1,
      removeOnComplete: false,
      removeOnFail: false,
    },
  )

  return jobId
}

export async function getRefreshJob(id: string): Promise<RefreshJob | undefined> {
  const q = await getQueue()
  const bullJob = await q.getJob(id)

  if (!bullJob) return undefined

  const logs: JobLog[] = []
  const progress = bullJob.progress() as unknown
  if (progress && typeof progress === 'object' && Array.isArray((progress as { logs?: unknown }).logs)) {
    logs.push(...((progress as { logs: JobLog[] }).logs))
  }

  const state = await bullJob.getState()
  const status: RefreshJob['status'] =
    state === 'completed' ? 'completed' : state === 'failed' ? 'failed' : 'running'

  return {
    id: String(bullJob.id),
    status,
    logs,
    startedAt: bullJob.processedOn || bullJob.timestamp,
    finishedAt: bullJob.finishedOn ?? undefined,
    error: bullJob.failedReason,
  }
}

export async function initializeRefreshWorker() {
  if (workerInitialized) return

  const q = await getQueue()
  await q.empty().catch(() => {})

  q.process(CONCURRENCY, async (job) => {
    const logs: JobLog[] = []

    async function log(message: string, level: JobLog['level'] = 'info') {
      const entry: JobLog = { time: new Date().toISOString(), message, level }
      logs.push(entry)
      await job.progress({ logs })

      const tag = level === 'error' ? '[ERR]' : level === 'warn' ? '[WARN]' : '[INFO]'
      console.log(`${tag} (refresh-job ${job.id}) ${message}`)
    }

    try {
      await runRefreshJob(log)
    } catch (e: any) {
      const errorMsg = e?.message ?? String(e)
      await log(`処理が異常終了しました: ${errorMsg}`, 'error')
      throw e
    }
  })

  q.on('failed', (job, err) => {
    console.error(`Refresh job ${job.id} failed:`, err.message)
  })

  workerInitialized = true
}

async function runRefreshJob(log: (message: string, level?: JobLog['level']) => Promise<void>) {
  const password = process.env.ACCOUNT_PASSWORD
  if (!password) throw new Error('ACCOUNT_PASSWORD が未設定です')

  const defs = getAccountDefs()
  log(`${defs.length} 件のアカウントの最新プロフィールを取得します`)

  let successCount = 0
  let errorCount = 0

  await Promise.all(
    defs.map(async (def) => {
      const email = getAccountEmail(def.index)
      if (!email) {
        log(`${def.displayName}: ACCOUNT_EMAIL_${def.index} が未設定のためスキップ`, 'warn')
        return
      }
      try {
        const { idToken, localId } = await signIn(email, password)
        const profile = await getUserProfile(idToken, localId)
        await setProfileOverride(def.index, {
          chepicsName: profile.displayName,
          bio: profile.bio,
          updatedAt: new Date().toISOString(),
        })
        successCount++
        log(`${def.displayName}: 更新しました（${profile.displayName || '(表示名なし)'}）`)
      } catch (e: any) {
        errorCount++
        log(`${def.displayName}: 取得に失敗しました: ${e?.message ?? e}`, 'error')
      }
    }),
  )

  log(`完了しました（成功 ${successCount} 件 / 失敗 ${errorCount} 件）`)
}
