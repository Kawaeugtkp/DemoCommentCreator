// =====================================================================
//  Firebase Auth（Identity Toolkit REST API）でのサインイン
//  - email/password から IDToken を取得する
//  - IDToken は Chepics API の Authorization: Bearer に使用
// =====================================================================

interface SignInResult {
  idToken: string
  localId: string // Firebase UID
  email: string
}

const tokenCache = new Map<string, { idToken: string; localId: string; expiresAt: number }>()

/**
 * email/password でサインインし IDToken を返す。
 * 取得した IDToken は約1時間有効なため、その間はキャッシュを使い回す。
 */
export async function signIn(email: string, password: string): Promise<SignInResult> {
  const cached = tokenCache.get(email)
  if (cached && cached.expiresAt > Date.now() + 60_000) {
    return { idToken: cached.idToken, localId: cached.localId, email }
  }

  const apiKey = useRuntimeConfig().firebaseApiKey
  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'FIREBASE_API_KEY が未設定です' })
  }

  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // この Firebase APIキーは HTTP リファラ制限が掛かっているため、
      // 許可されたリファラ(https://chepics.com)を明示して送る必要がある。
      Referer: 'https://chepics.com',
    },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  })

  const data: any = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data?.error?.message || 'UNKNOWN_ERROR'
    throw createError({
      statusCode: 401,
      statusMessage: `Firebaseサインイン失敗 (${email}): ${msg}`,
    })
  }

  const expiresInSec = Number(data.expiresIn ?? 3600)
  tokenCache.set(email, {
    idToken: data.idToken,
    localId: data.localId,
    expiresAt: Date.now() + expiresInSec * 1000,
  })

  return { idToken: data.idToken, localId: data.localId, email }
}
