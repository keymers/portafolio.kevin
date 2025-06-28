import { supabase } from './supabase'
import type { FormularioRequisitos } from '../types/index.d.ts'

// Función para limpiar variables para EmailJS
function cleanEmailJSVariable(value: any): string {
  if (value === null || value === undefined || value === '') {
    return 'No especificado'
  }
  
  // Convertir a string y limpiar solo caracteres realmente problemáticos
  let cleaned = String(value)
    .replace(/[<>]/g, '') // Remover < y > que pueden causar problemas HTML
    .replace(/["'`]/g, '') // Remover comillas problemáticas
    .replace(/[{}]/g, '') // Remover llaves que pueden causar problemas en templates
    .replace(/\s+/g, ' ') // Múltiples espacios a uno solo
    .trim()
  
  // Limitar longitud
  if (cleaned.length > 500) {
    cleaned = cleaned.substring(0, 500) + '...'
  }
  
  // Si quedó vacío, usar valor por defecto
  return cleaned || 'No especificado'
}

// Función para obtener variables de entorno de manera segura
function getEnvVar(key: string): string | undefined {
  if (typeof window !== 'undefined') {
    return (window as any)[key]
  }
  return process.env[key]
}

export class NotificationService {
  // Enviar notificación por email cuando se crea un testimonio
  static async notifyNewTestimonial(testimonial: any) {
    try {
      
      // Opción 1: Usar un servicio de webhook (más simple)
      const webhookUrl = getEnvVar('VITE_WEBHOOK_URL') || 'https://webhook.site/your-webhook-url'
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'new_testimonial',
          testimonial: testimonial,
          timestamp: new Date().toISOString(),
          message: `Nuevo testimonio de ${testimonial.name} - Calificación: ${testimonial.rating}/5`
        })
      })

      if (!response.ok) {
        throw new Error('Error enviando notificación')
      }

      return true
    } catch (error) {
      console.error('❌ Error enviando notificación:', error)
      return false
    }
  }

  // Enviar notificación por email cuando se completa un formulario de cotización
  static async notifyNewCotizacion(formulario: FormularioRequisitos) {
    try {
      // Verificar variables de entorno desde window (inyectadas por EnvScript.astro)
      const serviceId = typeof window !== 'undefined' ? (window as any).VITE_EMAILJS_SERVICE_ID : undefined
      const templateId = typeof window !== 'undefined' ? (window as any).VITE_EMAILJS_TEMPLATE_ID_COTIZACIONES : undefined
      const publicKey = typeof window !== 'undefined' ? (window as any).VITE_EMAILJS_PUBLIC_KEY : undefined
      const adminEmail = typeof window !== 'undefined' ? (window as any).VITE_ADMIN_EMAIL : undefined
      
      // Verificar si EmailJS está disponible
      if (typeof window !== 'undefined' && (window as any).emailjs) {
        const emailjs = (window as any).emailjs
        
        // Verificar que las variables estén configuradas
        if (!serviceId || serviceId === 'your_service_id' || serviceId === 'service_xxxxxxx' ||
            !templateId || templateId === 'your_template_id' || templateId === 'template_xxxxxxx' ||
            !publicKey || publicKey === 'your_public_key' || publicKey === 'public_key_xxxxxxx') {
          // Fallback: mostrar datos en consola
          
          return true
        }
        
        // Función para formatear arrays como HTML
        const formatArrayAsHTML = (arr: string[] | undefined): string => {
          if (!arr || arr.length === 0) return 'No especificado'
          return arr.map(item => `<span class="list-item">${cleanEmailJSVariable(item)}</span>`).join('')
        }
        
        // Variables que coinciden con la plantilla completa de EmailJS
        const templateParams = {
          to_email: 'kevin.gonzalez04@outlook.com',
          to_name: 'Kevin',
          from_name: cleanEmailJSVariable(formulario.persona_contacto || 'Cliente'),
          from_email: cleanEmailJSVariable(formulario.email_contacto || 'No especificado'),
          phone: cleanEmailJSVariable(formulario.telefono_contacto || 'No especificado'),
          company: cleanEmailJSVariable('Empresa del cliente'), // Campo empresa no está en el formulario actual
          preferred_schedule: cleanEmailJSVariable(formulario.horario_preferido || 'No especificado'),
          project_name: cleanEmailJSVariable(formulario.nombre_proyecto || 'Sin nombre'),
          project_description: cleanEmailJSVariable(formulario.descripcion_general || 'No especificada'),
          project_objective: cleanEmailJSVariable(formulario.objetivo_principal || 'No especificado'),
          target_audience: cleanEmailJSVariable(formulario.publico_objetivo || 'No especificado'),
          main_features: formatArrayAsHTML(formulario.funcionalidades_principales),
          secondary_features: formatArrayAsHTML(formulario.funcionalidades_secundarias),
          integrations: formatArrayAsHTML(formulario.integraciones_necesarias),
          preferred_technologies: formatArrayAsHTML(formulario.tecnologias_preferidas),
          special_requirements: cleanEmailJSVariable(formulario.requisitos_especiales || 'No especificado'),
          platform: cleanEmailJSVariable(formulario.plataforma_objetivo || 'No especificado'),
          design_style: cleanEmailJSVariable(formulario.estilo_diseno || 'No especificado'),
          preferred_colors: formatArrayAsHTML(formulario.colores_preferidos),
          design_references: formatArrayAsHTML(formulario.referencias_diseno),
          urgency: cleanEmailJSVariable(formulario.urgencia || 'No especificado'),
          deadline: cleanEmailJSVariable(formulario.fecha_limite_deseada || 'No especificado'),
          competition_analysis: cleanEmailJSVariable(formulario.competencia_analisis || 'No especificado'),
          success_metrics: formatArrayAsHTML(formulario.metricas_exito),
          budget: cleanEmailJSVariable(formulario.presupuesto_aproximado ? `${formulario.presupuesto_aproximado.toLocaleString()} ${formulario.divisa_presupuesto || 'USD'}` : 'No especificado'),
          currency: cleanEmailJSVariable(formulario.divisa_presupuesto || 'USD'),
          maintenance_required: formulario.mantenimiento_requerido ? 'badge-yes' : 'badge-no',
          training_required: formulario.capacitacion_requerida ? 'badge-yes' : 'badge-no',
          additional_notes: cleanEmailJSVariable(formulario.notas_adicionales || 'No hay notas adicionales'),
          supabase_project_id: cleanEmailJSVariable(typeof window !== 'undefined' ? (window as any).VITE_SUPABASE_PROJECT_ID || 'N/A' : 'N/A')
        }

        const result = await emailjs.send(
          serviceId,
          templateId,
          templateParams,
          publicKey
        )

        return true
      } else {
        // Fallback: mostrar datos en consola
        
        return true
      }
    } catch (error) {
      console.error('❌ Error enviando email de cotización:', error)
      // No fallar completamente, solo loggear el error
      return true
    }
  }

  // Enviar notificación usando EmailJS (más simple para desarrollo)
  static async sendEmailNotification(testimonial: any) {
    try {
      
      // Verificar variables de entorno desde window (inyectadas por EnvScript.astro)
      const serviceId = typeof window !== 'undefined' ? (window as any).VITE_EMAILJS_SERVICE_ID : undefined
      const templateId = typeof window !== 'undefined' ? (window as any).VITE_EMAILJS_TEMPLATE_ID : undefined
      const publicKey = typeof window !== 'undefined' ? (window as any).VITE_EMAILJS_PUBLIC_KEY : undefined
      const adminEmail = typeof window !== 'undefined' ? (window as any).VITE_ADMIN_EMAIL : undefined
      
      
      // Verificar si EmailJS está disponible
      if (typeof window !== 'undefined' && (window as any).emailjs) {
        const emailjs = (window as any).emailjs
        
        // Verificar que las variables estén configuradas
        if (!serviceId || serviceId === 'your_service_id' || serviceId === 'service_xxxxxxx' ||
            !templateId || templateId === 'your_template_id' || templateId === 'template_xxxxxxx' ||
            !publicKey || publicKey === 'your_public_key' || publicKey === 'public_key_xxxxxxx') {
          throw new Error('EmailJS no está completamente configurado')
        }
        
        const templateParams = {
          to_email: cleanEmailJSVariable(adminEmail || 'kevin.gonzalez04@outlook.com'),
          to_name: 'Kevin',
          from_name: cleanEmailJSVariable(testimonial.name),
          testimonial_name: cleanEmailJSVariable(testimonial.name),
          testimonial_company: cleanEmailJSVariable(testimonial.company || 'No especificada'),
          testimonial_position: cleanEmailJSVariable(testimonial.position || 'No especificado'),
          testimonial_rating: testimonial.rating,
          testimonial_comment: cleanEmailJSVariable(testimonial.comment),
          testimonial_project_type: cleanEmailJSVariable(testimonial.project_type || 'No especificado'),
          supabase_project_id: cleanEmailJSVariable(typeof window !== 'undefined' ? (window as any).VITE_SUPABASE_PROJECT_ID || 'N/A' : 'N/A')
        }


        const result = await emailjs.send(
          serviceId,
          templateId,
          templateParams,
          publicKey
        )

        return true
      } else {
        
        // Fallback: mostrar datos en consola con información detallada
        const emailData = {
          to_email: adminEmail || 'kevin.gonzalez04@outlook.com',
          subject: '🎉 Nuevo testimonio recibido - Tu Portfolio',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px;">🎉 ¡Nuevo testimonio recibido!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Tu portfolio está recibiendo feedback positivo</p>
              </div>
              
              <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">📋 Detalles del testimonio:</h2>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 5px 0;"><strong>👤 Nombre:</strong> ${testimonial.name}</p>
                  <p style="margin: 5px 0;"><strong>🏢 Empresa:</strong> ${testimonial.company || 'No especificada'}</p>
                  <p style="margin: 5px 0;"><strong>💼 Cargo:</strong> ${testimonial.position || 'No especificado'}</p>
                  <p style="margin: 5px 0;"><strong>⭐ Calificación:</strong> ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5-testimonial.rating)} (${testimonial.rating}/5)</p>
                  <p style="margin: 5px 0;"><strong>📁 Tipo de proyecto:</strong> ${testimonial.project_type || 'No especificado'}</p>
                </div>
                
                <h3 style="color: #333;">💬 Comentario:</h3>
                <blockquote style="border-left: 4px solid #667eea; padding-left: 20px; margin: 20px 0; font-style: italic; color: #555;">
                  "${testimonial.comment}"
                </blockquote>
                
                <h3 style="color: #333;">🔧 Acciones requeridas:</h3>
                <ol style="color: #555; line-height: 1.6;">
                  <li>Ve a tu <a href="https://supabase.com/dashboard/project/${typeof window !== 'undefined' ? (window as any).VITE_SUPABASE_PROJECT_ID : 'tu_proyecto_id'}/editor" style="color: #667eea;">dashboard de Supabase</a></li>
                  <li>Navega a <strong>Table Editor</strong> → <strong>testimonials</strong></li>
                  <li>Busca el testimonio de <strong>${testimonial.name}</strong></li>
                  <li>Marca la casilla <strong>is_verified</strong> como <strong>true</strong></li>
                  <li>Guarda los cambios</li>
                </ol>
                
                <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #28a745;">
                  <p style="margin: 0; color: #155724; font-size: 14px;">
                    <strong>💡 Tip:</strong> Los testimonios verificados aparecerán automáticamente en tu portfolio.
                  </p>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                <p>Este email fue enviado automáticamente por tu sistema de testimonios.</p>
                <p>Powered by EmailJS</p>
              </div>
            </div>
          `,
          text: `
            🎉 ¡Nuevo testimonio recibido!
            
            📋 Detalles:
            - Nombre: ${testimonial.name}
            - Empresa: ${testimonial.company || 'No especificada'}
            - Cargo: ${testimonial.position || 'No especificado'}
            - Calificación: ${testimonial.rating}/5
            - Comentario: "${testimonial.comment}"
            
            🔧 Para verificar, ve a tu dashboard de Supabase.
          `
        }

        return true
      }
    } catch (error) {
      console.error('❌ Error enviando email:', error)
      console.error('🔍 Detalles del error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      return false
    }
  }
} 