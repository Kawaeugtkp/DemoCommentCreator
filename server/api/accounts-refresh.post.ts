import { requireSession } from '../utils/session'
import { startRefreshJob } from '../utils/profileRefreshJob'

// 「最新情報に更新」ボタン押下で呼ばれる。全アカウントのプロフィール再取得ジョブを開始し jobId を返す。
export default defineEventHandler(async (event) => {
  requireSession(event)
  const jobId = await startRefreshJob()
  return { jobId }
})
