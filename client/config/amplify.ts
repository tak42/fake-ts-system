import { Amplify, ResourcesConfig } from 'aws-amplify';

// 環境変数から設定を読み込む
const COGNITO_ENDPOINT = import.meta.env.VITE_COGNITO_ENDPOINT || 'http://localhost:4566';

// LocalStackのCognitoエミュレータに接続するための設定
export const configureAmplify = () => {
  // Amplify V6に合わせた設定オブジェクト
  const config: ResourcesConfig = {
    Auth: {
      Cognito: {
        userPoolId: 'ap-northeast-1_localstack',
        userPoolClientId: 'localstack_client_id',
        // エンドポイントを直接ここに設定
        userPoolEndpoint: COGNITO_ENDPOINT,
        loginWith: {
          oauth: {
            domain: 'localhost',
            scopes: ['email', 'profile', 'openid'],
            redirectSignIn: ['http://localhost:5173/'],
            redirectSignOut: ['http://localhost:5173/'],
            responseType: 'code',
          },
        },
      },
    },
  };

  try {
    // Amplifyを設定
    Amplify.configure(config);
    console.log('Amplify設定完了');
  } catch (error) {
    console.error('Amplify設定エラー:', error);
  }
};

// テスト用のユーザー情報
export const testUser = {
  username: 'testuser',
  password: 'Test@123',
};
