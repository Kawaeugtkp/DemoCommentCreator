// =====================================================================
//  アカウントの定義
// =====================================================================
//  ▼▼▼ 表示名はここにハードコーディングしてください ▼▼▼
//
//  - displayName : 画面に表示されるユーザーの表示名（ここを編集する）
//  - メールアドレス／パスワードは .env から読み込まれます
//    （メール: ACCOUNT_EMAIL_1〜130 / パスワード: ACCOUNT_PASSWORD 共通）
//
//  index は 1〜（この配列の件数）で、.env の ACCOUNT_EMAIL_{index} と対応します。
//  アカウント数を増減するときは、この ACCOUNT_DISPLAY_NAMES の件数を変更し、
//  あわせて nuxt.config.ts の accountEmail{n} と .env の ACCOUNT_EMAIL_{n} を揃えてください。
// =====================================================================

export interface AccountDef {
  index: number // 1..（ACCOUNT_DISPLAY_NAMES の件数）
  displayName: string
}

// ▼▼▼▼▼▼▼▼▼▼ ここで人数分の表示名を設定（現在 130 人） ▼▼▼▼▼▼▼▼▼▼
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
  'ユーザー30', // ACCOUNT_EMAIL_30
  'ユーザー31', // ACCOUNT_EMAIL_31
  'ユーザー32', // ACCOUNT_EMAIL_32
  'ユーザー33', // ACCOUNT_EMAIL_33
  'ユーザー34', // ACCOUNT_EMAIL_34
  'ユーザー35', // ACCOUNT_EMAIL_35
  'ユーザー36', // ACCOUNT_EMAIL_36
  'ユーザー37', // ACCOUNT_EMAIL_37
  'ユーザー38', // ACCOUNT_EMAIL_38
  'ユーザー39', // ACCOUNT_EMAIL_39
  'ユーザー40', // ACCOUNT_EMAIL_40
  'ユーザー41', // ACCOUNT_EMAIL_41
  'ユーザー42', // ACCOUNT_EMAIL_42
  'ユーザー43', // ACCOUNT_EMAIL_43
  'ユーザー44', // ACCOUNT_EMAIL_44
  'ユーザー45', // ACCOUNT_EMAIL_45
  'ユーザー46', // ACCOUNT_EMAIL_46
  'ユーザー47', // ACCOUNT_EMAIL_47
  'ユーザー48', // ACCOUNT_EMAIL_48
  'ユーザー49', // ACCOUNT_EMAIL_49
  'ユーザー50', // ACCOUNT_EMAIL_50
  'ユーザー51', // ACCOUNT_EMAIL_51
  'ユーザー52', // ACCOUNT_EMAIL_52
  'ユーザー53', // ACCOUNT_EMAIL_53
  'ユーザー54', // ACCOUNT_EMAIL_54
  'ユーザー55', // ACCOUNT_EMAIL_55
  'ユーザー56', // ACCOUNT_EMAIL_56
  'ユーザー57', // ACCOUNT_EMAIL_57
  'ユーザー58', // ACCOUNT_EMAIL_58
  'ユーザー59', // ACCOUNT_EMAIL_59
  'ユーザー60', // ACCOUNT_EMAIL_60
  'ユーザー61', // ACCOUNT_EMAIL_61
  'ユーザー62', // ACCOUNT_EMAIL_62
  'ユーザー63', // ACCOUNT_EMAIL_63
  'ユーザー64', // ACCOUNT_EMAIL_64
  'ユーザー65', // ACCOUNT_EMAIL_65
  'ユーザー66', // ACCOUNT_EMAIL_66
  'ユーザー67', // ACCOUNT_EMAIL_67
  'ユーザー68', // ACCOUNT_EMAIL_68
  'ユーザー69', // ACCOUNT_EMAIL_69
  'ユーザー70', // ACCOUNT_EMAIL_70
  'ユーザー71', // ACCOUNT_EMAIL_71
  'ユーザー72', // ACCOUNT_EMAIL_72
  'ユーザー73', // ACCOUNT_EMAIL_73
  'ユーザー74', // ACCOUNT_EMAIL_74
  'ユーザー75', // ACCOUNT_EMAIL_75
  'ユーザー76', // ACCOUNT_EMAIL_76
  'ユーザー77', // ACCOUNT_EMAIL_77
  'ユーザー78', // ACCOUNT_EMAIL_78
  'ユーザー79', // ACCOUNT_EMAIL_79
  'ユーザー80', // ACCOUNT_EMAIL_80
  'ユーザー81', // ACCOUNT_EMAIL_81
  'ユーザー82', // ACCOUNT_EMAIL_82
  'ユーザー83', // ACCOUNT_EMAIL_83
  'ユーザー84', // ACCOUNT_EMAIL_84
  'ユーザー85', // ACCOUNT_EMAIL_85
  'ユーザー86', // ACCOUNT_EMAIL_86
  'ユーザー87', // ACCOUNT_EMAIL_87
  'ユーザー88', // ACCOUNT_EMAIL_88
  'ユーザー89', // ACCOUNT_EMAIL_89
  'ユーザー90', // ACCOUNT_EMAIL_90
  'ユーザー91', // ACCOUNT_EMAIL_91
  'ユーザー92', // ACCOUNT_EMAIL_92
  'ユーザー93', // ACCOUNT_EMAIL_93
  'ユーザー94', // ACCOUNT_EMAIL_94
  'ユーザー95', // ACCOUNT_EMAIL_95
  'ユーザー96', // ACCOUNT_EMAIL_96
  'ユーザー97', // ACCOUNT_EMAIL_97
  'ユーザー98', // ACCOUNT_EMAIL_98
  'ユーザー99', // ACCOUNT_EMAIL_99
  'ユーザー100', // ACCOUNT_EMAIL_100
  'ユーザー101', // ACCOUNT_EMAIL_101
  'ユーザー102', // ACCOUNT_EMAIL_102
  'ユーザー103', // ACCOUNT_EMAIL_103
  'ユーザー104', // ACCOUNT_EMAIL_104
  'ユーザー105', // ACCOUNT_EMAIL_105
  'ユーザー106', // ACCOUNT_EMAIL_106
  'ユーザー107', // ACCOUNT_EMAIL_107
  'ユーザー108', // ACCOUNT_EMAIL_108
  'ユーザー109', // ACCOUNT_EMAIL_109
  'ユーザー110', // ACCOUNT_EMAIL_110
  'ユーザー111', // ACCOUNT_EMAIL_111
  'ユーザー112', // ACCOUNT_EMAIL_112
  'ユーザー113', // ACCOUNT_EMAIL_113
  'ユーザー114', // ACCOUNT_EMAIL_114
  'ユーザー115', // ACCOUNT_EMAIL_115
  'ユーザー116', // ACCOUNT_EMAIL_116
  'ユーザー117', // ACCOUNT_EMAIL_117
  'ユーザー118', // ACCOUNT_EMAIL_118
  'ユーザー119', // ACCOUNT_EMAIL_119
  'ユーザー120', // ACCOUNT_EMAIL_120
  'ユーザー121', // ACCOUNT_EMAIL_121
  'ユーザー122', // ACCOUNT_EMAIL_122
  'ユーザー123', // ACCOUNT_EMAIL_123
  'ユーザー124', // ACCOUNT_EMAIL_124
  'ユーザー125', // ACCOUNT_EMAIL_125
  'ユーザー126', // ACCOUNT_EMAIL_126
  'ユーザー127', // ACCOUNT_EMAIL_127
  'ユーザー128', // ACCOUNT_EMAIL_128
  'ユーザー129', // ACCOUNT_EMAIL_129
  'ユーザー130', // ACCOUNT_EMAIL_130
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
