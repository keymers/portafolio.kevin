# 📧 Guía de Configuración de EmailJS

## 🎯 ¿Qué es EmailJS?

EmailJS es un servicio gratuito que te permite enviar emails directamente desde el frontend de tu aplicación sin necesidad de un servidor backend.

## ✅ Ventajas para tu Portfolio

- 🆓 **Gratuito** - 200 emails por mes gratis
- 🚀 **Fácil configuración** - Solo 5 minutos
- 📱 **Sin servidor** - Todo desde el frontend
- 🎨 **Templates personalizables** - Emails hermosos
- 🔒 **Seguro** - Usa tu propio servicio de email

## 🔧 Configuración Paso a Paso

### 1. Crear Cuenta en EmailJS

1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Haz clic en **"Sign Up"**
3. Crea una cuenta gratuita
4. Confirma tu email

### 2. Configurar Servicio de Email

1. En el dashboard, ve a **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona tu proveedor de email:
   - **Gmail** (recomendado)
   - **Outlook/Hotmail**
   - **Yahoo**
   - **Otros**
4. Sigue las instrucciones para conectar tu cuenta
5. Guarda el **Service ID** (lo necesitarás después)

### 3. Crear Template de Email

1. Ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Usa este HTML como base:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
    <h1 style="margin: 0; font-size: 28px;">🎉 ¡Nuevo testimonio recibido!</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Tu portfolio está recibiendo feedback positivo</p>
  </div>
  
  <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #333; margin-top: 0;">📋 Detalles del testimonio:</h2>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>👤 Nombre:</strong> {{testimonial_name}}</p>
      <p style="margin: 5px 0;"><strong>🏢 Empresa:</strong> {{testimonial_company}}</p>
      <p style="margin: 5px 0;"><strong>💼 Cargo:</strong> {{testimonial_position}}</p>
      <p style="margin: 5px 0;"><strong>⭐ Calificación:</strong> {{testimonial_rating}}/5</p>
      <p style="margin: 5px 0;"><strong>📁 Tipo de proyecto:</strong> {{testimonial_project_type}}</p>
    </div>
    
    <h3 style="color: #333;">💬 Comentario:</h3>
    <blockquote style="border-left: 4px solid #667eea; padding-left: 20px; margin: 20px 0; font-style: italic; color: #555;">
      "{{testimonial_comment}}"
    </blockquote>
    
    <h3 style="color: #333;">🔧 Acciones requeridas:</h3>
    <ol style="color: #555; line-height: 1.6;">
      <li>Ve a tu <a href="https://supabase.com/dashboard/project/{{supabase_project_id}}/editor" style="color: #667eea;">dashboard de Supabase</a></li>
      <li>Navega a <strong>Table Editor</strong> → <strong>testimonials</strong></li>
      <li>Busca el testimonio de <strong>{{testimonial_name}}</strong></li>
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
```

4. Guarda el template y copia el **Template ID**

### 4. Obtener Public Key

1. Ve a **"Account"** → **"API Keys"**
2. Copia tu **Public Key**

### 5. Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=tu_service_id_aqui
VITE_EMAILJS_TEMPLATE_ID=tu_template_id_aqui
VITE_EMAILJS_PUBLIC_KEY=tu_public_key_aqui
VITE_ADMIN_EMAIL=kevin.gonzalez04@outlook.com
VITE_SUPABASE_PROJECT_ID=tu_proyecto_id
```

### 6. Agregar EmailJS a tu Proyecto

Agrega este script a tu `index.html`:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script type="text/javascript">
  (function() {
    emailjs.init("tu_public_key_aqui");
  })();
</script>
```

## 🧪 Probar la Configuración

1. Recarga tu aplicación
2. Envía un testimonio de prueba
3. Deberías recibir un email hermoso con todos los detalles

## 📊 Límites Gratuitos

- **200 emails por mes** gratis
- **Templates ilimitados**
- **Soporte por email**

## 🔍 Solución de Problemas

### Error: "EmailJS not defined"
- Verifica que el script esté cargado correctamente
- Comprueba que la Public Key esté correcta

### Error: "Service not found"
- Verifica el Service ID
- Asegúrate de que el servicio esté conectado

### Error: "Template not found"
- Verifica el Template ID
- Comprueba que el template esté guardado

## 🎉 ¡Listo!

Una vez configurado, cada testimonio que se envíe en tu portfolio generará un email hermoso y profesional directamente a tu correo.

## 💰 Planes de Pago (Opcional)

Si necesitas más de 200 emails por mes:
- **Starter**: $15/mes - 1,000 emails
- **Professional**: $35/mes - 5,000 emails
- **Enterprise**: $99/mes - 50,000 emails

## 📞 Soporte

- **Documentación**: [EmailJS Docs](https://www.emailjs.com/docs/)
- **Comunidad**: [EmailJS Community](https://community.emailjs.com/)
- **Ejemplos**: [EmailJS Examples](https://www.emailjs.com/examples/) 