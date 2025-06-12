import { supabase } from './supabase'

export class NotificationService {
  // Enviar notificación por email cuando se crea un testimonio
  static async notifyNewTestimonial(testimonial: any) {
    try {
      
      // Opción 1: Usar un servicio de webhook (más simple)
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL || 'https://webhook.site/your-webhook-url'
      
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
          to_email: adminEmail || 'kevin.gonzalez04@outlook.com',
          to_name: 'Kevin',
          from_name: testimonial.name,
          testimonial_name: testimonial.name,
          testimonial_company: testimonial.company || 'No especificada',
          testimonial_position: testimonial.position || 'No especificado',
          testimonial_rating: testimonial.rating,
          testimonial_comment: testimonial.comment,
          testimonial_project_type: testimonial.project_type || 'No especificado',
          supabase_project_id: typeof window !== 'undefined' ? (window as any).VITE_SUPABASE_PROJECT_ID : 'tu_proyecto_id'
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