import { requireSession } from '../utils/session'
import { getTopic } from '../utils/chepics'

// topic_id を受け取り、トピック名・説明・セット一覧を返す
export default defineEventHandler(async (event) => {
  requireSession(event)

  const query = getQuery(event)
  const topicId = String(query.topic_id ?? '').trim()
  if (!topicId) {
    throw createError({ statusCode: 400, statusMessage: 'topic_id を指定してください' })
  }

  // トピック取得は認証不要
  const topic = await getTopic(topicId)

  return {
    topic_id: topic.topic_id,
    topic_name: topic.topic_name,
    topic_description: topic.topic_description,
    sets: topic.sets.map((s, i) => ({
      number: i + 1,
      set_id: s.set_id,
      set_name: s.set_name,
    })),
  }
})
