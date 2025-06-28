// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  vite: {
    define: {
      'process.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
      'process.env.VITE_SUPABASE_PROJECT_ID': JSON.stringify(process.env.VITE_SUPABASE_PROJECT_ID),
      'process.env.VITE_ADMIN_EMAIL': JSON.stringify(process.env.VITE_ADMIN_EMAIL),
      'process.env.VITE_EMAILJS_SERVICE_ID': JSON.stringify(process.env.VITE_EMAILJS_SERVICE_ID),
      'process.env.VITE_EMAILJS_TEMPLATE_ID': JSON.stringify(process.env.VITE_EMAILJS_TEMPLATE_ID),
      'process.env.VITE_EMAILJS_TEMPLATE_ID_COTIZACIONES': JSON.stringify(process.env.VITE_EMAILJS_TEMPLATE_ID_COTIZACIONES),
      'process.env.VITE_EMAILJS_PUBLIC_KEY': JSON.stringify(process.env.VITE_EMAILJS_PUBLIC_KEY),
      'process.env.VITE_WEBHOOK_URL': JSON.stringify(process.env.VITE_WEBHOOK_URL),
      'process.env.VITE_PRUEBA': JSON.stringify(process.env.VITE_PRUEBA),
      // Variables para la segunda base de datos (formularios de cotización)
      'process.env.VITE_SUPABASE_COTIZACION_URL': JSON.stringify(process.env.VITE_SUPABASE_COTIZACION_URL),
      'process.env.VITE_SUPABASE_COTIZACION_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_COTIZACION_ANON_KEY),
    },
  },
});
