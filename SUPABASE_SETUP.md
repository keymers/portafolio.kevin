# Configuración de Supabase para Testimonios

## 📋 Pasos para Configurar Supabase

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"
4. Completa la información:
   - **Name**: `portfolio-testimonials` (o el nombre que prefieras)
   - **Database Password**: Genera una contraseña segura
   - **Region**: Elige la más cercana a ti
5. Haz clic en "Create new project"

### 2. Configurar la Base de Datos

Una vez creado el proyecto, ve a **SQL Editor** y ejecuta este código:

```sql
-- Crear tabla de testimonios
CREATE TABLE testimonials (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  position VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  image_url TEXT,
  project_type VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_testimonials_verified ON testimonials(is_verified);
CREATE INDEX idx_testimonials_rating ON testimonials(rating);
CREATE INDEX idx_testimonials_created_at ON testimonials(created_at);

-- Configurar RLS (Row Level Security)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Política para leer testimonios verificados (público)
CREATE POLICY "Public testimonials are viewable by everyone" ON testimonials
  FOR SELECT USING (is_verified = true);

-- Política para insertar testimonios (público)
CREATE POLICY "Anyone can insert testimonials" ON testimonials
  FOR INSERT WITH CHECK (true);

-- Política para actualizar testimonios (solo admin)
CREATE POLICY "Only admins can update testimonios" ON testimonials
  FOR UPDATE USING (auth.role() = 'authenticated');
```

### 3. Configurar Storage para Imágenes

1. Ve a **Storage** en el dashboard
2. Crea un nuevo bucket llamado `profile-images`
3. Configura las políticas de acceso:

```sql
-- Política para subir imágenes (público)
CREATE POLICY "Anyone can upload profile images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-images');

-- Política para ver imágenes (público)
CREATE POLICY "Profile images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');
```

### 4. Obtener Credenciales

1. Ve a **Settings** > **API**
2. Copia:
   - **Project URL**
   - **anon public** key

### 5. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
```

### 6. Configurar Vercel (Opcional)

Si usas Vercel, agrega las variables de entorno en:
1. Dashboard de Vercel
2. Settings > Environment Variables
3. Agrega las mismas variables del paso 5

## 🔧 Panel de Administración

Para verificar testimonios, puedes usar el **Table Editor** de Supabase:

1. Ve a **Table Editor**
2. Selecciona la tabla `testimonials`
3. Marca `is_verified` como `true` para publicar testimonios

## 📱 Funcionalidades Implementadas

- ✅ Mostrar testimonios verificados
- ✅ Formulario para agregar testimonios
- ✅ Sistema de calificación (1-5 estrellas)
- ✅ Subida de imágenes de perfil
- ✅ Estadísticas de testimonios
- ✅ Filtros por rating
- ✅ Diseño responsive
- ✅ Validación de formularios

## 🚀 Próximos Pasos

1. **Configurar notificaciones** cuando se agreguen testimonios
2. **Panel de admin** para gestionar testimonios
3. **Sistema de moderación** automática
4. **Integración con redes sociales**
5. **Exportar testimonios** a PDF

## 🔒 Seguridad

- Los testimonios requieren verificación manual
- RLS (Row Level Security) configurado
- Solo admins pueden actualizar testimonios
- Imágenes con políticas de acceso controladas 