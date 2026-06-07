// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: true,

  // 秘密情報（LOGIN_TEXT / FIREBASE_* / ACCOUNT_PASSWORD / ACCOUNT_EMAIL_*）は
  // runtimeConfig に置かない。runtimeConfig はビルド時に値が焼き込まれるため、
  // Docker ビルド時に env が無い Render 等では空になってしまう。
  // → サーバーコード(server/)内で実行時に process.env から直接読む。
})
