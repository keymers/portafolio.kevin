-- Crear bucket para imágenes de perfil (solo si no existe)
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

-- Nota: Las políticas de storage se configuran desde el dashboard de Supabase
-- Ve a Storage > Policies y crea las siguientes políticas manualmente:

-- 1. Política para INSERT (subir archivos)
-- Nombre: "Public profile images upload"
-- Target roles: public
-- Using expression: bucket_id = 'profile-images'

-- 2. Política para SELECT (ver archivos)
-- Nombre: "Public profile images view"  
-- Target roles: public
-- Using expression: bucket_id = 'profile-images'

-- 3. Política para UPDATE (actualizar archivos)
-- Nombre: "Public profile images update"
-- Target roles: public
-- Using expression: bucket_id = 'profile-images'

-- 4. Política para DELETE (eliminar archivos)
-- Nombre: "Public profile images delete"
-- Target roles: public
-- Using expression: bucket_id = 'profile-images'

-- Verificar que el bucket se creó correctamente
DO $$
BEGIN
  RAISE NOTICE 'Bucket profile-images configurado. Recuerda configurar las políticas desde el dashboard.';
END $$; 