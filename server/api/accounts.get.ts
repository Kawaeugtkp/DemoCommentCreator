import { requireSession } from '../utils/session'
import { getAccountDefs } from '../utils/accounts'
import { getAllProfileOverrides } from '../utils/profileOverrides'

// 全アカウントの表示名一覧を返す（メール/パスワード等の機密は返さない）
// Redis に最新プロフィール（display_name/bio）が保存されていればそちらを優先する。
export default defineEventHandler(async (event) => {
  requireSession(event)

  const overrides = await getAllProfileOverrides().catch(() => new Map())
  const accounts = getAccountDefs().map((a) => {
    const o = overrides.get(a.index)
    return o ? { ...a, chepicsName: o.chepicsName, bio: o.bio } : a
  })

  return { accounts }
})
