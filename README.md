# 🚀 Portfolio Kevin González

[![Visita mi sitio](https://img.shields.io/badge/🌐-Portfolio%20Live-blue)](https://portafolio-kevin-wheat.vercel.app)
[![Status](https://img.shields.io/badge/✅-Activo-green)](https://github.com/keymers/portafolio.kevin)

Hola! 👋 Este es mi portfolio personal construido con Astro y React. Quería crear algo que reflejara mi estilo: cyberpunk, matrix vibes, y súper interactivo.

## 🌟 ¿Qué tiene de especial?

### Diseño Cyberpunk/Matrix
- Efecto de lluvia matrix en tiempo real
- Animaciones glitch y efectos de neón
- Tema oscuro con colores vibrantes
- Terminal interactivo con comandos reales

### Funcionalidades
- **Sistema de testimonios** - Los clientes pueden dejar sus reviews
- **Formulario de cotización interactivo** - Para nuevos proyectos
- **Estadísticas en tiempo real** - Dashboard con métricas del portfolio
- **Notificaciones automáticas** - Email y webhooks cuando alguien completa un formulario

## 🛠️ Tech Stack

- **Frontend:** Astro + React + TypeScript + Tailwind CSS
- **Backend:** Supabase (2 bases de datos)
- **Notificaciones:** EmailJS + Webhooks
- **Deploy:** Vercel
- **Extra:** Framer Motion para animaciones

## ⚡ Setup rápido

```bash
# Clone el repo
git clone https://github.com/keymers/portafolio.kevin.git
cd portafolio.kevin

# Instala dependencias
npm install

# Configura tu .env (ejemplos de abajo)
# Edita el .env con tus URLs de Supabase, EmailJS, etc.

# Corre en desarrollo
npm run dev
```

## 📋 Variables de entorno necesarias

Necesitas crear un `.env` con estas variables:

```bash
# Supabase principal (testimonios)
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
VITE_SUPABASE_PROJECT_ID=tu_project_id
VITE_ADMIN_EMAIL=tu_email@domain.com

# Supabase segunda base de datos (cotizaciones)
VITE_SUPABASE_COTIZACION_URL=tu_segunda_db_url
VITE_SUPABASE_COTIZACION_ANON_KEY=tu_segunda_db_key

# EmailJS para notificaciones
VITE_EMAILJS_SERVICE_ID=tu_service_id_de_emailjs
VITE_EMAILJS_TEMPLATE_ID=tu_template_id_de_testimonios
VITE_EMAILJS_TEMPLATE_ID_COTIZACIONES=tu_template_id_de_cotizaciones
VITE_EMAILJS_PUBLIC_KEY=tu_public_key_de_emailjs

# Webhooks para notificaciones
VITE_WEBHOOK_URL=tu_webhook_url
```

> **Nota:** Las variables VITE_ son públicas por diseño, así que usa URLs de APIs públicas y no datos súper sensibles

## 🗄️ Base de datos

### Supabase Principal (testimonios)

```sql
CREATE TABLE testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  position TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  image_url TEXT,
  project_type TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública
CREATE POLICY "public_read" ON testimonials FOR SELECT USING (true);

-- Permitir inserción pública  
CREATE POLICY "public_insert" ON testimonials FOR INSERT WITH CHECK (true);
```

### Segunda base de datos (cotizaciones)

```sql
CREATE TABLE formularios_cotizacion (
  id SERIAL PRIMARY KEY,
  datos JSONB NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  procesado BOOLEAN DEFAULT FALSE
);

-- Habilitar RLS
ALTER TABLE formularios_cotizacion ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert" ON formularios_cotizacion FOR INSERT WITH CHECK (true);
```

## 🚀 Deploy en Vercel

1. Conecta tu repo a Vercel (importar desde GitHub)
2. Agrega todas las variables de entorno en el dashboard de Vercel
3. Vercel detecta Astro automáticamente y hace el build
4. ¡Listo! Tu portfolio está online

## 🎨 Personalización

### Colores principales
- Verde matrix: `#00ff41`
- Rosa/Pink neón: `#ff0080` 
- Azul eléctrico: `#0066ff`
- Negro profundo: `#0a0a0a`

### Componentes principales
- `src/components/Navigation.astro` - Navbar principal
- `src/components/TestimonialsSection.tsx` - Sistema de testimonios completo
- `src/components/FormularioCliente.tsx` - Formulario de cotización
- `src/styles/home.css` - Estilos cyberpunk principales
- `src/scripts/home.js` - Terminal interactivo y efectos matrix

## 🔧 Cómo funciona

### Sistema de Testimonios
1. Cliente llena formulario en la página `/testimonios`
2. Se guarda en Supabase principal
3. Automáticamente se envía email de notificación
4. Los testimonios aparecen en la página solo si `is_verified = true`

### Formulario de Cotización  
1. Cliente completa el formulario multipaso
2. Se guarda en la segunda base de datos
3. Envío automático de cotización por email
4. Dashboard de admin para revisar solicitudes

## 📱 Responsive

Está optimizado para:
- 📱 Móviles (320px+)
- 💻 Tablets (768px+) 
- 🖥️ Desktop (1024px+)
- 📺 Pantallas grandes (1920px+)

Usé Tailwind CSS con breakpoints personalizados para que se vea bien en cualquier dispositivo.

## 🐛 Bugs conocidos

- El warning de "Multiple GoTrueClient instances" es normal cuando tienes múltiples bases de datos Supabase (no afecta funcionalidad)
- En móviles muy pequeños (< 375px) algunos textos pueden verse un poco apretados

## 🤝 Contribuciones

Si encuentras bugs o tienes ideas para mejorar:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b fix/un-bug`)
3. Commit tus cambios (`git commit -m 'Fix: descripción del cambio'`)
4. Push y abre un PR

¡Aprecio cualquier feedback o sugerencia!

## 📞 Contacto

- 📧 Email: [kevin.gonzalez@pekos.cl](mailto:kevin.gonzalez@pekos.cl)
- 💼 LinkedIn: [kevingonzalezlister](https://linkedin.com/in/kevingonzalezlister)  
- 🐙 GitHub: [keymers](https://github.com/keymers)
- 🌐 Portfolio: [portafolio-kevin-wheat.vercel.app](https://portafolio-kevin-wheat.vercel.app)

## 📄 Licencia

MIT License - Siéntete libre de usar el código para tus proyectos, solo dame crédito si lo usas completo! 😊

---

**⭐ Si te gusta el proyecto, deja una estrella! ⭐**

*Hecho con ❤️ por Kevin González | 2025*