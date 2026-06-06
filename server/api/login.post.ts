import { clearLock, getLockRemainingSeconds, lockBrowser } from '../utils/lockout'
import { createSession } from '../utils/session'

// ログイン: 固定文字列(LOGIN_TEXT)との一致を判定。
// 失敗すると同一ブラウザから10分間ロックされる。
export default defineEventHandler(async (event) => {
  // すでにロック中なら即拒否
  const remaining = getLockRemainingSeconds(event)
  if (remaining > 0) {
    throw createError({
      statusCode: 429,
      statusMessage: 'locked',
      data: { lockRemainingSeconds: remaining },
    })
  }

  const body = await readBody<{ text?: string }>(event)
  const expected = useRuntimeConfig().loginText

  if (!expected) {
    throw createError({ statusCode: 500, statusMessage: 'LOGIN_TEXT が未設定です' })
  }

  if (!body?.text || body.text !== expected) {
    const lockSec = lockBrowser(event)
    throw createError({
      statusCode: 401,
      statusMessage: 'invalid',
      data: { lockRemainingSeconds: lockSec },
    })
  }

  // 成功: ロック解除＆セッション発行
  clearLock(event)
  createSession(event)
  return { ok: true }
})
