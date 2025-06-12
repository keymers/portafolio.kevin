import { getSupabaseClient } from './supabase'

interface Bucket {
  id: string
  name: string
  public: boolean
}

export class StorageDiagnosticService {
  static async checkStorageStatus() {
    const supabase = getSupabaseClient()
    
    if (!supabase) {
      console.error('❌ Supabase client no disponible')
      return { success: false, error: 'Supabase client no disponible' }
    }

    try {
      
      // Verificar buckets
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      if (bucketsError) {
        console.error('❌ Error al listar buckets:', bucketsError)
        return { success: false, error: bucketsError.message }
      }
      
      
      // Verificar bucket profile-images específicamente
      const profileImagesBucket = buckets.find((bucket: Bucket) => bucket.id === 'profile-images')
      
      if (!profileImagesBucket) {
        
        // Intentar acceder directamente al bucket para verificar si existe
        const { data: files, error: filesError } = await supabase.storage
          .from('profile-images')
          .list()
        
        if (filesError) {
          console.error('❌ Error al acceder al bucket profile-images:', filesError)
          return { 
            success: false, 
            error: 'Bucket profile-images no existe o no es accesible',
            buckets: buckets.map((b: Bucket) => ({ id: b.id, name: b.name, public: b.public }))
          }
        }
        
        // Si llegamos aquí, el bucket existe pero no aparece en la lista
        return {
          success: true,
          bucket: { id: 'profile-images', name: 'profile-images', public: true },
          files: files,
          totalFiles: files.length,
          bucketPublic: true,
          note: 'Bucket accesible pero no aparece en la lista de buckets'
        }
      }
      
      
      // Verificar archivos en el bucket
      const { data: files, error: filesError } = await supabase.storage
        .from('profile-images')
        .list()
      
      if (filesError) {
        console.error('❌ Error al listar archivos:', filesError)
        return { success: false, error: filesError.message }
      }
      
      
      // Verificar políticas
      const { data: policies, error: policiesError } = await supabase.rpc('get_storage_policies')
      
      if (policiesError) {
      } else {
      }
      
      return {
        success: true,
        bucket: profileImagesBucket,
        files: files,
        totalFiles: files.length,
        bucketPublic: profileImagesBucket.public
      }
      
    } catch (error) {
      console.error('❌ Error en diagnóstico de storage:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }
  
  static async testImageUpload() {
    const supabase = getSupabaseClient()
    
    if (!supabase) {
      return { success: false, error: 'Supabase client no disponible' }
    }
    
    try {
      // Crear un archivo de prueba simple
      const testContent = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      const testFile = new File([testContent], 'test.png', { type: 'image/png' })
      
      const fileName = `test-${Date.now()}.png`
      
      
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, testFile, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) {
        console.error('❌ Error en prueba de subida:', error)
        return { success: false, error: error.message }
      }
      
      
      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName)
      
      
      // Limpiar archivo de prueba
      await supabase.storage
        .from('profile-images')
        .remove([fileName])
      
      return { success: true, publicUrl, fileName }
      
    } catch (error) {
      console.error('❌ Error en prueba de subida:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }
} 