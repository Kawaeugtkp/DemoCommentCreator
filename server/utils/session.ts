import { randomUUID } from 'node:crypto'
import type { H3Event } from 'h3'

// =====================================================================
//  セッション管理（サーバーメモリ内）
//  - ログイン成功時のみセッションを発行（= ログイン画面経由必須）
//  - httpOnly Cookie にセッションIDを保持（ブラウザのJSから読めない）
//  - 一定時間（SESSION_TTL_MS）操作が無ければセッション切れ
// =====================================================================

const SESSION_COOKIE = 'dcc_session'
const SESSION_TTL_MS = 30 * 60 * 1000 // 30分

interface SessionData {
  createdAt: number
  lastActiveAt: number
}

const sessions = new Map<string, SessionData>()

function isExpired(s: SessionData): boolean {
  return Date.now() - s.lastActiveAt > SESSION_TTL_MS
}

/** ログイン成功時に呼ぶ。新しいセッションを作成し Cookie をセット */
export function createSession(event: H3Event): string {
  const id = randomUUID()
  const now = Date.now()
  sessions.set(id, { createdAt: now, lastActiveAt: now })
  setCookie(event, SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    // 開発時(http)でも動くよう secure は本番のみ
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_MS / 1000,
  })
  return id
}

/** セッションが有効かを判定し、有効なら lastActive を更新する */
export function isAuthenticated(event: H3Event): boolean {
  const id = getCookie(event, SESSION_COOKIE)
  if (!id) return false
  const s = sessions.get(id)
  if (!s) return false
  if (isExpired(s)) {
    sessions.delete(id)
    return false
  }
  s.lastActiveAt = Date.now()
  return true
}

/** 認証必須のAPIで使用。未認証なら 401 を投げる */
export function requireSession(event: H3Event): void {
  if (!isAuthenticated(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}

export function destroySession(event: H3Event): void {
  const id = getCookie(event, SESSION_COOKIE)
  if (id) sessions.delete(id)
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}
