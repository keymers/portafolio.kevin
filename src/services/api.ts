import { getSupabaseClient } from './supabase'
import type { 
  FormularioRequisitos, 
  RespuestaRequisito, 
  CreateFormularioRequisitos, 
  CreateRespuestaRequisito 
} from '../types/index.d.ts'

export class formulariosAPI {
  // Verificar si Supabase está disponible
  private static checkSupabase() {
    const client = getSupabaseClient()
    if (!client) {
      throw new Error('Supabase client not initialized')
    }
    return client
  }

  // Obtener formulario por ID
  static async getById(id: string) {
    const supabase = this.checkSupabase()
    
    const { data, error } = await supabase
      .from('formularios_requisitos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching formulario:', error)
      throw error
    }

    return { data, error: null }
  }

  // Crear nuevo formulario
  static async create(formulario: CreateFormularioRequisitos) {
    const supabase = this.checkSupabase()
    
    const { data, error } = await supabase
      .from('formularios_requisitos')
      .insert([{
        ...formulario,
        estado: 'pendiente',
        fecha_creado: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating formulario:', error)
      throw error
    }

    return { data, error: null }
  }

  // Actualizar formulario
  static async update(id: string, formulario: Partial<FormularioRequisitos>) {
    const supabase = this.checkSupabase()
    
    const { data, error } = await supabase
      .from('formularios_requisitos')
      .update(formulario)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating formulario:', error)
      throw error
    }

    return { data, error: null }
  }

  // Agregar respuestas al formulario
  static async addRespuestas(formularioId: string, respuestas: CreateRespuestaRequisito[]) {
    const supabase = this.checkSupabase()
    
    const respuestasConFecha = respuestas.map(respuesta => ({
      ...respuesta,
      fecha_respuesta: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('respuestas_requisitos')
      .insert(respuestasConFecha)
      .select()

    if (error) {
      console.error('Error adding respuestas:', error)
      throw error
    }

    return { data, error: null }
  }

  // Obtener respuestas de un formulario
  static async getRespuestas(formularioId: string) {
    const supabase = this.checkSupabase()
    
    const { data, error } = await supabase
      .from('respuestas_requisitos')
      .select('*')
      .eq('formulario_id', formularioId)
      .order('fecha_respuesta', { ascending: true })

    if (error) {
      console.error('Error fetching respuestas:', error)
      throw error
    }

    return { data, error: null }
  }

  // Obtener todos los formularios
  static async getAll() {
    const supabase = this.checkSupabase()
    
    const { data, error } = await supabase
      .from('formularios_requisitos')
      .select('*')
      .order('fecha_creado', { ascending: false })

    if (error) {
      console.error('Error fetching formularios:', error)
      throw error
    }

    return { data, error: null }
  }

  // Eliminar formulario
  static async delete(id: string) {
    const supabase = this.checkSupabase()
    
    const { error } = await supabase
      .from('formularios_requisitos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting formulario:', error)
      throw error
    }

    return { error: null }
  }
} 