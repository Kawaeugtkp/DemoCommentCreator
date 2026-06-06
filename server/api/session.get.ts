import { isAuthenticated } from '../utils/session'
import { getLockRemainingSeconds } from '../utils/lockout'

// 認証状態の確認（ルートガード／画面初期化で使用）
export default defineEventHandler((event) => {
  return {
    authenticated: isAuthenticated(event),
    lockRemainingSeconds: getLockRemainingSeconds(event),
  }
})
