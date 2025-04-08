/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COGNITO_ENDPOINT: string;
  readonly VITE_COGNITO_REGION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
