#!/bin/bash

# デフォルトリージョンの設定
export AWS_DEFAULT_REGION=ap-northeast-1

echo "Cognito初期化を開始..."

# Cognitoユーザープールの作成
echo "Cognitoユーザープールを作成中..."
USER_POOL_ID=$(awslocal cognito-idp create-user-pool \
  --pool-name MyUserPool \
  --auto-verified-attributes email \
  --schema Name=email,Required=true \
  --query 'UserPool.Id' \
  --output text)

echo "Cognitoクライアントを作成中..."
CLIENT_ID=$(awslocal cognito-idp create-user-pool-client \
  --user-pool-id $USER_POOL_ID \
  --client-name MyAppClient \
  --no-generate-secret \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH \
  --query 'UserPoolClient.ClientId' \
  --output text)

echo "テストユーザーを作成中..."
awslocal cognito-idp admin-create-user \
  --user-pool-id $USER_POOL_ID \
  --username testuser \
  --temporary-password Test@123 \
  --user-attributes Name=email,Value=test@example.com Name=email_verified,Value=true

# 作成したリソース情報をファイルに保存（アプリから参照可能に）
echo "Cognito設定を保存中..."
cat > /tmp/localstack/data/cognito_config.json << EOL
{
  "UserPoolId": "$USER_POOL_ID",
  "ClientId": "$CLIENT_ID",
  "TestUser": {
    "Username": "testuser",
    "Password": "Test@123",
    "Email": "test@example.com"
  }
}
EOL

echo "========================================"
echo "Cognito設定情報:"
echo "ユーザープールID: $USER_POOL_ID"
echo "クライアントID: $CLIENT_ID"
echo "テストユーザー: testuser / Test@123"
echo "========================================"

echo "Cognito初期化完了"