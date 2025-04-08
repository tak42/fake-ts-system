import React, { useState } from 'react';
import Login from '../components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState<string | null>(null);

  // ログイン成功時のコールバック
  const handleLoginSuccess = (username: string) => {
    setUser(username);
    console.log(`${username}がログインしました`);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Amplify認証デモ</h1>
        {user && <p className="welcome-message">ようこそ、{user}さん</p>}
      </header>

      <main className="app-content">
        <Login onLoginSuccess={handleLoginSuccess} />
      </main>

      <footer className="app-footer">
        <p>LocalStackを使用したAWS Cognito認証デモ</p>
      </footer>
    </div>
  );
}

export default App;
