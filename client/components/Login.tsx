import React, { useState } from 'react';
import { signIn, signOut, getCurrentUser } from 'aws-amplify/auth';
import { testUser } from '../config/amplify';
import './Login.css';

// ログイン状態の型定義
interface LoginState {
  isAuthenticated: boolean;
  username: string;
  error: string | null;
  isLoading: boolean;
}

// ログインコンポーネントのProps型定義
interface LoginProps {
  onLoginSuccess?: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  // フォーム入力値のステート
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // ログイン状態のステート
  const [loginState, setLoginState] = useState<LoginState>({
    isAuthenticated: false,
    username: '',
    error: null,
    isLoading: false,
  });

  // テストユーザー情報を自動入力する関数
  const fillTestUser = () => {
    setUsername(testUser.username);
    setPassword(testUser.password);
  };

  // ログイン処理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 入力値のバリデーション
    if (!username || !password) {
      setLoginState({
        ...loginState,
        error: 'ユーザー名とパスワードを入力してください',
      });
      return;
    }

    // ローディング状態を設定
    setLoginState({
      ...loginState,
      isLoading: true,
      error: null,
    });

    try {
      // Amplify Authを使用してログイン
      await signIn({ username, password });

      // ログイン後にユーザー情報を取得
      const currentUser = await getCurrentUser();

      // ログイン成功
      setLoginState({
        isAuthenticated: true,
        username: currentUser.username,
        error: null,
        isLoading: false,
      });

      // 成功コールバックがあれば呼び出す
      if (onLoginSuccess) {
        onLoginSuccess(currentUser.username);
      }
    } catch (error) {
      // ログインエラー
      console.error('ログインエラー:', error);
      setLoginState({
        ...loginState,
        error: 'ログインに失敗しました。ユーザー名とパスワードを確認してください。',
        isLoading: false,
      });
    }
  };

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await signOut();
      setLoginState({
        isAuthenticated: false,
        username: '',
        error: null,
        isLoading: false,
      });
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  // ログイン済みの場合はログアウトボタンを表示
  if (loginState.isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-success">
          <h2>ログイン成功</h2>
          <p>ようこそ、{loginState.username}さん！</p>
          <button onClick={handleLogout} className="logout-button">
            ログアウト
          </button>
        </div>
      </div>
    );
  }

  // ログインフォームを表示
  return (
    <div className="login-container">
      <h2>ログイン</h2>

      {loginState.error && <div className="error-message">{loginState.error}</div>}

      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="username">ユーザー名</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loginState.isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loginState.isLoading}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="login-button" disabled={loginState.isLoading}>
            {loginState.isLoading ? 'ログイン中...' : 'ログイン'}
          </button>

          <button
            type="button"
            className="test-user-button"
            onClick={fillTestUser}
            disabled={loginState.isLoading}
          >
            テストユーザーを使用
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
