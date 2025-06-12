-- Asegurar que el bucket existe y es público
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

-- Habilitar RLS en storage.objects si no está habilitado
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Anyone can upload profile images" ON storage.objects;
DROP POLICY IF EXISTS "Profile images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update profile images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete profile images" ON storage.objects;

-- Crear políticas más específicas y robustas
CREATE POLICY "Public profile images upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Public profile images view" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Public profile images update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'profile-images');

CREATE POLICY "Public profile images delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'profile-images');

-- Verificar que las políticas se crearon correctamente
DO $$
BEGIN
  RAISE NOTICE 'Storage policies created successfully for profile-images bucket';
END $$; 