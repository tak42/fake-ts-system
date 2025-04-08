import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Amplify, ResourcesConfig } from 'aws-amplify';
import { configureAmplify } from './amplify';

// Amplifyのモックをセットアップ
vi.mock('aws-amplify', () => ({
  Amplify: {
    configure: vi.fn(),
  },
}));

describe('Amplify設定', () => {
  // 各テストの前にモックをリセット
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 各テストの後にモックをリストア
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Amplify.configureが正しい設定で呼び出されること', () => {
    // スパイを設定
    const configureSpy = vi.spyOn(Amplify, 'configure');

    // 環境変数をモック
    const originalEnv = { ...import.meta.env };
    vi.stubGlobal('import.meta.env', {
      VITE_COGNITO_ENDPOINT: 'http://test-endpoint:4566',
      VITE_COGNITO_REGION: 'test-region',
    });

    // テスト対象の関数を実行
    configureAmplify();

    // Amplify.configureが呼び出されたことを確認
    expect(configureSpy).toHaveBeenCalled();

    // 呼び出し引数を取得し、明示的にResourcesConfig型としてアサーション
    const configArg = configureSpy.mock.calls[0][0] as ResourcesConfig;

    // Authプロパティが存在することを確認
    expect(configArg).toHaveProperty('Auth');

    // Authが存在することを確認
    expect(configArg.Auth).toBeDefined();
    // TypeScriptの型ガードとして機能するようにする
    if (!configArg.Auth) return;

    // Auth.Cognitoが存在することを確認
    expect(configArg.Auth).toHaveProperty('Cognito');
    expect(configArg.Auth.Cognito).toBeDefined();
    if (!configArg.Auth.Cognito) return;

    const cognitoConfig = configArg.Auth.Cognito;

    // Cognito設定プロパティを確認
    expect(cognitoConfig).toHaveProperty('userPoolId', 'ap-northeast-1_localstack');
    expect(cognitoConfig).toHaveProperty('userPoolClientId', 'localstack_client_id');
    expect(cognitoConfig).toHaveProperty('userPoolEndpoint', 'http://test-endpoint:4566');

    // loginWith.oauthの設定を確認
    expect(cognitoConfig).toHaveProperty('loginWith');
    expect(cognitoConfig.loginWith).toBeDefined();
    if (!cognitoConfig.loginWith) return;

    expect(cognitoConfig.loginWith).toHaveProperty('oauth');
    expect(cognitoConfig.loginWith.oauth).toBeDefined();
    if (!cognitoConfig.loginWith.oauth) return;

    const oauthConfig = cognitoConfig.loginWith.oauth;
    expect(oauthConfig).toHaveProperty('domain', 'localhost');
    expect(oauthConfig).toHaveProperty('scopes');
    expect(oauthConfig.scopes).toContain('email');
    expect(oauthConfig).toHaveProperty('redirectSignIn');
    expect(oauthConfig).toHaveProperty('redirectSignOut');
    expect(oauthConfig).toHaveProperty('responseType', 'code');

    // 環境変数を元に戻す
    vi.stubGlobal('import.meta.env', originalEnv);
  });

  it('エラーが発生した場合でも処理が継続すること', () => {
    // コンソールエラーをモック
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Amplify.configureがエラーをスローするようにモック
    vi.spyOn(Amplify, 'configure').mockImplementation(() => {
      throw new Error('テストエラー');
    });

    // エラーがスローされないことを確認
    expect(() => configureAmplify()).not.toThrow();

    // エラーがログに記録されることを確認
    expect(consoleErrorSpy).toHaveBeenCalledWith('Amplify設定エラー:', expect.any(Error));

    // スパイをリストア
    consoleErrorSpy.mockRestore();
  });
});
