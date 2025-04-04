#!/bin/bash

# Prismaのインストール
npm install @prisma/client
npm install prisma --save-dev

# 環境変数ファイルが存在しない場合は作成
if [ ! -f .env ]; then
  echo "DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/myapp?schema=app\"" > .env
fi

# Prismaスキーマからマイグレーションを生成
npx prisma migrate dev --name init

# Prisma Clientの生成
npx prisma generate