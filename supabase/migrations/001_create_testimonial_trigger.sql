-- Trigger para notificar cuando se inserte un nuevo testimonio
CREATE OR REPLACE FUNCTION notify_new_testimonial()
RETURNS TRIGGER AS $$
BEGIN
  -- Llamar a la Edge Function para enviar email
  PERFORM
    net.http_post(
      url := 'https://stdnpttjitpyizbkjquc.supabase.co/functions/v1/notify-testimonial',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}',
      body := json_build_object(
        'testimonial', row_to_json(NEW),
        'email', 'tu-email@gmail.com'  -- Cambia esto por tu email
      )::text
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger
DROP TRIGGER IF EXISTS testimonial_notification_trigger ON testimonials;
CREATE TRIGGER testimonial_notification_trigger
  AFTER INSERT ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_testimonial(); 