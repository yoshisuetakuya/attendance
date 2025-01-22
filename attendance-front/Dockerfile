# Node.jsの軽量版イメージを使用する（バージョンは適宜変更可能）
FROM node:18-alpine

# アプリケーションの作業ディレクトリを作成
WORKDIR /app

# パッケージ情報をコンテナにコピー
COPY package*.json ./

# 依存パッケージをインストール
RUN npm install

# プロジェクト全体をコンテナにコピー
COPY . .

# 本番環境用に設定
ENV NODE_ENV=production

# アプリケーションをビルド
RUN npm run build

# Next.jsはデフォルトで3000番ポートを使う
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "start"]
