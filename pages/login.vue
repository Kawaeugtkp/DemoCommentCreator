<script setup lang="ts">
const text = ref('')
const error = ref('')
const lockRemaining = ref(0)
const submitting = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

// 入室済みのロック状態を初期表示で取得
onMounted(async () => {
  try {
    const res = await $fetch<{ authenticated: boolean; lockRemainingSeconds: number }>(
      '/api/session',
    )
    if (res.authenticated) {
      await navigateTo('/')
      return
    }
    if (res.lockRemainingSeconds > 0) startCountdown(res.lockRemainingSeconds)
  } catch {
    /* noop */
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function startCountdown(sec: number) {
  lockRemaining.value = sec
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    lockRemaining.value -= 1
    if (lockRemaining.value <= 0) {
      lockRemaining.value = 0
      if (timer) clearInterval(timer)
      error.value = ''
    }
  }, 1000)
}

const lockedText = computed(() => {
  const s = lockRemaining.value
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}分${String(r).padStart(2, '0')}秒`
})

async function submit() {
  if (lockRemaining.value > 0 || submitting.value) return
  error.value = ''
  submitting.value = true
  try {
    await $fetch('/api/login', { method: 'POST', body: { text: text.value } })
    await navigateTo('/')
  } catch (e: any) {
    const sec = e?.data?.data?.lockRemainingSeconds ?? 0
    if (e?.statusCode === 429) {
      error.value = 'ログインがロックされています。'
    } else {
      error.value = 'ログインに失敗しました。10分間ログインできません。'
    }
    if (sec > 0) startCountdown(sec)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="wrap">
    <div class="card">
      <h1>ログイン</h1>
      <p class="sub">合言葉を入力してください</p>

      <input
        v-model="text"
        type="text"
        class="input"
        placeholder="合言葉"
        :disabled="lockRemaining > 0 || submitting"
        @keyup.enter="submit"
      />

      <button class="btn" :disabled="lockRemaining > 0 || submitting" @click="submit">
        {{ submitting ? '確認中...' : 'ログイン' }}
      </button>

      <p v-if="lockRemaining > 0" class="locked">
        ロック中：あと {{ lockedText }} はログインできません
      </p>
      <p v-else-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 40px 36px;
  width: 100%;
  max-width: 380px;
}
h1 {
  margin: 0 0 6px;
  font-size: 24px;
}
.sub {
  margin: 0 0 24px;
  color: #777;
  font-size: 14px;
}
.input {
  width: 100%;
  padding: 12px 14px;
  font-size: 16px;
  border: 1px solid #d9d9e3;
  border-radius: 9px;
  margin-bottom: 16px;
  outline: none;
}
.input:focus {
  border-color: #4263eb;
}
.btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: #4263eb;
  border: none;
  border-radius: 9px;
  cursor: pointer;
}
.btn:disabled {
  background: #aab4e8;
  cursor: not-allowed;
}
.error {
  margin-top: 16px;
  color: #e03131;
  font-size: 14px;
}
.locked {
  margin-top: 16px;
  color: #e8590c;
  font-size: 14px;
  font-weight: 600;
}
</style>
