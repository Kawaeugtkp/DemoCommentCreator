// =====================================================================
//  アカウントの定義
// =====================================================================
//  ▼▼▼ 表示名はここにハードコーディングしてください ▼▼▼
//
//  - displayName : 画面に表示されるユーザーの表示名（ここを編集する）
//  - メールアドレス／パスワードは .env から読み込まれます
//    （メール: ACCOUNT_EMAIL_1〜29 / パスワード: ACCOUNT_PASSWORD 共通）
//
//  index は 1〜（この配列の件数）で、.env の ACCOUNT_EMAIL_{index} と対応します。
//  アカウント数を増減するときは、この ACCOUNT_DISPLAY_NAMES の件数を変更し、
//  あわせて nuxt.config.ts の accountEmail{n} と .env の ACCOUNT_EMAIL_{n} を揃えてください。
// =====================================================================

export interface AccountDef {
  index: number // 1..（ACCOUNT_DISPLAY_NAMES の件数）
  displayName: string
}

// ▼▼▼▼▼▼▼▼▼▼ ここで人数分の表示名を設定（現在 29 人） ▼▼▼▼▼▼▼▼▼▼
export const ACCOUNT_DISPLAY_NAMES: string[] = [
  'ユーザー01', // ACCOUNT_EMAIL_1
  'ユーザー02', // ACCOUNT_EMAIL_2
  'ユーザー03', // ACCOUNT_EMAIL_3
  'ユーザー04', // ACCOUNT_EMAIL_4
  'ユーザー05', // ACCOUNT_EMAIL_5
  'ユーザー06', // ACCOUNT_EMAIL_6
  'ユーザー07', // ACCOUNT_EMAIL_7
  'ユーザー08', // ACCOUNT_EMAIL_8
  'ユーザー09', // ACCOUNT_EMAIL_9
  'ユーザー10', // ACCOUNT_EMAIL_10
  'ユーザー11', // ACCOUNT_EMAIL_11
  'ユーザー12', // ACCOUNT_EMAIL_12
  'ユーザー13', // ACCOUNT_EMAIL_13
  'ユーザー14', // ACCOUNT_EMAIL_14
  'ユーザー15', // ACCOUNT_EMAIL_15
  'ユーザー16', // ACCOUNT_EMAIL_16
  'ユーザー17', // ACCOUNT_EMAIL_17
  'ユーザー18', // ACCOUNT_EMAIL_18
  'ユーザー19', // ACCOUNT_EMAIL_19
  'ユーザー20', // ACCOUNT_EMAIL_20
  'ユーザー21', // ACCOUNT_EMAIL_21
  'ユーザー22', // ACCOUNT_EMAIL_22
  'ユーザー23', // ACCOUNT_EMAIL_23
  'ユーザー24', // ACCOUNT_EMAIL_24
  'ユーザー25', // ACCOUNT_EMAIL_25
  'ユーザー26', // ACCOUNT_EMAIL_26
  'ユーザー27', // ACCOUNT_EMAIL_27
  'ユーザー28', // ACCOUNT_EMAIL_28
  'ユーザー29', // ACCOUNT_EMAIL_29
]
// ▲▲▲▲▲▲▲▲▲▲ ここまで ▲▲▲▲▲▲▲▲▲▲

export function getAccountDefs(): AccountDef[] {
  return ACCOUNT_DISPLAY_NAMES.map((displayName, i) => ({
    index: i + 1,
    displayName,
  }))
}

/** 指定 index(1..ACCOUNT_DISPLAY_NAMES.length) のメールアドレスを実行時の環境変数から取得 */
export function getAccountEmail(index: number): string | undefined {
  return process.env[`ACCOUNT_EMAIL_${index}`]
}
