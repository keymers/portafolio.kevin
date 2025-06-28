import { createClient } from '@supabase/supabase-js'

// Función para obtener variables de entorno
function getEnvVar(name: string): string | undefined {
  if (typeof window !== 'undefined') {
    return (window as any)[name]
  }
  return process.env[name]
}

const supabaseCotizacionUrl = getEnvVar('VITE_SUPABASE_COTIZACION_URL')
const supabaseCotizacionAnonKey = getEnvVar('VITE_SUPABASE_COTIZACION_ANON_KEY')


// Variable global para almacenar la instancia única del cliente de cotización
let supabaseCotizacionInstance: any = null

// Función para obtener o crear el cliente de Supabase para cotización
export function getSupabaseCotizacionClient() {
  if (!supabaseCotizacionInstance && supabaseCotizacionUrl && supabaseCotizacionAnonKey) {
    supabaseCotizacionInstance = createClient(supabaseCotizacionUrl, supabaseCotizacionAnonKey, {
      auth: {
        storageKey: 'supabase-cotizacion-auth' // Clave única para evitar conflictos
      }
    })
  } else if (!supabaseCotizacionUrl || !supabaseCotizacionAnonKey) {
    console.error('Variables de entorno de Supabase Cotización no configuradas');
  }
  return supabaseCotizacionInstance
}

// Hook personalizado para usar la base de datos de cotización
export function useSupabaseCotizacion() {
  const client = getSupabaseCotizacionClient()
  
  if (!client) {
    return {
      supabase: null,
      loading: false,
      error: 'Configuración de base de datos de cotización no disponible'
    }
  }

  return {
    supabase: client,
    loading: false,
    error: null
  }
} 