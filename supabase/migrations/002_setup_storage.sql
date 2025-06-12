-- Crear bucket para imágenes de perfil si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir subir imágenes (público)
DROP POLICY IF EXISTS "Anyone can upload profile images" ON storage.objects;
CREATE POLICY "Anyone can upload profile images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-images');

-- Política para permitir ver imágenes (público)
DROP POLICY IF EXISTS "Profile images are publicly accessible" ON storage.objects;
CREATE POLICY "Profile images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

-- Política para permitir actualizar imágenes (opcional)
DROP POLICY IF EXISTS "Anyone can update profile images" ON storage.objects;
CREATE POLICY "Anyone can update profile images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'profile-images');

-- Política para permitir eliminar imágenes (opcional)
DROP POLICY IF EXISTS "Anyone can delete profile images" ON storage.objects;
CREATE POLICY "Anyone can delete profile images" ON storage.objects
  FOR DELETE USING (bucket_id = 'profile-images'); 