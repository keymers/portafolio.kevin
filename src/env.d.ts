/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_PRUEBA: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Declaración global para TypeScript
declare global {
  interface Window {
    __ENV__?: Record<string, string>
    VITE_SUPABASE_URL?: string
    VITE_SUPABASE_ANON_KEY?: string
    VITE_PRUEBA?: string
  }
} 