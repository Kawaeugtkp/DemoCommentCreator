<script setup lang="ts">
interface TopicSet {
  number: number
  set_id: string
  set_name: string
}
interface TopicData {
  topic_id: string
  topic_name: string
  topic_description: string | null
  sets: TopicSet[]
}
interface AccountDef {
  index: number
  displayName: string
}
interface JobLog {
  time: string
  message: string
  level: 'info' | 'warn' | 'error'
}

// --- アカウント一覧（表示名）を取得 ---
const { data: accountsData } = await useFetch<{ accounts: AccountDef[] }>('/api/accounts')

interface AccountForm {
  index: number
  displayName: string
  // 入力欄は type="text"（inputmode=numeric）なので値は常に文字列。
  // 念のため number も許容（送信時に String()→Number() で正規化）
  setNumber: string | number
  comment: string
  likeCount: string | number
}
const accounts = ref<AccountForm[]>(
  (accountsData.value?.accounts ?? []).map((a) => ({
    index: a.index,
    displayName: a.displayName,
    setNumber: '',
    comment: '',
    likeCount: '',
  })),
)

// --- トピック取得 ---
const topicId = ref('')
const topic = ref<TopicData | null>(null)
const topicLoading = ref(false)
const topicError = ref('')

async function fetchTopic() {
  topicError.value = ''
  topic.value = null
  if (!topicId.value.trim()) {
    topicError.value = 'topic_id を入力してください'
    return
  }
  topicLoading.value = true
  try {
    topic.value = await $fetch<TopicData>('/api/topic', {
      query: { topic_id: topicId.value.trim() },
    })
  } catch (e: any) {
    topicError.value = e?.statusMessage || e?.data?.statusMessage || 'トピック取得に失敗しました'
  } finally {
    topicLoading.value = false
  }
}

// --- 実行 ---
const running = ref(false)
const jobId = ref<string | null>(null)
const logs = ref<JobLog[]>([])
const jobStatus = ref<'running' | 'completed' | 'failed' | null>(null)
const execError = ref('')
let pollTimer: ReturnType<typeof setInterval> | null = null

const maxSetNumber = computed(() => topic.value?.sets.length ?? 0)

async function execute() {
  execError.value = ''
  if (!topic.value) {
    execError.value = '先にトピックを取得してください'
    return
  }
  // セット番号の簡易バリデーション
  for (const a of accounts.value) {
    const setNumberStr = String(a.setNumber).trim()
    if (setNumberStr !== '') {
      const n = Number(setNumberStr)
      if (!Number.isInteger(n) || n < 1 || n > maxSetNumber.value) {
        execError.value = `${a.displayName}: セット番号は 1〜${maxSetNumber.value} で入力してください`
        return
      }
    }
    if (a.comment.trim() !== '' && setNumberStr === '') {
      execError.value = `${a.displayName}: コメントを投稿するにはセット番号の入力が必要です`
      return
    }
  }

  running.value = true
  logs.value = []
  jobStatus.value = 'running'
  try {
    const res = await $fetch<{ jobId: string }>('/api/execute', {
      method: 'POST',
      body: {
        topic_id: topic.value.topic_id,
        accounts: accounts.value.map((a) => ({
          index: a.index,
          setNumber: String(a.setNumber).trim() === '' ? null : Number(a.setNumber),
          comment: a.comment,
          likeCount: String(a.likeCount).trim() === '' ? 0 : Number(a.likeCount),
        })),
      },
    })
    jobId.value = res.jobId
    startPolling()
  } catch (e: any) {
    execError.value = e?.statusMessage || e?.data?.statusMessage || '実行に失敗しました'
    running.value = false
    jobStatus.value = null
  }
}

function startPolling() {
  if (pollTimer) clearInterval(pollTimer)
  pollTimer = setInterval(async () => {
    if (!jobId.value) return
    try {
      const res = await $fetch<{ status: typeof jobStatus.value; logs: JobLog[] }>(
        '/api/execute-status',
        { query: { jobId: jobId.value } },
      )
      logs.value = res.logs
      jobStatus.value = res.status
      if (res.status !== 'running') {
        running.value = false
        if (pollTimer) clearInterval(pollTimer)
      }
    } catch {
      /* セッション切れ等。ポーリング継続せず停止 */
      if (pollTimer) clearInterval(pollTimer)
      running.value = false
    }
  }, 1500)
}

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})

async function logout() {
  await $fetch('/api/logout', { method: 'POST' })
  await navigateTo('/login')
}

function logColor(level: JobLog['level']) {
  if (level === 'error') return '#e03131'
  if (level === 'warn') return '#e8590c'
  return '#333'
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ja-JP')
}
</script>

