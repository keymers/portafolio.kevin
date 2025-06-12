# 🔧 Guía de Configuración de Storage en Supabase

## 📋 Pasos para Configurar las Políticas de Storage

### 1. Ejecutar la Migración del Bucket

Primero, ejecuta esta migración en tu **SQL Editor** de Supabase:

```sql
-- Crear bucket para imágenes de perfil
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images', 
  'profile-images', 
  true, 
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
```

### 2. Configurar Políticas desde el Dashboard

Ve a tu dashboard de Supabase y sigue estos pasos:

#### Paso 1: Ir a Storage
1. En el menú lateral, haz clic en **"Storage"**
2. Verifica que el bucket `profile-images` existe

#### Paso 2: Configurar Políticas
1. Haz clic en **"Policies"** en la parte superior
2. Haz clic en **"New Policy"**

#### Paso 3: Crear las 4 Políticas Necesarias

**Política 1: Subir Archivos (INSERT)**
- **Policy Name**: `Public profile images upload`
- **Allowed operation**: `INSERT`
- **Target roles**: `public`
- **Using expression**: `bucket_id = 'profile-images'`
- Haz clic en **"Review"** y luego **"Save policy"**

**Política 2: Ver Archivos (SELECT)**
- **Policy Name**: `Public profile images view`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **Using expression**: `bucket_id = 'profile-images'`
- Haz clic en **"Review"** y luego **"Save policy"**

**Política 3: Actualizar Archivos (UPDATE)**
- **Policy Name**: `Public profile images update`
- **Allowed operation**: `UPDATE`
- **Target roles**: `public`
- **Using expression**: `bucket_id = 'profile-images'`
- Haz clic en **"Review"** y luego **"Save policy"**

**Política 4: Eliminar Archivos (DELETE)**
- **Policy Name**: `Public profile images delete`
- **Allowed operation**: `DELETE`
- **Target roles**: `public`
- **Using expression**: `bucket_id = 'profile-images'`
- Haz clic en **"Review"** y luego **"Save policy"**

### 3. Verificar la Configuración

Una vez configuradas las políticas, deberías ver algo como esto en la sección de Policies:

```
✅ Public profile images upload (INSERT)
✅ Public profile images view (SELECT)
✅ Public profile images update (UPDATE)
✅ Public profile images delete (DELETE)
```

### 4. Probar la Configuración

1. Ve a tu aplicación y usa el botón **"🔧 Diagnóstico Storage"** en la sección de testimonios
2. Deberías ver un mensaje de éxito verde
3. Intenta subir una nueva imagen de perfil en el formulario de testimonios

## 🔍 Solución de Problemas

### Error: "must be owner of table objects"
- **Causa**: No tienes permisos para modificar las tablas de storage directamente
- **Solución**: Usa el dashboard de Supabase para configurar las políticas manualmente

### Error: "Bucket not found"
- **Causa**: El bucket no se creó correctamente
- **Solución**: Ejecuta la migración del bucket nuevamente

### Error: "Access denied"
- **Causa**: Las políticas no están configuradas correctamente
- **Solución**: Verifica que las 4 políticas estén creadas con los parámetros exactos

### Error: "File too large"
- **Causa**: El archivo excede el límite de 5MB
- **Solución**: Comprime la imagen o usa un archivo más pequeño

## 📞 Soporte

Si sigues teniendo problemas:

1. Verifica que el bucket `profile-images` existe en Storage
2. Confirma que las 4 políticas están configuradas correctamente
3. Usa el botón de diagnóstico en la aplicación para obtener más información
4. Revisa la consola del navegador para logs detallados 