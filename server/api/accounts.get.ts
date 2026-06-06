import { requireSession } from '../utils/session'
import { getAccountDefs } from '../utils/accounts'

// 全アカウントの表示名一覧を返す（メール/パスワード等の機密は返さない）
export default defineEventHandler((event) => {
  requireSession(event)
  return { accounts: getAccountDefs() }
})
