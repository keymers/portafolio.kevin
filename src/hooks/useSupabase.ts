import { useState, useEffect } from 'react'
import { getSupabaseClient } from '../services/supabase'

export function useSupabase() {
  const [supabase, setSupabase] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeSupabase = () => {
      try {
        const client = getSupabaseClient()
        
        if (client) {
          setSupabase(client)
          setError(null)
        } else {
          setError('Variables de entorno de Supabase no encontradas')
        }
      } catch (err) {
        setError('Error al inicializar Supabase')
        console.error('Error initializing Supabase:', err)
      } finally {
        setLoading(false)
      }
    }

    // Esperar un poco para que las variables de entorno se carguen
    const timer = setTimeout(initializeSupabase, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return { supabase, loading, error }
} 