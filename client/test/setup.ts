import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Amplifyのモックを設定
vi.mock('aws-amplify', () => ({
  Amplify: {
    configure: vi.fn(),
  },
}));

vi.mock('aws-amplify/auth', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn(),
}));

// 環境変数のモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// コンソールエラーのモック（テスト中のエラーログを抑制）
const originalConsoleError = console.error;
console.error = (...args) => {
  // Amplify関連のエラーを抑制
  if (typeof args[0] === 'string' && (args[0].includes('Amplify') || args[0].includes('Auth'))) {
    return;
  }
  originalConsoleError(...args);
};
