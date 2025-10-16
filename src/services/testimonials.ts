import { getSupabaseClient } from './supabase'
import type { Testimonial, CreateTestimonial } from './supabase'

export class TestimonialsService {
  // Verificar si Supabase está disponible
  private static checkSupabase() {
    const client = getSupabaseClient()
    if (!client) {
      throw new Error('Supabase client not initialized')
    }
    return client
  }

  // Obtener todos los testimonios verificados
  static async getTestimonials(): Promise<Testimonial[]> {
    const supabase = this.checkSupabase()
    
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_verified', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching testimonials:', error)
      throw error
    }

    return data || []
  }

  // Obtener testimonios con cliente específico
  static async getTestimonialsWithClient(client: any): Promise<Testimonial[]> {
    const { data, error } = await client
      .from('testimonials')
      .select('*')
      .eq('is_verified', true)  // Solo testimonios verificados
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching testimonials:', error)
      throw error
    }

    return data || []
  }

  // Obtener testimonios por rating
  static async getTestimonialsByRating(rating: number): Promise<Testimonial[]> {
    const supabase = this.checkSupabase()
    
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('rating', rating)
      .eq('is_verified', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching testimonials by rating:', error)
      throw error
    }

    return data || []
  }

  // Crear un nuevo testimonio (pendiente de verificación)
  static async createTestimonial(testimonial: CreateTestimonial): Promise<Testimonial> {
    const supabase = this.checkSupabase()
    
    const { data, error } = await supabase
      .from('testimonials')
      .insert([{ ...testimonial, is_verified: false }])
      .select()
      .single()

    if (error) {
      console.error('Error creating testimonial:', error)
      throw error
    }

    return data
  }

  // Crear testimonio con cliente específico
  static async createTestimonialWithClient(client: any, testimonial: CreateTestimonial): Promise<Testimonial> {
    const { data, error } = await client
      .from('testimonials')
      .insert([{ ...testimonial, is_verified: false }])
      .select()
      .single()

    if (error) {
      console.error('Error creating testimonial:', error)
      throw error
    }

    return data
  }

  // Subir imagen de perfil
  static async uploadProfileImage(file: File, fileName: string): Promise<string> {
    const supabase = this.checkSupabase()
    
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading image:', error)
      throw error
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName)

    return publicUrl
  }

  // Subir imagen con cliente específico
  static async uploadProfileImageWithClient(client: any, file: File, fileName: string): Promise<string> {
    
    const { data, error } = await client.storage
      .from('profile-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('❌ Error uploading image:', error)
      throw error
    }


    // Obtener URL pública
    const { data: { publicUrl } } = client.storage
      .from('profile-images')
      .getPublicUrl(fileName)

    return publicUrl
  }

  // Obtener estadísticas de testimonios
  static async getTestimonialStats() {
    const supabase = this.checkSupabase()
    
    const { data, error } = await supabase
      .from('testimonials')
      .select('rating')
      .eq('is_verified', true)

    if (error) {
      console.error('Error fetching testimonial stats:', error)
      throw error
    }

    const ratings = data?.map((t: any) => t.rating) || []
    const total = ratings.length
    const average = total > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / total : 0
    const fiveStar = ratings.filter((r: number) => r === 5).length

    return {
      total,
      average: Math.round(average * 10) / 10,
      fiveStar,
      fiveStarPercentage: total > 0 ? Math.round((fiveStar / total) * 100) : 0
    }
  }

  // Obtener estadísticas con cliente específico
  static async getTestimonialStatsWithClient(client: any) {
    const { data, error } = await client
      .from('testimonials')
      .select('rating')
      .eq('is_verified', true)  // Solo testimonios verificados

    if (error) {
      console.error('Error fetching testimonial stats:', error)
      throw error
    }

    const ratings = data?.map((t: any) => t.rating) || []
    const total = ratings.length
    const average = total > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / total : 0
    const fiveStar = ratings.filter((r: number) => r === 5).length

    return {
      total,
      average: Math.round(average * 10) / 10,
      fiveStar,
      fiveStarPercentage: total > 0 ? Math.round((fiveStar / total) * 100) : 0
    }
  }

  // 🚀 MÉTODO OPTIMIZADO: Obtener testimonios Y estadísticas en 1 solo request
  static async getTestimonialsAndStatsWithClient(client: any): Promise<{
    testimonials: Testimonial[]
    stats: {
      total: number
      average: number
      fiveStar: number
      fiveStarPercentage: number
    }
  }> {
    const { data, error } = await client
      .from('testimonials')
      .select('*')
      .eq('is_verified', true)  // Solo testimonios verificados
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching testimonials and stats:', error)
      throw error
    }

    const testimonials = data || []
    
    // Calcular estadísticas desde los mismos datos
    const ratings = testimonials.map((t: any) => t.rating)
    const total = ratings.length
    const average = total > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / total : 0
    const fiveStar = ratings.filter((r: number) => r === 5).length

    const stats = {
      total,
      average: Math.round(average * 10) / 10,
      fiveStar,
      fiveStarPercentage: total > 0 ? Math.round((fiveStar / total) * 100) : 0
    }

    return {
      testimonials,
      stats
    }
  }
} 