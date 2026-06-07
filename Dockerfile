# =====================================================================
#  Nuxt 3 (SSR / Nitro node-server) を Koyeb で常駐させるためのイメージ
#  - マルチステージ：ビルド成果物 .output だけを実行イメージへ
#  - Nitro は依存を .output に同梱するため、実行側に node_modules 不要
# =====================================================================

# ---- build stage ----
FROM node:20-slim AS build
WORKDIR /app

# 依存だけ先に入れてレイヤキャッシュを効かせる
# postinstall(nuxt prepare) はソース未配置だと不要なので無効化（nuxt build が内部で実行）
COPY package*.json ./
RUN npm ci --ignore-scripts

# ソースを入れてビルド（.output が生成される）
COPY . .
RUN npm run build

# ---- runtime stage ----
FROM node:20-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
# 全インターフェースで待受（コンテナ外からのアクセスに必須）
ENV HOST=0.0.0.0
# コンテナの待受ポート。ECS Express Mode / Lightsail Containers の
# コンテナポート設定と一致させること（8080）
ENV PORT=8080

COPY --from=build /app/.output ./.output

EXPOSE 8080
CMD ["node", ".output/server/index.mjs"]
