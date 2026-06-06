# demo-comment-creator

トピックに対して複数アカウント（現在29アカウント）から「セット選択 → コメント投稿 → いいね」を自動実行する管理用Webツール（Nuxt 3）。

## 構成

- **フロント + サーバー一体**：Nuxt 3（Nitro サーバー）
- 機密情報（合言葉・Firebase APIキー・各アカウントのメール/パスワード・IDToken）は**すべてサーバー側で扱い、ブラウザには出しません**
- 実行ボタン押下後の一連処理（セット選択 → 4分以内ランダムでコメント投稿 → いいね）は**サーバー側のバックグラウンドで進行**し、画面はステータスをポーリングして表示します

## セットアップ

```bash
npm install
cp .env.example .env   # 値を実際のものに書き換える
npm run dev            # http://localhost:3000
```

本番:

```bash
npm run build
node .output/server/index.mjs
```

## .env

| キー | 説明 |
| --- | --- |
| `LOGIN_TEXT` | ログイン画面で入力する固定の合言葉 |
| `FIREBASE_API_KEY` | Firebase ウェブAPIキー（Identity Toolkit でサインインに使用） |
| `FIREBASE_AUTH_DOMAIN` / `FIREBASE_PROJECT_ID` | 参考情報（認証自体は API キーで動作） |
| `ACCOUNT_PASSWORD` | 全アカウント共通パスワード（1つだけ） |
| `ACCOUNT_EMAIL_1` 〜 `ACCOUNT_EMAIL_29` | 各アカウントのメールアドレス |

## 表示名の設定（ハードコーディング）

各アカウントの**表示名**は `server/utils/accounts.ts` の `ACCOUNT_DISPLAY_NAMES` 配列で設定します。
配列の i 番目が `.env` の `ACCOUNT_EMAIL_{i+1}` に対応します。アカウント数を増減するときは、この配列の件数・`nuxt.config.ts` の `accountEmail{n}`・`.env` の `ACCOUNT_EMAIL_{n}` を揃えてください。

## 仕様の対応

- **ログイン**：`LOGIN_TEXT` と一致でログイン。失敗すると**同一ブラウザから10分間ロック**（ブラウザ識別Cookie `dcc_bid` をキーにサーバー側で管理）。
- **直接URL到達不可**：`/`（ダッシュボード）はセッションCookieがないとログインへリダイレクトされるためURL直打ちでは入れません。ログイン成功時のみセッションを発行します。
- **セッション切れ**：最終操作から30分でセッション失効 → ログイン画面へ。
- **トピック取得**：入力欄に `topic_id` を入力 → `GET /v1/chepics/topic?topic_id=...&add=set` を呼び、トピック名・説明・セット一覧（番号付き）を表示。
- **アカウント一覧**：全アカウント分の「表示名 / 選択セット番号 / コメント / いいね数」を入力。
- **実行処理**：
  1. セット番号が入力されたアカウントへ `pickSet` を実行
  2. 全 `pickSet` 完了直後〜4分後の**ランダムなタイミング**で、コメント入力済みアカウントが `createComment`
  3. 全コメント投稿完了後、各コメントの「いいね数」に応じて、**そのコメントと同じセットを選んだアカウント（本人含む）からランダムに選出**して `likeComment`

## API（サーバー内部）

| エンドポイント | 説明 |
| --- | --- |
| `POST /api/login` | 合言葉ログイン（ロック判定込み） |
| `POST /api/logout` | ログアウト |
| `GET /api/session` | 認証状態・ロック残秒 |
| `GET /api/accounts` | 20アカウントの表示名（要セッション） |
| `GET /api/topic?topic_id=` | トピック取得（要セッション） |
| `POST /api/execute` | 実行開始 → `jobId` を返す（要セッション） |
| `GET /api/execute-status?jobId=` | 実行進捗のポーリング（要セッション） |

## 注意

- ジョブの状態・セッション・ロックはサーバーの**メモリ上**で管理します。サーバー再起動で消えます（単一インスタンス用途を想定）。
- 実行中はブラウザを閉じてもサーバー側処理は継続しますが、進捗ログの再表示はしません（同一プロセスが動いていればサーバーログには出力されます）。
