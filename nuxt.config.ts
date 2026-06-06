// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: true,

  // runtimeConfig: ここに置いた値はサーバー専用（ブラウザに露出しない）。
  // public 配下のみクライアントに公開される。機密値は public に置かないこと。
  runtimeConfig: {
    // ログイン用の固定文字列
    loginText: process.env.LOGIN_TEXT,

    // Firebase Auth (Identity Toolkit REST) 用
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,

    // 全アカウント共通パスワード
    accountPassword: process.env.ACCOUNT_PASSWORD,

    // アカウントのメールアドレス（.env から読み込み / 現在 29 アカウント）
    accountEmail1: process.env.ACCOUNT_EMAIL_1,
    accountEmail2: process.env.ACCOUNT_EMAIL_2,
    accountEmail3: process.env.ACCOUNT_EMAIL_3,
    accountEmail4: process.env.ACCOUNT_EMAIL_4,
    accountEmail5: process.env.ACCOUNT_EMAIL_5,
    accountEmail6: process.env.ACCOUNT_EMAIL_6,
    accountEmail7: process.env.ACCOUNT_EMAIL_7,
    accountEmail8: process.env.ACCOUNT_EMAIL_8,
    accountEmail9: process.env.ACCOUNT_EMAIL_9,
    accountEmail10: process.env.ACCOUNT_EMAIL_10,
    accountEmail11: process.env.ACCOUNT_EMAIL_11,
    accountEmail12: process.env.ACCOUNT_EMAIL_12,
    accountEmail13: process.env.ACCOUNT_EMAIL_13,
    accountEmail14: process.env.ACCOUNT_EMAIL_14,
    accountEmail15: process.env.ACCOUNT_EMAIL_15,
    accountEmail16: process.env.ACCOUNT_EMAIL_16,
    accountEmail17: process.env.ACCOUNT_EMAIL_17,
    accountEmail18: process.env.ACCOUNT_EMAIL_18,
    accountEmail19: process.env.ACCOUNT_EMAIL_19,
    accountEmail20: process.env.ACCOUNT_EMAIL_20,
    accountEmail21: process.env.ACCOUNT_EMAIL_21,
    accountEmail22: process.env.ACCOUNT_EMAIL_22,
    accountEmail23: process.env.ACCOUNT_EMAIL_23,
    accountEmail24: process.env.ACCOUNT_EMAIL_24,
    accountEmail25: process.env.ACCOUNT_EMAIL_25,
    accountEmail26: process.env.ACCOUNT_EMAIL_26,
    accountEmail27: process.env.ACCOUNT_EMAIL_27,
    accountEmail28: process.env.ACCOUNT_EMAIL_28,
    accountEmail29: process.env.ACCOUNT_EMAIL_29,

    public: {
      // クライアントへ公開してよい値のみ
    },
  },
})
