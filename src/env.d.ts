/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_COTIZACION_URL: string
  readonly VITE_SUPABASE_COTIZACION_ANON_KEY: string
  readonly VITE_EMAILJS_SERVICE_ID: string
  readonly VITE_EMAILJS_TEMPLATE_ID: string
  readonly VITE_EMAILJS_TEMPLATE_ID_COTIZACIONES: string
  readonly VITE_EMAILJS_PUBLIC_KEY: string
  readonly VITE_ADMIN_EMAIL: string
  readonly VITE_SUPABASE_PROJECT_ID: string
  readonly VITE_WEBHOOK_URL: string
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
    VITE_SUPABASE_COTIZACION_URL?: string
    VITE_SUPABASE_COTIZACION_ANON_KEY?: string
    VITE_EMAILJS_SERVICE_ID?: string
    VITE_EMAILJS_TEMPLATE_ID?: string
    VITE_EMAILJS_TEMPLATE_ID_COTIZACIONES?: string
    VITE_EMAILJS_PUBLIC_KEY?: string
    VITE_ADMIN_EMAIL?: string
    VITE_SUPABASE_PROJECT_ID?: string
    VITE_WEBHOOK_URL?: string
    VITE_PRUEBA?: string
  }
} 