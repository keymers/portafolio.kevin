import React, { useState } from 'react';
import { PaperAirplaneIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { formulariosCotizacionAPI } from '../services/api-cotizacion';
import { NotificationService } from '../services/notifications';
import toast from 'react-hot-toast';

const SERVICIOS_OPTIONS = [
  'Sitio web para mi negocio o empresa',
  'Tienda online (E-commerce)',
  'Landing page de alta conversión',
  'Rediseño de mi sitio web actual',
  'Mantenimiento o soporte técnico',
  'Otro requerimiento a medida'
];

export default function FormularioRapido() {
  const [servicio, setServicio] = useState(SERVICIOS_OPTIONS[0]);
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [detalles, setDetalles] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [haInteractuado, setHaInteractuado] = useState(false);

  // Registrar inicio de formulario en GA4 una sola vez al interactuar
  const handleInteraction = () => {
    if (!haInteractuado) {
      setHaInteractuado(true);
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'quote_form_start', {
          event_category: 'form',
          event_label: 'formulario_rapido'
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      toast.error('Por favor ingresa tu nombre');
      return;
    }

    if (!contacto.trim()) {
      toast.error('Por favor ingresa tu correo o WhatsApp');
      return;
    }

    try {
      setEnviando(true);

      const esEmail = contacto.includes('@');
      const datosCotizacion = {
        nombre_proyecto: servicio,
        persona_contacto: nombre.trim(),
        email_contacto: esEmail ? contacto.trim() : '',
        telefono_contacto: !esEmail ? contacto.trim() : '',
        descripcion_general: detalles.trim() || `Interesado en: ${servicio}. Medio de contacto: ${contacto.trim()}`,
        plataforma_objetivo: 'web' as const,
        estilo_diseno: 'moderno' as const,
        urgencia: 'media' as const
      };

      // 1. Guardar en Supabase
      const response = await formulariosCotizacionAPI.create(datosCotizacion);

      // 2. Notificar por email (EmailJS)
      if (response && response.data) {
        await NotificationService.notifyNewCotizacion(response.data as any);
      }

      // 3. Medir conversión en GA4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', {
          event_category: 'conversion',
          event_label: 'cotizacion_rapida',
          value: 1
        });
      }

      toast.success('¡Solicitud enviada correctamente!');
      setEnviado(true);
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      toast.error('Hubo un problema al enviar la solicitud. Por favor intenta por WhatsApp.');
    } finally {
      setEnviando(false);
    }
  };

  // Enlace dinámico a WhatsApp con los datos que el usuario ya escribió
  const whatsappUrl = `https://wa.me/+56973650208?text=${encodeURIComponent(
    `Hola Kevin! Me interesa cotizar: ${servicio}.${nombre ? ` Mi nombre es ${nombre}.` : ''}${detalles ? ` Detalle: ${detalles}` : ''}`
  )}`;

  if (enviado) {
    return (
      <div className="text-center py-8 px-4 space-y-6">
        <CheckCircleIcon className="w-16 h-16 text-emerald-400 mx-auto" />
        <h3 className="text-2xl font-bold text-slate-100">
          ¡Solicitud recibida con éxito!
        </h3>
        <p className="text-slate-300 max-w-md mx-auto leading-relaxed text-base">
          Gracias por escribirnos, <strong>{nombre}</strong>. Nos pondremos en contacto contigo a la brevedad a través de <strong>{contacto}</strong>.
        </p>
        <div className="pt-4 border-t border-slate-700/60 max-w-sm mx-auto">
          <p className="text-xs text-slate-400 mb-3">¿Prefieres agilizar la conversación?</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors text-sm shadow-lg shadow-emerald-900/30"
          >
            💬 Abrir chat en WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 px-1">
      <div className="mb-6 text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Cuéntanos qué necesitas
        </h3>
        <p className="text-sm sm:text-base text-slate-300">
          Danos algunos datos y conversemos sobre tu proyecto. Sin compromiso.
        </p>
      </div>

      <form onSubmit={handleSubmit} onFocus={handleInteraction} className="space-y-4 max-w-lg mx-auto">
        {/* Campo 1: ¿Qué necesitas? */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">
            ¿Qué necesitas? *
          </label>
          <select
            value={servicio}
            onChange={(e) => setServicio(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-600/70 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          >
            {SERVICIOS_OPTIONS.map((opcion) => (
              <option key={opcion} value={opcion} className="bg-slate-900 text-slate-100">
                {opcion}
              </option>
            ))}
          </select>
        </div>

        {/* Campo 2: Tu nombre */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">
            Tu nombre *
          </label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Marcela Silva"
            className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-600/70 rounded-lg text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        {/* Campo 3: Correo o WhatsApp */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1">
            Correo o WhatsApp *
          </label>
          <p className="text-xs text-slate-400 mb-1.5">
            Ingresa el medio que te resulte más cómodo para responderte.
          </p>
          <input
            type="text"
            required
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            placeholder="ej: +56 9 1234 5678 o nombre@empresa.cl"
            className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-600/70 rounded-lg text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        {/* Campo 4: Cuéntanos un poco más (opcional) */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">
            Cuéntanos un poco más <span className="text-slate-400 font-normal">(opcional)</span>
          </label>
          <textarea
            rows={3}
            value={detalles}
            onChange={(e) => setDetalles(e.target.value)}
            placeholder="¿De qué trata tu negocio o qué objetivo buscas lograr?"
            className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-600/70 rounded-lg text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
          ></textarea>
        </div>

        {/* Botón principal */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={enviando}
            className="w-full py-3 px-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-60 text-base"
          >
            {enviando ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Enviando solicitud...</span>
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="w-5 h-5" />
                <span>Solicitar Cotización Gratis</span>
              </>
            )}
          </button>
        </div>

        {/* Opción directa de WhatsApp */}
        <div className="pt-4 text-center border-t border-slate-700/60">
          <p className="text-xs text-slate-400 mb-2.5">
            ¿Quieres una respuesta al instante sin completar el formulario?
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-medium rounded-lg transition-colors text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"></path>
            </svg>
            Contactar directamente por WhatsApp
          </a>
        </div>
      </form>
    </div>
  );
}
