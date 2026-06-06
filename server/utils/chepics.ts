// =====================================================================
//  Chepics API クライアント
//  - ドメイン: https://api.chepics.com
//  - 認証: Authorization: Bearer <Firebase IDToken>
// =====================================================================

const BASE_URL = 'https://api.chepics.com'

export interface TopicSet {
  set_id: string
  set_name: string
}

export interface TopicInfo {
  topic_id: string
  topic_name: string
  topic_description: string | null
  sets: TopicSet[]
}

function authHeaders(idToken: string): Record<string, string> {
  return { Authorization: `Bearer ${idToken}` }
}

async function parseError(res: Response): Promise<string> {
  const body: any = await res.json().catch(() => null)
  if (body?.message) return `${body.message} (error_code=${body.error_code ?? '-'})`
  return `HTTP ${res.status}`
}

/**
 * トピック取得: GET /v1/chepics/topic?topic_id=...&add=set
 * 認証トークンは不要。必要なのは topic_name / topic_description / set のみ。
 */
export async function getTopic(topicId: string): Promise<TopicInfo> {
  const url = `${BASE_URL}/v1/chepics/topic?topic_id=${encodeURIComponent(topicId)}&add=set`
  const res = await fetch(url)
  if (!res.ok) {
    throw createError({ statusCode: 400, statusMessage: `トピック取得失敗: ${await parseError(res)}` })
  }
  const data: any = await res.json()
  const sets: TopicSet[] = Array.isArray(data.set)
    ? data.set.map((s: any) => ({ set_id: s.set_id, set_name: s.set_name }))
    : []
  return {
    topic_id: data.topic_id,
    topic_name: data.topic_name,
    topic_description: data.topic_description ?? null,
    sets,
  }
}

/** セット選択: POST /v1/chepics/pick/set */
export async function pickSet(idToken: string, topicId: string, setId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/v1/chepics/pick/set`, {
    method: 'POST',
    headers: { ...authHeaders(idToken), 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic_id: topicId, set_id: setId }),
  })
  if (!res.ok) {
    throw new Error(`セット選択失敗: ${await parseError(res)}`)
  }
}

/** コメント投稿: POST /v1/chepics/comment (multipart/form-data) -> comment_id を返す */
export async function createComment(
  idToken: string,
  topicId: string,
  setId: string,
  comment: string,
): Promise<string> {
  const form = new FormData()
  form.append('topic_id', topicId)
  form.append('set_id', setId)
  form.append('comment', comment)

  const res = await fetch(`${BASE_URL}/v1/chepics/comment`, {
    method: 'POST',
    headers: authHeaders(idToken), // Content-Type は FormData が自動付与
    body: form,
  })
  if (!res.ok) {
    throw new Error(`コメント投稿失敗: ${await parseError(res)}`)
  }
  const data: any = await res.json()
  return data.comment_id as string
}

/** コメントへのいいね: POST /v1/chepics/comment/like */
export async function likeComment(idToken: string, setId: string, commentId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/v1/chepics/comment/like`, {
    method: 'POST',
    headers: { ...authHeaders(idToken), 'Content-Type': 'application/json' },
    body: JSON.stringify({ set_id: setId, comment_id: commentId }),
  })
  if (!res.ok) {
    throw new Error(`いいね失敗: ${await parseError(res)}`)
  }
}
