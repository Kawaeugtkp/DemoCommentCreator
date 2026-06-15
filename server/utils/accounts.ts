// =====================================================================
//  アカウントの定義
// =====================================================================
//  - displayName  : 画面に表示される設定上の表示名（ユーザーNN）
//  - chepicsName  : Chepics 上の display_name（取得済みの値をベタ打ち）
//  - bio          : Chepics 上の bio（取得済みの値をベタ打ち）
//  - メールアドレス／パスワードは .env から読み込まれます
//    （メール: ACCOUNT_EMAIL_1〜130 / パスワード: ACCOUNT_PASSWORD 共通）
//
//  index は 1〜（この配列の件数）で、.env の ACCOUNT_EMAIL_{index} と対応します。
//  ※ chepicsName / bio は一度きりの取得結果をハードコードしたものです。
//     プロフィールを更新したい場合はこの配列を手動で編集してください。
// =====================================================================

export interface AccountDef {
  index: number // 1..（ACCOUNTS の件数）
  displayName: string // 設定上の表示名（ユーザーNN）
  chepicsName: string // Chepics 上の display_name
  bio: string // Chepics 上の bio
}

// ▼▼▼▼▼▼▼▼▼▼ 人数分のアカウント定義（現在 130 人） ▼▼▼▼▼▼▼▼▼▼
// { chepicsName, bio } の並び。index は配列順(1始まり)で自動付与。
const ACCOUNTS: Array<{ chepicsName: string; bio: string }> = [
  { chepicsName: "虎党のけんじ", bio: "阪神ファン歴28年。六甲おろし歌えます。それだけ。" }, // ACCOUNT_EMAIL_1
  { chepicsName: "たかし", bio: "バンドの文化について" }, // ACCOUNT_EMAIL_2
  { chepicsName: "ぼすご", bio: "社畜" }, // ACCOUNT_EMAIL_3
  { chepicsName: "むぎちゃ", bio: "AI驚きやな" }, // ACCOUNT_EMAIL_4
  { chepicsName: "ハマのジョー🐳", bio: "おじさんには今が眩しいんだ" }, // ACCOUNT_EMAIL_5
  { chepicsName: "やきう民のしげ", bio: "主にフォークリフトを担当しております！" }, // ACCOUNT_EMAIL_6
  { chepicsName: "ゆーだい", bio: "ヤクルト/26" }, // ACCOUNT_EMAIL_7
  { chepicsName: "dragons_ken55", bio: "もう数えてない球場訪問回数　負けたらヤケ酒" }, // ACCOUNT_EMAIL_8
  { chepicsName: "りょう", bio: "全部見る。全部。" }, // ACCOUNT_EMAIL_9
  { chepicsName: "ぽんず38", bio: "首都圏" }, // ACCOUNT_EMAIL_10
  { chepicsName: "さとみ⛩️", bio: "広島/カープ/御朱印集め" }, // ACCOUNT_EMAIL_11
  { chepicsName: "ぼんぼん", bio: "相撲部屋のご飯を再現したい" }, // ACCOUNT_EMAIL_12
  { chepicsName: "boss", bio: "ビットコインと機械学習で世の中を揺らしたい" }, // ACCOUNT_EMAIL_13
  { chepicsName: "ネリマキ", bio: "猫飼ってるのでぜひ繋がってください！" }, // ACCOUNT_EMAIL_14
  { chepicsName: "しゃかしゃかちきん", bio: "独り言のつもりで投稿します悪しからず" }, // ACCOUNT_EMAIL_15
  { chepicsName: "不明だよおおおお", bio: "プロ野球が好きだよ。特に推しチームはないよ" }, // ACCOUNT_EMAIL_16
  { chepicsName: "まんまる体型", bio: "広島です" }, // ACCOUNT_EMAIL_17
  { chepicsName: "koki", bio: "幸せな世界を実現したい" }, // ACCOUNT_EMAIL_18
  { chepicsName: "唐揚げくうくん", bio: "自分の正義を貫くぜ！" }, // ACCOUNT_EMAIL_19
  { chepicsName: "しーぷ", bio: "日本が好きです！" }, // ACCOUNT_EMAIL_20
  { chepicsName: "ぽす", bio: "フェス通いしてるので今ホットシーズン" }, // ACCOUNT_EMAIL_21
  { chepicsName: "あも", bio: "Hokkaido, Japan" }, // ACCOUNT_EMAIL_22
  { chepicsName: "ゆか", bio: "そんなことより踊ろうぜ！" }, // ACCOUNT_EMAIL_23
  { chepicsName: "大谷さん推し", bio: "強いところも弱いところも好き" }, // ACCOUNT_EMAIL_24
  { chepicsName: "福岡の女", bio: "板東の永久ファンです🥰" }, // ACCOUNT_EMAIL_25
  { chepicsName: "諸行無常の響きある", bio: "動物たちが幸せに暮らせる、そんな日本になることを願っています。私の発信が少しでも力になるように" }, // ACCOUNT_EMAIL_26
  { chepicsName: "日本の神", bio: "建設的な議論を通していい結果が出るようにしていきたいですね" }, // ACCOUNT_EMAIL_27
  { chepicsName: "宏一・S", bio: "ヴィッセル神戸サポ" }, // ACCOUNT_EMAIL_28
  { chepicsName: "ツイ廃からChepicsへ", bio: "初期ユーザーです" }, // ACCOUNT_EMAIL_29
  { chepicsName: "キノコ王国", bio: "社畜。競馬と野球。" }, // ACCOUNT_EMAIL_30
  { chepicsName: "かなこ", bio: "海外旅行と愛猫！" }, // ACCOUNT_EMAIL_31
  { chepicsName: "スガ太郎", bio: "日本人ファースト！移民問題について危機感を持ってます" }, // ACCOUNT_EMAIL_32
  { chepicsName: "こーすけ", bio: "小説をよく読みます" }, // ACCOUNT_EMAIL_33
  { chepicsName: "こんど", bio: "思ったことをどんどん発信" }, // ACCOUNT_EMAIL_34
  { chepicsName: "スタイル", bio: "好き：ポケモン" }, // ACCOUNT_EMAIL_35
  { chepicsName: "ゆな", bio: "プリン食べたい" }, // ACCOUNT_EMAIL_36
  { chepicsName: "週末カフェ", bio: "都内を中心に、静かで居心地の良い淡色カフェを開拓中。" }, // ACCOUNT_EMAIL_37
  { chepicsName: "丁寧な暮らしのしおり", bio: "食べて、作って、ときどきお菓子を焼く。おうちカフェと器（うつわ）の記録。美味しいものは世界を救うと信じてる。" }, // ACCOUNT_EMAIL_38
  { chepicsName: "ワーホリ中のタカ", bio: "癒しを求めたい" }, // ACCOUNT_EMAIL_39
  { chepicsName: "チュートリアル", bio: "30歳を超えてからが人生の本番" }, // ACCOUNT_EMAIL_40
  { chepicsName: "概念", bio: "スタンプメーカーとは私のこと" }, // ACCOUNT_EMAIL_41
  { chepicsName: "かなた", bio: "どうでもいい投稿やシュールな呟きを" }, // ACCOUNT_EMAIL_42
  { chepicsName: "ファー", bio: "ふぉーーーーーーーーーーー" }, // ACCOUNT_EMAIL_43
  { chepicsName: "目建", bio: "データの裏付けを気にする男" }, // ACCOUNT_EMAIL_44
  { chepicsName: "時事問題に切り込む！", bio: "" }, // ACCOUNT_EMAIL_45
  { chepicsName: "yasu", bio: "気軽に絡んでください" }, // ACCOUNT_EMAIL_46
  { chepicsName: "trangiamy", bio: "KPOPもJPOPも好き！" }, // ACCOUNT_EMAIL_47
  { chepicsName: "", bio: "" }, // ACCOUNT_EMAIL_48  // ※ログイン失敗のため未取得
  { chepicsName: "自信家", bio: "この俺の自信に満ちた顔を見ろ" }, // ACCOUNT_EMAIL_49
  { chepicsName: "そうた", bio: "" }, // ACCOUNT_EMAIL_50
  { chepicsName: "駿河屋", bio: "世の理不尽を問いたい" }, // ACCOUNT_EMAIL_51
  { chepicsName: "さち", bio: "院生です" }, // ACCOUNT_EMAIL_52
  { chepicsName: "哲也", bio: "電車で通うの億劫だなって毎日思うよ" }, // ACCOUNT_EMAIL_53
  { chepicsName: "もみじ", bio: "" }, // ACCOUNT_EMAIL_54
  { chepicsName: "遥か彼方", bio: "フジファブリックへ" }, // ACCOUNT_EMAIL_55
  { chepicsName: "豚ジャーキー", bio: "芸能ゴシップは大好き。性格終わってる" }, // ACCOUNT_EMAIL_56
  { chepicsName: "きゅーすと大好き", bio: "愛を叫びます" }, // ACCOUNT_EMAIL_57
  { chepicsName: "FIRE", bio: "不労所得増えないかな" }, // ACCOUNT_EMAIL_58
  { chepicsName: "りょう", bio: "経済問題にどんどん突っ込みたい" }, // ACCOUNT_EMAIL_59
  { chepicsName: "ユーザー133", bio: "" }, // ACCOUNT_EMAIL_60
  { chepicsName: "ユーザー134", bio: "" }, // ACCOUNT_EMAIL_61
  { chepicsName: "太一", bio: "明日は我が身。ニュースは一次ソース派" }, // ACCOUNT_EMAIL_62
  { chepicsName: "ここ", bio: "戦って！勝って！推し事と時事が9割" }, // ACCOUNT_EMAIL_63
  { chepicsName: "萌", bio: "マジで政治どないなってんねん" }, // ACCOUNT_EMAIL_64
  { chepicsName: "のんびり堂", bio: "朝刊3紙読み比べが日課。活字中毒です" }, // ACCOUNT_EMAIL_65
  { chepicsName: "Mika🌷", bio: "芸能ゴシップ大好き♡でもソースは確認する派" }, // ACCOUNT_EMAIL_66
  { chepicsName: "経済ウォッチャー佐藤", bio: "為替と株、たまに政治。投資は自己責任で" }, // ACCOUNT_EMAIL_67
  { chepicsName: "りな", bio: "23歳/Z世代の本音つぶやきます" }, // ACCOUNT_EMAIL_68
  { chepicsName: "夜更かしフクロウ", bio: "深夜にニュース見て一人で議論してる人" }, // ACCOUNT_EMAIL_69
  { chepicsName: "haru_2000", bio: "言いたいことは言う。論破はしない主義" }, // ACCOUNT_EMAIL_70
  { chepicsName: "のんびり堂", bio: "朝刊3紙読み比べが日課。活字中毒です" }, // ACCOUNT_EMAIL_71
  { chepicsName: "Mika🌷", bio: "芸能ゴシップ大好き♡でもソースは確認する派" }, // ACCOUNT_EMAIL_72
  { chepicsName: "経済ウォッチャー佐藤", bio: "為替と株、たまに政治。投資は自己責任で" }, // ACCOUNT_EMAIL_73
  { chepicsName: "りな", bio: "23歳/Z世代の本音つぶやきます" }, // ACCOUNT_EMAIL_74
  { chepicsName: "夜更かしフクロウ", bio: "深夜にニュース見て一人で議論してる人" }, // ACCOUNT_EMAIL_75
  { chepicsName: "haru_2000", bio: "言いたいことは言う。論破はしない主義" }, // ACCOUNT_EMAIL_76
  { chepicsName: "中の人A", bio: "学内新聞の中の人。たまに裏話します" }, // ACCOUNT_EMAIL_77
  { chepicsName: "もちもち", bio: "炎上は見るだけ。コメントは慎重に🍡" }, // ACCOUNT_EMAIL_78
  { chepicsName: "kenta.", bio: "スポーツ8割/社会2割。野球は永遠に語れる" }, // ACCOUNT_EMAIL_79
  { chepicsName: "あおい", bio: "ワイドショーの感想を言うアカウント" }, // ACCOUNT_EMAIL_80
  { chepicsName: "情強気取り", bio: "陰謀論は嫌い。データで話そう" }, // ACCOUNT_EMAIL_81
  { chepicsName: "Yuki☔️", bio: "ゆるく時事ネタ。怒らないで議論したい" }, // ACCOUNT_EMAIL_82
  { chepicsName: "一人暮らし自炊勢", bio: "物価高に直撃。政治と家計にひと言" }, // ACCOUNT_EMAIL_83
  { chepicsName: "テック太郎", bio: "IT・AI・ガジェット中心。たまに社会問題も" }, // ACCOUNT_EMAIL_84
  { chepicsName: "さくらもち", bio: "推しと推し以外の話題、半々で🌸" }, // ACCOUNT_EMAIL_85
  { chepicsName: "辛口レビュアー", bio: "忖度なし。でも根拠はちゃんと出す" }, // ACCOUNT_EMAIL_86
  { chepicsName: "tomo_log", bio: "気になったニュースを淡々とメモ" }, // ACCOUNT_EMAIL_87
  { chepicsName: "ぴよぴよ社会部", bio: "新人感覚で時事をかみ砕いて語る🐤" }, // ACCOUNT_EMAIL_88
  { chepicsName: "海野", bio: "地方在住。地元の話題と全国ニュースを繋ぐ" }, // ACCOUNT_EMAIL_89
  { chepicsName: "Nao🎧", bio: "音楽とサブカル、ときどき芸能ゴシップ" }, // ACCOUNT_EMAIL_90
  { chepicsName: "石橋を叩く人", bio: "フェイクニュースに騙されたくない" }, // ACCOUNT_EMAIL_91
  { chepicsName: "まこと", bio: "移動中にニュース漁るのが習慣です" }, // ACCOUNT_EMAIL_92
  { chepicsName: "ゴシップ女王", bio: "業界の噂は誰よりも早く👑" }, // ACCOUNT_EMAIL_93
  { chepicsName: "shun_99", bio: "若者の政治離れ、当事者として考え中" }, // ACCOUNT_EMAIL_94
  { chepicsName: "昭和レトロ好き", bio: "古い邦画と歌謡曲が好き。時事も語る" }, // ACCOUNT_EMAIL_95
  { chepicsName: "リサ", bio: "海外ニュースも追います。英語ソース歓迎" }, // ACCOUNT_EMAIL_96
  { chepicsName: "斜め読み太郎", bio: "見出しだけで語らないように気をつけてる" }, // ACCOUNT_EMAIL_97
  { chepicsName: "ぽんず", bio: "なんでも気になる雑食系。質問多めです" }, // ACCOUNT_EMAIL_98
  { chepicsName: "金融クラスタの端くれ", bio: "経済指標が出ると元気になります📈" }, // ACCOUNT_EMAIL_99
  { chepicsName: "Emi🐈", bio: "動物と社会問題。優しい世界を願う" }, // ACCOUNT_EMAIL_100
  { chepicsName: "論客見習い", bio: "議論は勝ち負けじゃないと最近学んだ" }, // ACCOUNT_EMAIL_101
  { chepicsName: "たけし", bio: "プロレスと政治は筋書きを読むのが楽しい" }, // ACCOUNT_EMAIL_102
  { chepicsName: "ふわっと意見", bio: "断定しないけど思ったことは書きます" }, // ACCOUNT_EMAIL_103
  { chepicsName: "miyu_diary", bio: "ニュースで感じたことを日記みたいに" }, // ACCOUNT_EMAIL_104
  { chepicsName: "現場猫好き", bio: "ヨシ！な社会問題、見逃さない" }, // ACCOUNT_EMAIL_105
  { chepicsName: "西田", bio: "選挙のたびに燃えるタイプ。投票は必ず行く" }, // ACCOUNT_EMAIL_106
  { chepicsName: "ちいさな声", bio: "マイノリティの視点を大事にしたい" }, // ACCOUNT_EMAIL_107
  { chepicsName: "Ryo⚡️", bio: "スピード重視で速報拾います。誤報は訂正します" }, // ACCOUNT_EMAIL_108
  { chepicsName: "おでん屋台", bio: "世間話の延長で時事を語る常連です" }, // ACCOUNT_EMAIL_109
  { chepicsName: "データおばけ", bio: "数字とグラフがあると安心する人" }, // ACCOUNT_EMAIL_110
  { chepicsName: "かな", bio: "芸能と恋愛ニュースに弱い💄" }, // ACCOUNT_EMAIL_111
  { chepicsName: "懐疑論者の卵", bio: "とりあえず一回疑ってから信じる" }, // ACCOUNT_EMAIL_112
  { chepicsName: "junpei_t", bio: "国際情勢が専門……になりたくて勉強中" }, // ACCOUNT_EMAIL_113
  { chepicsName: "ぐうたら評論家", bio: "寝転びながら世の中に物申す" }, // ACCOUNT_EMAIL_114
  { chepicsName: "あすか", bio: "炎上の構造を観察するのが趣味です" }, // ACCOUNT_EMAIL_115
  { chepicsName: "下宿の山本", bio: "身近な話題から大きなニュースまで" }, // ACCOUNT_EMAIL_116
  { chepicsName: "Sora☁️", bio: "環境問題とサステナを中心に発信" }, // ACCOUNT_EMAIL_117
  { chepicsName: "毒舌注意報", bio: "口は悪いが筋は通す。たぶん" }, // ACCOUNT_EMAIL_118
  { chepicsName: "ひかり", bio: "明るい話題も拾いたい。良いニュース係" }, // ACCOUNT_EMAIL_119
  { chepicsName: "週末ニュース部", bio: "平日は忙しく、休日に時事をまとめてます" }, // ACCOUNT_EMAIL_120
  { chepicsName: "gen_z_voice", bio: "Z世代の素朴な疑問をぶつけます" }, // ACCOUNT_EMAIL_121
  { chepicsName: "ネットミーム好き", bio: "ネット文化の歴史が好き。時事も追う" }, // ACCOUNT_EMAIL_122
  { chepicsName: "茜", bio: "ジェンダーと働き方の話、よくします" }, // ACCOUNT_EMAIL_123
  { chepicsName: "中立マン", bio: "右でも左でもない……つもりです" }, // ACCOUNT_EMAIL_124
  { chepicsName: "コーヒー片手に", bio: "朝のニュースに一杯。ゆるっと感想☕️" }, // ACCOUNT_EMAIL_125
  { chepicsName: "daichi_news", bio: "気になった記事を引用して考える" }, // ACCOUNT_EMAIL_126
  { chepicsName: "ふくろう先生", bio: "歴史の文脈から今のニュースを読む" }, // ACCOUNT_EMAIL_127
  { chepicsName: "まりも", bio: "推し活と社会派、二刀流でやってます" }, // ACCOUNT_EMAIL_128
  { chepicsName: "突っ込み担当", bio: "矛盾を見つけると黙ってられない性格" }, // ACCOUNT_EMAIL_129
  { chepicsName: "Kazu", bio: "海外在住。日本のニュースを外から見てます" }, // ACCOUNT_EMAIL_130
]
// ▲▲▲▲▲▲▲▲▲▲ ここまで ▲▲▲▲▲▲▲▲▲▲

function padName(index: number): string {
  return `ユーザー${index < 100 ? String(index).padStart(2, '0') : String(index)}`
}

export function getAccountDefs(): AccountDef[] {
  return ACCOUNTS.map((a, i) => ({
    index: i + 1,
    displayName: padName(i + 1),
    chepicsName: a.chepicsName,
    bio: a.bio,
  }))
}

/** 指定 index(1..ACCOUNTS.length) のメールアドレスを実行時の環境変数から取得 */
export function getAccountEmail(index: number): string | undefined {
  return process.env[`ACCOUNT_EMAIL_${index}`]
}
