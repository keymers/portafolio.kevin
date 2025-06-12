// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"

// Declaración de tipos para Deno en entorno local
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { testimonial, email } = await req.json()

    // Configurar cliente SMTP (usando Gmail como ejemplo)
    const client = new SmtpClient()

    // Configuración para Gmail
    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 587,
      username: Deno.env.get("SMTP_USERNAME") || "",
      password: Deno.env.get("SMTP_PASSWORD") || "",
    })

    // Crear el contenido del email
    const emailContent = `
      <h2>🎉 ¡Nuevo testimonio recibido!</h2>
      
      <h3>Detalles del testimonio:</h3>
      <ul>
        <li><strong>Nombre:</strong> ${testimonial.name}</li>
        <li><strong>Empresa:</strong> ${testimonial.company || 'No especificada'}</li>
        <li><strong>Cargo:</strong> ${testimonial.position || 'No especificado'}</li>
        <li><strong>Calificación:</strong> ${testimonial.rating}/5 ⭐</li>
        <li><strong>Tipo de proyecto:</strong> ${testimonial.project_type || 'No especificado'}</li>
      </ul>
      
      <h3>Comentario:</h3>
      <blockquote style="border-left: 4px solid #3B82F6; padding-left: 16px; margin: 16px 0;">
        "${testimonial.comment}"
      </blockquote>
      
      <h3>Acciones:</h3>
      <p>Para verificar este testimonio:</p>
      <ol>
        <li>Ve a tu <a href="https://supabase.com/dashboard/project/${Deno.env.get("SUPABASE_PROJECT_ID")}/editor" style="color: #3B82F6;">dashboard de Supabase</a></li>
        <li>Navega a Table Editor → testimonials</li>
        <li>Busca el testimonio de <strong>${testimonial.name}</strong></li>
        <li>Marca la casilla <strong>is_verified</strong> como <strong>true</strong></li>
        <li>Guarda los cambios</li>
      </ol>
      
      <p style="margin-top: 24px; color: #6B7280; font-size: 14px;">
        Este email fue enviado automáticamente por tu sistema de testimonios.
      </p>
    `

    // Enviar el email
    await client.send({
      from: Deno.env.get("SMTP_USERNAME") || "",
      to: email,
      subject: "🎉 Nuevo testimonio recibido - Tu Portfolio",
      content: emailContent,
      html: emailContent,
    })

    await client.close()

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email enviado correctamente" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    )
  }
}) 