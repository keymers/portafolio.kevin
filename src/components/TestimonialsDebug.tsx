import React, { useState, useEffect } from 'react'
import { useSupabase } from '../hooks/useSupabase'

export default function TestimonialsDebug() {
  const { supabase, loading: supabaseLoading, error: supabaseError } = useSupabase()
  const [allTestimonials, setAllTestimonials] = useState<any[]>([])
  const [verifiedTestimonials, setVerifiedTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (supabase && !supabaseLoading) {
      loadTestimonials()
    }
  }, [supabase, supabaseLoading])

  const loadTestimonials = async () => {
    if (!supabase) return

    try {
      setLoading(true)
      
      // Cargar TODOS los testimonios
      const { data: allData, error: allError } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })

      if (allError) {
        console.error('❌ Error cargando todos los testimonios:', allError)
      } else {
        setAllTestimonials(allData || [])
      }

      // Cargar solo testimonios verificados
      const { data: verifiedData, error: verifiedError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_verified', true)
        .order('created_at', { ascending: false })

      if (verifiedError) {
        console.error('❌ Error cargando testimonios verificados:', verifiedError)
      } else {
        setVerifiedTestimonials(verifiedData || [])
      }

    } catch (err) {
      console.error('❌ Error en diagnóstico:', err)
    } finally {
      setLoading(false)
    }
  }

  if (supabaseLoading || loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
        <p className="mt-2 text-gray-300">Diagnosticando...</p>
      </div>
    )
  }

  if (supabaseError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-300">Error de conexión: {supabaseError}</p>
      </div>
    )
  }

  return (
    <div className="bg-secondary/10 backdrop-blur-sm rounded-xl border border-accent/30 p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-4">🔍 Diagnóstico de Testimonios</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Todos los testimonios */}
        <div>
          <h4 className="text-lg font-semibold text-blue-400 mb-3">
            Todos los testimonios ({allTestimonials.length})
          </h4>
          {allTestimonials.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {allTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className={`p-3 rounded-lg border text-sm ${
                    testimonial.is_verified
                      ? 'bg-green-500/10 border-green-500/30 text-green-300'
                      : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                  }`}
                >
                  <div className="font-medium">{testimonial.name}</div>
                  <div className="text-xs opacity-75">
                    Rating: {testimonial.rating}/5 | 
                    Verificado: {testimonial.is_verified ? '✅ Sí' : '❌ No'} |
                    Fecha: {new Date(testimonial.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    "{testimonial.comment.substring(0, 50)}..."
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No hay testimonios en la base de datos</p>
          )}
        </div>

        {/* Testimonios verificados */}
        <div>
          <h4 className="text-lg font-semibold text-green-400 mb-3">
            Testimonios verificados ({verifiedTestimonials.length})
          </h4>
          {verifiedTestimonials.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {verifiedTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="p-3 rounded-lg border border-green-500/30 bg-green-500/10 text-green-300 text-sm"
                >
                  <div className="font-medium">{testimonial.name}</div>
                  <div className="text-xs opacity-75">
                    Rating: {testimonial.rating}/5 | 
                    Fecha: {new Date(testimonial.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    "{testimonial.comment.substring(0, 50)}..."
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No hay testimonios verificados</p>
          )}
        </div>
      </div>

      {/* Botón para recargar */}
      <div className="text-center mt-6">
        <button
          onClick={loadTestimonials}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        >
          🔄 Recargar diagnóstico
        </button>
      </div>
    </div>
  )
} 