<template>
  <div class="page">
    <header class="topbar">
      <h1>コメント作成ツール</h1>
      <button class="logout" @click="logout">ログアウト</button>
    </header>

    <!-- トピック取得 -->
    <section class="card">
      <h2>トピック</h2>
      <div class="topic-input">
        <input
          v-model="topicId"
          class="input"
          placeholder="topic_id を入力"
          @keyup.enter="fetchTopic"
        />
        <button class="btn" :disabled="topicLoading" @click="fetchTopic">
          {{ topicLoading ? '取得中...' : '取得' }}
        </button>
      </div>
      <p v-if="topicError" class="error">{{ topicError }}</p>

      <div v-if="topic" class="topic-view">
        <h3 class="topic-title">{{ topic.topic_name }}</h3>
        <p class="topic-desc">{{ topic.topic_description || '（説明なし）' }}</p>

        <h4>セット一覧</h4>
        <ol class="set-list">
          <li v-for="s in topic.sets" :key="s.set_id">
            <span class="set-no">{{ s.number }}</span>
            <span class="set-name">{{ s.set_name }}</span>
          </li>
        </ol>
      </div>
    </section>

    <!-- アカウント一覧 -->
    <section v-if="topic" class="card">
      <h2>アカウント（{{ accounts.length }}名）</h2>
      <p class="hint">
        各アカウントに「選択するセット番号（1〜{{ maxSetNumber }}）」「コメント」「そのコメントへのいいね数」を入力します。
        空欄の項目は実行されません。
      </p>
      <table class="acc-table">
        <thead>
          <tr>
            <th class="c-name">表示名</th>
            <th class="c-set">セット番号</th>
            <th class="c-comment">コメント</th>
            <th class="c-like">いいね数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in accounts" :key="a.index">
            <td class="c-name">{{ a.displayName }}</td>
            <td class="c-set">
              <input
                v-model="a.setNumber"
                class="cell-input"
                type="text"
                inputmode="numeric"
                placeholder="-"
              />
            </td>
            <td class="c-comment">
              <input v-model="a.comment" class="cell-input" placeholder="コメント（任意）" />
            </td>
            <td class="c-like">
              <input
                v-model="a.likeCount"
                class="cell-input"
                type="text"
                inputmode="numeric"
                placeholder="0"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- 実行 -->
    <section v-if="topic" class="card">
      <button class="run-btn" :disabled="running" @click="execute">
        {{ running ? '実行中...' : '実行' }}
      </button>
      <p v-if="execError" class="error">{{ execError }}</p>

      <div v-if="jobStatus" class="status">
        <p class="status-line">
          状態:
          <span :class="['badge', jobStatus]">
            {{ jobStatus === 'running' ? '実行中' : jobStatus === 'completed' ? '完了' : '失敗' }}
          </span>
        </p>
        <div class="log-box">
          <div v-for="(l, i) in logs" :key="i" class="log-line">
            <span class="log-time">{{ fmtTime(l.time) }}</span>
            <span :style="{ color: logColor(l.level) }">{{ l.message }}</span>
          </div>
          <p v-if="logs.length === 0" class="log-empty">処理を開始しています...</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  max-width: 980px;
  margin: 0 auto;
  padding: 24px 20px 80px;
}
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.topbar h1 {
  font-size: 22px;
  margin: 0;
}
.logout {
  background: #fff;
  border: 1px solid #d9d9e3;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 14px;
}
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 22px 24px;
  margin-bottom: 20px;
}
.card h2 {
  margin: 0 0 14px;
  font-size: 18px;
}
.topic-input {
  display: flex;
  gap: 10px;
}
.input {
  flex: 1;
  padding: 10px 12px;
  font-size: 15px;
  border: 1px solid #d9d9e3;
  border-radius: 8px;
  outline: none;
}
.input:focus {
  border-color: #4263eb;
}
.btn {
  padding: 10px 20px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: #4263eb;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.btn:disabled {
  background: #aab4e8;
}
.topic-view {
  margin-top: 18px;
  border-top: 1px solid #eee;
  padding-top: 16px;
}
.topic-title {
  margin: 0 0 8px;
  font-size: 19px;
}
.topic-desc {
  white-space: pre-wrap;
  color: #444;
  margin: 0 0 16px;
}
.set-list {
  margin: 8px 0 0;
  padding-left: 0;
  list-style: none;
}
.set-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
}
.set-no {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #4263eb;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}
.set-name {
  font-size: 15px;
}
.hint {
  color: #777;
  font-size: 13px;
  margin: 0 0 14px;
}
.acc-table {
  width: 100%;
  border-collapse: collapse;
}
.acc-table th,
.acc-table td {
  border-bottom: 1px solid #eee;
  padding: 8px 8px;
  text-align: left;
  vertical-align: middle;
}
.acc-table th {
  font-size: 13px;
  color: #666;
  font-weight: 600;
}
.c-name {
  width: 130px;
  font-size: 14px;
}
.c-set {
  width: 110px;
}
.c-like {
  width: 100px;
}
.cell-input {
  width: 100%;
  padding: 7px 9px;
  font-size: 14px;
  border: 1px solid #d9d9e3;
  border-radius: 7px;
  outline: none;
}
.cell-input:focus {
  border-color: #4263eb;
}
.run-btn {
  width: 100%;
  padding: 14px;
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  background: #2f9e44;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
.run-btn:disabled {
  background: #9ccfa9;
}
.status {
  margin-top: 18px;
}
.status-line {
  font-size: 14px;
}
.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}
.badge.running {
  background: #4263eb;
}
.badge.completed {
  background: #2f9e44;
}
.badge.failed {
  background: #e03131;
}
.log-box {
  margin-top: 10px;
  background: #f8f9fb;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px 14px;
  max-height: 360px;
  overflow-y: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
}
.log-line {
  display: flex;
  gap: 10px;
  padding: 2px 0;
}
.log-time {
  color: #aaa;
  flex-shrink: 0;
}
.log-empty {
  color: #999;
  margin: 0;
}
.error {
  color: #e03131;
  font-size: 14px;
  margin: 10px 0 0;
}
</style>
