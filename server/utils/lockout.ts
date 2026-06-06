import { randomUUID } from 'node:crypto'
import type { H3Event } from 'h3'

// =====================================================================
//  ログイン失敗時のロックアウト管理
//  - 「同一ブラウザから10分間ログイン不可」を実現
//  - ブラウザ識別用の永続Cookie(dcc_bid)をキーにサーバー側で記録
// =====================================================================

const BROWSER_COOKIE = 'dcc_bid'
const LOCKOUT_MS = 10 * 60 * 1000 // 10分

interface LockInfo {
  lockedUntil: number // epoch ms（0なら未ロック）
}

const locks = new Map<string, LockInfo>()

/** ブラウザ識別子を取得（無ければ発行してCookieにセット） */
function getBrowserId(event: H3Event): string {
  let bid = getCookie(event, BROWSER_COOKIE)
  if (!bid) {
    bid = randomUUID()
    setCookie(event, BROWSER_COOKIE, bid, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365, // 1年
    })
  }
  return bid
}

/** ロック中なら残り秒数を返す。ロックされていなければ 0 */
export function getLockRemainingSeconds(event: H3Event): number {
  const bid = getBrowserId(event)
  const info = locks.get(bid)
  if (!info) return 0
  const remain = info.lockedUntil - Date.now()
  if (remain <= 0) {
    locks.delete(bid)
    return 0
  }
  return Math.ceil(remain / 1000)
}

/** ログイン失敗を記録し、このブラウザを10分間ロックする */
export function lockBrowser(event: H3Event): number {
  const bid = getBrowserId(event)
  const lockedUntil = Date.now() + LOCKOUT_MS
  locks.set(bid, { lockedUntil })
  return Math.ceil(LOCKOUT_MS / 1000)
}

/** ログイン成功時にロックを解除 */
export function clearLock(event: H3Event): void {
  const bid = getBrowserId(event)
  locks.delete(bid)
}
