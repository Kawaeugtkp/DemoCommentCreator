import { requireSession } from '../utils/session'
import { startJob, type AccountInput } from '../utils/jobs'

interface ExecuteBody {
  topic_id?: string
  accounts?: Array<{
    index: number
    setNumber: number | null
    comment: string
    likeCount: number
  }>
}

// 実行ボタン押下で呼ばれる。入力を検証してバックグラウンドジョブを開始し jobId を返す。
export default defineEventHandler(async (event) => {
  requireSession(event)

  const body = await readBody<ExecuteBody>(event)
  const topicId = body?.topic_id?.trim()
  if (!topicId) {
    throw createError({ statusCode: 400, statusMessage: 'topic_id が必要です' })
  }
  if (!Array.isArray(body.accounts)) {
    throw createError({ statusCode: 400, statusMessage: 'accounts が不正です' })
  }

  const inputs: AccountInput[] = body.accounts.map((a) => ({
    index: a.index,
    setNumber:
      a.setNumber === null || a.setNumber === undefined || Number.isNaN(Number(a.setNumber))
        ? null
        : Number(a.setNumber),
    comment: typeof a.comment === 'string' ? a.comment : '',
    likeCount: Number.isFinite(Number(a.likeCount)) ? Math.max(0, Math.floor(Number(a.likeCount))) : 0,
  }))

  // コメントがあるのにセット未選択のアカウントはエラー（コメント投稿に set_id が必須のため）
  const invalid = inputs.filter((a) => a.comment.trim() !== '' && a.setNumber == null)
  if (invalid.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `コメントが入力されていますがセット未選択のアカウントがあります: ${invalid
        .map((a) => `#${a.index}`)
        .join(', ')}`,
    })
  }

  const jobId = startJob(topicId, inputs)
  return { jobId }
})
