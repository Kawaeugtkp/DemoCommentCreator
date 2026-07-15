// =====================================================================
//  アカウントのプロフィール（display_name / bio）の最新値を Redis に保持する。
//  server/utils/accounts.ts のハードコード値はフォールバックとして残し、
//  ここに保存された値があればそちらを優先して表示する。
// =====================================================================

import { createClient, type RedisClientType } from 'redis'

export interface ProfileOverride {
  chepicsName: string
  bio: string
  updatedAt: string
}

const REDIS_KEY = 'account_profile_overrides' // hash: index(string) -> JSON(ProfileOverride)

let client: RedisClientType | null = null
let connecting: Promise<RedisClientType> | null = null

async function getClient(): Promise<RedisClientType> {
  if (client) return client
  if (connecting) return connecting

  const redisUrl = process.env.REDIS_URL
  if (!redisUrl) {
    throw new Error('REDIS_URL が未設定です')
  }

  connecting = (async () => {
    const c: RedisClientType = createClient({ url: redisUrl })
    c.on('error', (e) => console.error('[redis] error', e))
    await c.connect()
    client = c
    return c
  })()

  return connecting
}

export async function setProfileOverride(index: number, override: ProfileOverride): Promise<void> {
  const c = await getClient()
  await c.hSet(REDIS_KEY, String(index), JSON.stringify(override))
}

export async function getAllProfileOverrides(): Promise<Map<number, ProfileOverride>> {
  const c = await getClient()
  const raw = await c.hGetAll(REDIS_KEY)
  const map = new Map<number, ProfileOverride>()
  for (const [key, value] of Object.entries(raw)) {
    try {
      map.set(Number(key), JSON.parse(value) as ProfileOverride)
    } catch {
      // 壊れたエントリは無視
    }
  }
  return map
}
