import React, { useState, useEffect } from 'react'
import type { Testimonial } from '../services/supabase'
import { TestimonialsService } from '../services/testimonials'
import { useSupabase } from '../hooks/useSupabase'

interface TestimonialStats {
  total: number
  average: number
  fiveStar: number
  fiveStarPercentage: number
}

export default function TestimonialsSection({ limit }: { limit?: number } = {}) {
  const { supabase, loading: supabaseLoading, error: supabaseError } = useSupabase()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [stats, setStats] = useState<TestimonialStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({})

  const testSupabaseConnection = async () => {
    if (!supabase) return
    
    try {
      
      // Probar consulta sin filtros
      const { data: allData, error: allError } = await supabase
        .from('testimonials')
        .select('*')
      
    } catch (err) {
      console.error('❌ Error en prueba:', err)
    }
  }

  useEffect(() => {
    if (supabase && !supabaseLoading) {
      loadTestimonials()
      testSupabaseConnection() // Ejecutar prueba
    }
  }, [supabase, supabaseLoading])

  const loadTestimonials = async () => {
    if (!supabase) return

    try {
      setLoading(true)
      
      const [testimonialsData, statsData] = await Promise.all([
        TestimonialsService.getTestimonialsWithClient(supabase),
        TestimonialsService.getTestimonialStatsWithClient(supabase)
      ])
      
      
      setTestimonials(testimonialsData)
      setStats(statsData)
    } catch (err) {
      console.error('❌ Error loading testimonials:', err)
      setError('Error al cargar los testimonios')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-xl transition-colors duration-300 ${
          i < rating ? 'text-pink-400 drop-shadow-[0_0_6px_rgba(236,72,153,0.7)]' : 'text-accent/40'
        }`}
      >
        ★
      </span>
    ))
  }

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (supabaseError) {
    return (
      <section className="py-16 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-600/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-300">{supabaseError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Recargar página
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (supabaseLoading) {
    return (
      <section className="py-16 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-600/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
            <p className="mt-4 text-gray-300">Inicializando...</p>
          </div>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-600/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
            <p className="mt-4 text-gray-300">Cargando testimonios...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-600/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-300">{error}</p>
            <button
              onClick={loadTestimonials}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-secondary/20 backdrop-blur-sm rounded-3xl border border-accent/30">
      <div className="container mx-auto px-4">
        {/* Header */}

        {/* Stats */}
        {stats && (
          <div className="flex justify-center mb-12">
            <div className="bg-secondary/30 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:space-x-8 border border-accent/30 w-full max-w-2xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]">{stats.total}</div>
                <div className="text-accent/80">Testimonios</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 drop-shadow-[0_0_8px_rgba(147,51,234,0.7)]">{stats.average}</div>
                <div className="text-accent/80">Promedio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.7)]">{stats.fiveStarPercentage}%</div>
                <div className="text-accent/80">5 estrellas</div>
              </div>
            </div>
          </div>
        )}

        {/* Testimonials Grid */}
        {testimonials.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {(limit ? testimonials.slice(0, limit) : testimonials).map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-secondary/30 backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-accent/30 hover:border-pink-400/60 hover:scale-105"
                >
                  {/* Rating */}
                  <div className="flex mb-4">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Comment */}
                  {(() => {
                    const limite = 200; // Puedes ajustar el límite de caracteres
                    const isLong = testimonial.comment.length > limite;
                    const isExpanded = expanded[testimonial.id];
                    const textoMostrar = isExpanded ? testimonial.comment : testimonial.comment.slice(0, limite) + (isLong ? "..." : "");

                    return (
                      <p
                        className="text-accent/90 mb-6 text-left leading-relaxed break-words max-h-52 overflow-auto transition-all duration-300"
                        style={{ whiteSpace: 'pre-line' }}
                      >
                        "{textoMostrar}"
                        {isLong && (
                          <span
                            className="ml-2 text-pink-400 cursor-pointer font-semibold hover:underline"
                            onClick={() => toggleExpand(testimonial.id)}
                          >
                            {isExpanded ? "Ver menos" : "Ver más"}
                          </span>
                        )}
                      </p>
                    );
                  })()}

                  {/* Author */}
                  <div className="flex items-center">
                    {testimonial.image_url ? (
                      <img
                        src={testimonial.image_url}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-accent/30 shadow-md"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const placeholder = e.currentTarget.parentElement?.querySelector('.image-placeholder');
                          if (placeholder) placeholder.classList.remove('hidden');
                        }}
                        onLoad={() => {
                          // Imagen cargada
                        }}
                      />
                    ) : null}
                    {/* Placeholder cuando no hay imagen o falla */}
                    <div className={`w-12 h-12 rounded-full mr-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg border-2 border-accent/30 shadow-md ${testimonial.image_url ? 'hidden image-placeholder' : ''}`}>
                      {testimonial.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-pink-400 drop-shadow-[0_0_4px_rgba(236,72,153,0.7)]">
                        {testimonial.name}
                      </div>
                      {testimonial.position && (
                        <div className="text-accent/70 text-sm">
                          {testimonial.position}
                        </div>
                      )}
                      {testimonial.company && (
                        <div className="text-accent/70 text-sm">
                          {testimonial.company}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {limit && (
              <div className="text-center mt-8">
                <a
                  href="/testimonios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-accent/30 hover:border-pink-400/60"
                >
                  Ver todos los testimonios
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l7-7m0 0l-7-7m7 7H3"
                    />
                  </svg>
                </a>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-accent/80 text-lg">
              Aún no hay testimonios. ¡Sé el primero en compartir tu experiencia!
            </p>
          </div>
        )}
      </div>
    </section>
  )
} 