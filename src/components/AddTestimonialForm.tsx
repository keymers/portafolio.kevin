import React, { useState } from 'react'
import type { CreateTestimonial } from '../services/supabase'
import { TestimonialsService } from '../services/testimonials'
import { NotificationService } from '../services/notifications'
import { useSupabase } from '../hooks/useSupabase'

export default function AddTestimonialForm() {
  const { supabase, loading: supabaseLoading, error: supabaseError } = useSupabase()
  const [formData, setFormData] = useState<CreateTestimonial>({
    name: '',
    company: '',
    position: '',
    rating: 5,
    comment: '',
    project_type: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      setError('Configuración de base de datos no disponible')
      return
    }

    setLoading(true)
    setError(null)

    try {
      let imageUrl = ''
      
      // Subir imagen si se seleccionó una
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`
        imageUrl = await TestimonialsService.uploadProfileImageWithClient(supabase, imageFile, fileName)
      }

      // Crear testimonio
      const newTestimonial = await TestimonialsService.createTestimonialWithClient(supabase, {
        ...formData,
        image_url: imageUrl || undefined
      })

      // Enviar notificación por email
      await NotificationService.sendEmailNotification(newTestimonial)

      setSuccess(true)
      setFormData({
        name: '',
        company: '',
        position: '',
        rating: 5,
        comment: '',
        project_type: ''
      })
      setImageFile(null)
    } catch (err) {
      console.error('Error submitting testimonial:', err)
      setError('Error al enviar el testimonio. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, rating: i + 1 }))}
        className={`text-2xl transition-colors ${
          i < rating ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
        }`}
      >
        ★
      </button>
    ))
  }

  // Mostrar error de Supabase si existe
  if (supabaseError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700">{supabaseError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Recargar página
        </button>
      </div>
    )
  }

  // Mostrar loading mientras se inicializa Supabase
  if (supabaseLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Inicializando...</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="bg-green-900/50 border border-green-500/30 rounded-lg p-6 text-center backdrop-blur-sm">
        <div className="text-green-400 text-4xl mb-4">✓</div>
        <h3 className="text-xl font-semibold text-green-300 mb-2">
          ¡Gracias por tu testimonio!
        </h3>
        <p className="text-green-200 mb-4">
          Tu testimonio ha sido enviado y será revisado antes de ser publicado.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Enviar otro testimonio
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-600/30 max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
        Comparte tu experiencia
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Nombre completo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
          />
        </div>

        {/* Empresa y Cargo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
              Empresa
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-300 mb-2">
              Cargo
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Tipo de Proyecto */}
        <div>
          <label htmlFor="project_type" className="block text-sm font-medium text-gray-300 mb-2">
            Tipo de proyecto
          </label>
          <select
            id="project_type"
            name="project_type"
            value={formData.project_type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
          >
            <option value="">Selecciona una opción</option>
            <option value="web-development">Desarrollo Web</option>
            <option value="mobile-app">Aplicación Móvil</option>
            <option value="ui-ux-design">Diseño UI/UX</option>
            <option value="consulting">Consultoría</option>
            <option value="other">Otro</option>
          </select>
        </div>

        {/* Calificación */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Calificación *
          </label>
          <div className="flex space-x-1">
            {renderStars(formData.rating)}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {formData.rating} de 5 estrellas
          </p>
        </div>

        {/* Comentario */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
            Tu testimonio *
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            required
            rows={4}
            placeholder="Comparte tu experiencia trabajando conmigo..."
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
          />
        </div>

        {/* Imagen de perfil */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
            Foto de perfil (opcional)
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          <p className="text-sm text-gray-400 mt-1">
            Formatos: JPG, PNG, GIF. Máximo 5MB.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/50 border border-red-500/30 rounded-md p-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-md hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {loading ? 'Enviando...' : 'Enviar testimonio'}
        </button>
      </form>
    </div>
  )
} 