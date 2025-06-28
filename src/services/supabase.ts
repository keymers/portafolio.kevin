/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js'

// Función para obtener las variables de entorno de manera segura
function getEnvVar(key: string): string | undefined {
  // Intentar obtener de import.meta.env primero (Vite)
  if (import.meta.env[key]) {
    return import.meta.env[key]
  }
  
  // Intentar obtener de process.env (Node.js)
  if (typeof process !== 'undefined' && process.env[key]) {
    return process.env[key]
  }
  
  // Intentar obtener de window.__ENV__ (si está disponible)
  if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[key]) {
    return window.__ENV__[key]
  }
  
  // Intentar obtener de window directamente (variables globales)
  if (typeof window !== 'undefined' && (window as any)[key]) {
    return (window as any)[key]
  }
  
  return undefined
}

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL')
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY')

// Solo mostrar logs en desarrollo
if (import.meta.env.DEV) {
}

// Variable global para almacenar la instancia única del cliente
let supabaseInstance: any = null

// Función para obtener o crear el cliente de Supabase
export function getSupabaseClient() {
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storageKey: 'supabase-main-auth' // Clave única para evitar conflictos
      }
    })
  }
  return supabaseInstance
}

// Exportar la instancia para compatibilidad (pero no la creamos aquí)
export const supabase = null

// Tipos para los testimonios
export interface Testimonial {
  id: number
  name: string
  company?: string
  position?: string
  rating: number
  comment: string
  image_url?: string
  created_at: string
  is_verified?: boolean
  project_type?: string
}

// Tipos para crear un nuevo testimonio
export interface CreateTestimonial {
  name: string
  company?: string
  position?: string
  rating: number
  comment: string
  image_url?: string
  project_type?: string
}

// Declaración global para TypeScript
declare global {
  interface Window {
    __ENV__?: Record<string, string>
  }
} 