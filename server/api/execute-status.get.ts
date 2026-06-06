import { requireSession } from '../utils/session'
import { getJob } from '../utils/jobs'

// ジョブの進捗をポーリングで取得
export default defineEventHandler((event) => {
  requireSession(event)
  const id = String(getQuery(event).jobId ?? '')
  const job = getJob(id)
  if (!job) {
    throw createError({ statusCode: 404, statusMessage: 'ジョブが見つかりません' })
  }
  return {
    id: job.id,
    status: job.status,
    logs: job.logs,
    startedAt: job.startedAt,
    finishedAt: job.finishedAt,
    error: job.error,
  }
})
