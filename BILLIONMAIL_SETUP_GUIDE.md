# 🚀 Guía de Instalación de BillionMail

## 📋 ¿Qué es BillionMail?

[BillionMail](https://github.com/aaPanel/BillionMail) es un servidor de correo open-source completamente autohospedado que te permite enviar emails sin límites y sin costos mensuales.

## 🎯 Ventajas para tu Portfolio

- ✅ **Completamente gratuito** - Sin costos mensuales
- ✅ **Autohospedado** - Control total de tus datos
- ✅ **Fácil instalación** - Solo 8 minutos para configurar
- ✅ **Sin límites** - Puedes enviar miles de emails
- ✅ **Templates personalizables** - Perfecto para notificaciones

## 🔧 Instalación de BillionMail

### Opción 1: Instalación Rápida (Recomendada)

```bash
cd /opt && git clone https://github.com/aaPanel/BillionMail && cd BillionMail && bash install.sh
```

### Opción 2: Instalación con Docker

```bash
cd /opt && git clone https://github.com/aaPanel/BillionMail && cd BillionMail && cp env_init .env && docker compose up -d
```

### Opción 3: Instalación en aaPanel

1. Descarga [aaPanel](https://www.aapanel.com/new/download.html)
2. Inicia sesión en aaPanel
3. Ve a 🐳 **Docker** → **1️⃣ OneClick install**
4. Busca "BillionMail" e instálalo

## ⚙️ Configuración Post-Instalación

### 1. Acceder a BillionMail

Una vez instalado, accede a:
- **URL**: `http://tu-servidor:8080` o `https://tu-dominio.com/billionmail`
- **Usuario por defecto**: `billionmail`
- **Contraseña por defecto**: `billionmail`

### 2. Configurar Dominio

1. Ve a **Settings** → **Domain**
2. Agrega tu dominio de envío
3. Verifica los registros DNS automáticamente
4. Activa SSL gratuito

### 3. Configurar API Key

1. Ve a **Settings** → **API**
2. Genera una nueva API Key
3. Copia la clave para usar en tu aplicación

### 4. Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```env
# BillionMail Configuration
VITE_BILLIONMAIL_URL=https://tu-dominio.com/billionmail
VITE_BILLIONMAIL_API_KEY=tu_api_key_aqui
VITE_ADMIN_EMAIL=kevin.gonzalez04@outlook.com
VITE_SUPABASE_PROJECT_ID=tu_proyecto_id
```

## 📧 Configurar Template de Email

### 1. Crear Template en BillionMail

1. Ve a **Templates** → **New Template**
2. Usa este HTML como base:

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
  </div>
</div>
```

## 🧪 Probar la Configuración

### 1. Verificar Conexión

```bash
# Verificar que BillionMail está funcionando
curl -X GET https://tu-dominio.com/billionmail/api/health
```

### 2. Probar Envío de Email

```bash
curl -X POST https://tu-dominio.com/billionmail/api/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu_api_key" \
  -d '{
    "to": "kevin.gonzalez04@outlook.com",
    "subject": "Test BillionMail",
    "html": "<h1>¡BillionMail funciona!</h1>"
  }'
```

## 🔍 Solución de Problemas

### Error: "Connection refused"
- Verifica que BillionMail esté ejecutándose
- Comprueba el puerto (por defecto 8080)
- Revisa los logs: `docker logs billionmail`

### Error: "Invalid API Key"
- Verifica que la API Key esté correcta
- Regenera la clave si es necesario
- Comprueba que tengas permisos de API

### Error: "Domain not verified"
- Verifica los registros DNS
- Espera a que se propaguen los cambios (puede tardar hasta 24 horas)
- Usa el comando `bm show-record` para ver los registros necesarios

## 📊 Monitoreo

### Comandos Útiles

```bash
# Ver información por defecto
bm default

# Mostrar registros DNS
bm show-record

# Actualizar BillionMail
bm update

# Ver ayuda
bm help
```

### Dashboard de Monitoreo

Accede a `https://tu-dominio.com/billionmail/dashboard` para ver:
- Estadísticas de envío
- Tasa de entrega
- Logs de errores
- Templates utilizados

## 🎉 ¡Listo!

Una vez configurado, cada vez que alguien envíe un testimonio en tu portfolio, recibirás un email hermoso y profesional con todos los detalles del testimonio.

## 📞 Soporte

- **Documentación**: [BillionMail Docs](https://github.com/aaPanel/BillionMail)
- **Discord**: [BillionMail Community](https://discord.gg/asfXzBUhZr)
- **Demo en vivo**: [BillionMail Demo](https://demo.billionmail.com/billionmail) 