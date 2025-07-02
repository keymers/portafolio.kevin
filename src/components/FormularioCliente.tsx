import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PaperAirplaneIcon,
  UserIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import type { FormularioRequisitos, RespuestaRequisito } from '../types/index.d.ts';
import { formulariosCotizacionAPI } from '../services/api-cotizacion';
import { NotificationService } from '../services/notifications';
import toast from 'react-hot-toast';

interface FormularioClienteProps {
  formularioId: string;
}

// Interfaz temporal para respuestas del cliente
interface RespuestaTemporal {
  id: string;
  formulario_id: string;
  pregunta: string;
  respuesta: string;
  tipo_respuesta: 'texto' | 'seleccion' | 'multiple' | 'archivo';
  fecha_respuesta: string;
}

// Interfaz para errores de validación
interface ValidationErrors {
  [key: string]: string;
}

// Función para validar email
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función para validar teléfono (básica)
const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/;
  return phoneRegex.test(phone);
};

// Función para validar solo números
const validateNumber = (value: string): boolean => {
  return /^\d+$/.test(value);
};

const FormularioCliente: React.FC<FormularioClienteProps> = ({ formularioId }) => {
  const [formulario, setFormulario] = useState<FormularioRequisitos | null>(null);
  const [loading, setLoading] = useState(true);
  const [paso, setPaso] = useState(1);
  const [respuestas, setRespuestas] = useState<RespuestaTemporal[]>([]);
  const [datosCliente, setDatosCliente] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Cargar formulario
  useEffect(() => {
    const cargarFormulario = async () => {
      try {
        setLoading(true);
        
        // Verificar que el ID sea un UUID válido
        if (!formularioId || formularioId.startsWith('temp-')) {
          throw new Error('ID de formulario inválido');
        }
        
        
        // Cargar el formulario existente
        const response = await formulariosCotizacionAPI.getById(formularioId);
        
        if (response.data) {
          setFormulario(response.data);
          
          // Pre-llenar datos del cliente si están disponibles
          setDatosCliente({
            nombre: response.data.persona_contacto || '',
            email: response.data.email_contacto || '',
            telefono: response.data.telefono_contacto || '',
            empresa: ''
          });
        } else {
          throw new Error('No se encontraron datos del formulario');
        }
      } catch (error) {
        console.error('Error al cargar formulario:', error);
        toast.error('Error al cargar el formulario. Por favor, intenta de nuevo.');
        setFormulario(null);
      } finally {
        setLoading(false);
      }
    };

    cargarFormulario();
  }, [formularioId]);

  // Manejar cambios en respuestas
  const handleRespuestaChange = (pregunta: string, valor: string | string[]) => {
    setRespuestas(prev => {
      const existente = prev.find(r => r.pregunta === pregunta);
      if (existente) {
        return prev.map(r => 
          r.pregunta === pregunta 
            ? { ...r, respuesta: Array.isArray(valor) ? valor.join(', ') : valor }
            : r
        );
      } else {
        return [...prev, {
          id: '',
          formulario_id: formularioId,
          pregunta: pregunta,
          respuesta: Array.isArray(valor) ? valor.join(', ') : valor,
          tipo_respuesta: 'texto',
          fecha_respuesta: new Date().toISOString()
        }];
      }
    });
  };

  // Manejar cambios en datos del cliente con validación
  const handleClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Limpiar error del campo que se está editando
    setErrors(prev => ({ ...prev, [name]: '' }));
    
    // Validaciones específicas por campo
    let newValue = value;
    
    if (name === 'telefono') {
      // Solo permitir números, espacios, guiones y paréntesis
      newValue = value.replace(/[^\d\s\-\(\)\+]/g, '');
    }
    
    if (name === 'nombre') {
      // Solo permitir letras, espacios y algunos caracteres especiales
      newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    }
    
    setDatosCliente(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  // Validar paso actual
  const validarPaso = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    switch (paso) {
      case 1:
        // Validar información de contacto
        if (!datosCliente.nombre.trim()) {
          newErrors.nombre = 'El nombre es requerido';
        } else if (datosCliente.nombre.trim().length < 2) {
          newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        }
        
        if (!datosCliente.email.trim()) {
          newErrors.email = 'El email es requerido';
        } else if (!validateEmail(datosCliente.email)) {
          newErrors.email = 'Ingresa un email válido';
        }
        
        if (datosCliente.telefono && !validatePhone(datosCliente.telefono)) {
          newErrors.telefono = 'Ingresa un teléfono válido';
        }
        break;
        
      case 2:
        // Validar información del proyecto
        if (!formulario?.nombre_proyecto?.trim()) {
          newErrors.nombre_proyecto = 'El nombre del proyecto es requerido';
        } else if (formulario.nombre_proyecto.trim().length < 3) {
          newErrors.nombre_proyecto = 'El nombre del proyecto debe tener al menos 3 caracteres';
        }
        
        if (!formulario?.descripcion_general?.trim()) {
          newErrors.descripcion_general = 'La descripción es requerida';
        } else if (formulario.descripcion_general.trim().length < 10) {
          newErrors.descripcion_general = 'La descripción debe tener al menos 10 caracteres';
        }
        break;
        
      case 3:
        // Validar detalles específicos
        if (formulario?.presupuesto_aproximado && formulario.presupuesto_aproximado < 0) {
          newErrors.presupuesto_aproximado = 'El presupuesto no puede ser negativo';
        }
        
        if (formulario?.fecha_limite_deseada) {
          const fechaLimite = new Date(formulario.fecha_limite_deseada);
          const hoy = new Date();
          if (fechaLimite < hoy) {
            newErrors.fecha_limite_deseada = 'La fecha límite no puede ser anterior a hoy';
          }
        }
        break;
        
      case 4:
        return true; // Revisión final
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Siguiente paso
  const siguientePaso = () => {
    if (validarPaso()) {
      setPaso(prev => Math.min(prev + 1, 4));
    } else {
      toast.error('Por favor corrige los errores antes de continuar');
    }
  };

  // Paso anterior
  const pasoAnterior = () => {
    setPaso(prev => Math.max(prev - 1, 1));
  };

  // Enviar formulario
  const enviarFormulario = async () => {
    try {
      // Preparar datos del formulario, excluyendo campos vacíos
      const formularioActualizado: Partial<FormularioRequisitos> = {
        persona_contacto: datosCliente.nombre,
        email_contacto: datosCliente.email,
        telefono_contacto: datosCliente.telefono,
        estado: 'pendiente' as const,
        fecha_completado: new Date().toISOString()
      };

      // Agregar otros campos solo si no están vacíos
      if (formulario?.nombre_proyecto) formularioActualizado.nombre_proyecto = formulario.nombre_proyecto;
      if (formulario?.descripcion_general) formularioActualizado.descripcion_general = formulario.descripcion_general;
      if (formulario?.objetivo_principal) formularioActualizado.objetivo_principal = formulario.objetivo_principal;
      if (formulario?.publico_objetivo) formularioActualizado.publico_objetivo = formulario.publico_objetivo;
      if (formulario?.funcionalidades_principales?.length) formularioActualizado.funcionalidades_principales = formulario.funcionalidades_principales;
      if (formulario?.funcionalidades_secundarias?.length) formularioActualizado.funcionalidades_secundarias = formulario.funcionalidades_secundarias;
      if (formulario?.integraciones_necesarias?.length) formularioActualizado.integraciones_necesarias = formulario.integraciones_necesarias;
      if (formulario?.plataforma_objetivo) formularioActualizado.plataforma_objetivo = formulario.plataforma_objetivo;
      if (formulario?.tecnologias_preferidas?.length) formularioActualizado.tecnologias_preferidas = formulario.tecnologias_preferidas;
      if (formulario?.requisitos_especiales) formularioActualizado.requisitos_especiales = formulario.requisitos_especiales;
      if (formulario?.estilo_diseno) formularioActualizado.estilo_diseno = formulario.estilo_diseno;
      if (formulario?.colores_preferidos?.length) formularioActualizado.colores_preferidos = formulario.colores_preferidos;
      if (formulario?.referencias_diseno?.length) formularioActualizado.referencias_diseno = formulario.referencias_diseno;
      if (formulario?.urgencia) formularioActualizado.urgencia = formulario.urgencia;
      if (formulario?.fecha_limite_deseada) formularioActualizado.fecha_limite_deseada = formulario.fecha_limite_deseada;
      if (formulario?.presupuesto_aproximado) formularioActualizado.presupuesto_aproximado = formulario.presupuesto_aproximado;
      if (formulario?.divisa_presupuesto) formularioActualizado.divisa_presupuesto = formulario.divisa_presupuesto;
      if (formulario?.competencia_analisis) formularioActualizado.competencia_analisis = formulario.competencia_analisis;
      if (formulario?.metricas_exito?.length) formularioActualizado.metricas_exito = formulario.metricas_exito;
      if (formulario?.mantenimiento_requerido !== undefined) formularioActualizado.mantenimiento_requerido = formulario.mantenimiento_requerido;
      if (formulario?.capacitacion_requerida !== undefined) formularioActualizado.capacitacion_requerida = formulario.capacitacion_requerida;
      if (formulario?.horario_preferido) formularioActualizado.horario_preferido = formulario.horario_preferido;
      if (formulario?.notas_adicionales) formularioActualizado.notas_adicionales = formulario.notas_adicionales;

      // Enviar respuestas usando el método correcto
      await formulariosCotizacionAPI.addRespuestas(formularioId, respuestas);
      
      // Actualizar el formulario
      const formularioCompletado = await formulariosCotizacionAPI.update(formularioId, formularioActualizado);

      // Enviar notificación por correo
      if (formularioCompletado.data) {
        await NotificationService.notifyNewCotizacion(formularioCompletado.data);
      }

      toast.success('¡Formulario enviado correctamente! Te contactaremos pronto.');
      setPaso(5); // Paso de confirmación
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      toast.error('Error al enviar el formulario');
    }
  };

  // Función para mostrar error de campo
  const getFieldError = (fieldName: string): string => {
    return errors[fieldName] || '';
  };

  // Función para obtener clase CSS de campo con error
  const getFieldClassName = (fieldName: string): string => {
    const baseClass = "w-full px-3 py-2 bg-slate-700 border rounded-lg text-slate-100 focus:outline-none focus:ring-2";
    const errorClass = "border-red-500 focus:ring-red-500";
    const normalClass = "border-slate-600 focus:ring-indigo-500";
    
    return `${baseClass} ${getFieldError(fieldName) ? errorClass : normalClass}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  if (!formulario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Formulario no encontrado</h2>
          <p className="text-slate-400">El enlace del formulario no es válido o ha expirado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4"
          >
            <DocumentTextIcon className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            Formulario de Requisitos
          </h1>
          <p className="text-slate-400">
            Proyecto: {formulario.nombre_proyecto}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  paso >= step 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {paso > step ? <CheckCircleIcon className="w-5 h-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    paso > step ? 'bg-indigo-600' : 'bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-slate-400">
            Paso {paso} de 4
          </div>
        </div>

        {/* Contenido del paso */}
        <AnimatePresence mode="wait">
          <motion.div
            key={paso}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="bg-slate-800 rounded-2xl p-6 shadow-xl"
          >
            {paso === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
                  <UserIcon className="w-6 h-6 mr-3 text-indigo-400" />
                  Información de Contacto
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={datosCliente.nombre}
                      onChange={handleClienteChange}
                      className={getFieldClassName('nombre')}
                      placeholder="Tu nombre completo"
                      maxLength={50}
                      required
                    />
                    {getFieldError('nombre') && (
                      <p className="text-red-400 text-sm mt-1">{getFieldError('nombre')}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={datosCliente.email}
                      onChange={handleClienteChange}
                      className={getFieldClassName('email')}
                      placeholder="tu@email.com"
                      required
                    />
                    {getFieldError('email') && (
                      <p className="text-red-400 text-sm mt-1">{getFieldError('email')}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={datosCliente.telefono}
                      onChange={handleClienteChange}
                      className={getFieldClassName('telefono')}
                      placeholder="+56 9 1234 5678"
                      maxLength={20}
                    />
                    {getFieldError('telefono') && (
                      <p className="text-red-400 text-sm mt-1">{getFieldError('telefono')}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Empresa
                    </label>
                    <input
                      type="text"
                      name="empresa"
                      value={datosCliente.empresa}
                      onChange={handleClienteChange}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nombre de tu empresa"
                      maxLength={50}
                    />
                  </div>
                </div>
              </div>
            )}

            {paso === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
                  <DocumentTextIcon className="w-6 h-6 mr-3 text-indigo-400" />
                  Información del Proyecto
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Nombre del proyecto *
                    </label>
                    <input
                      type="text"
                      value={formulario.nombre_proyecto || ''}
                      onChange={(e) => {
                        setFormulario(prev => prev ? {...prev, nombre_proyecto: e.target.value} : null);
                        setErrors(prev => ({ ...prev, nombre_proyecto: '' }));
                      }}
                      className={getFieldClassName('nombre_proyecto')}
                      placeholder="Ej: Sitio web corporativo"
                      maxLength={100}
                      required
                    />
                    {getFieldError('nombre_proyecto') && (
                      <p className="text-red-400 text-sm mt-1">{getFieldError('nombre_proyecto')}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Descripción general *
                    </label>
                    <textarea
                      value={formulario.descripcion_general || ''}
                      onChange={(e) => {
                        setFormulario(prev => prev ? {...prev, descripcion_general: e.target.value} : null);
                        setErrors(prev => ({ ...prev, descripcion_general: '' }));
                      }}
                      rows={4}
                      className={getFieldClassName('descripcion_general')}
                      placeholder="Describe brevemente tu proyecto..."
                      maxLength={500}
                      required
                    />
                    {getFieldError('descripcion_general') && (
                      <p className="text-red-400 text-sm mt-1">{getFieldError('descripcion_general')}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Objetivo principal
                    </label>
                    <textarea
                      value={formulario.objetivo_principal || ''}
                      onChange={(e) => setFormulario(prev => prev ? {...prev, objetivo_principal: e.target.value} : null)}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="¿Cuál es el objetivo principal de este proyecto?"
                      maxLength={300}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Público objetivo
                    </label>
                    <input
                      type="text"
                      value={formulario.publico_objetivo || ''}
                      onChange={(e) => setFormulario(prev => prev ? {...prev, publico_objetivo: e.target.value} : null)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ej: Empresarios, jóvenes, etc."
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Funcionalidades principales
                    </label>
                    <textarea
                      value={formulario.funcionalidades_principales?.join(', ') || ''}
                      onChange={(e) => {
                        const funcionalidades = e.target.value.split(',').map(f => f.trim()).filter(f => f);
                        setFormulario(prev => prev ? {...prev, funcionalidades_principales: funcionalidades} : null);
                      }}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Lista las funcionalidades principales separadas por comas"
                      maxLength={500}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Funcionalidades secundarias
                    </label>
                    <textarea
                      value={formulario.funcionalidades_secundarias?.join(', ') || ''}
                      onChange={(e) => {
                        const funcionalidades = e.target.value.split(',').map(f => f.trim()).filter(f => f);
                        setFormulario(prev => prev ? {...prev, funcionalidades_secundarias: funcionalidades} : null);
                      }}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Lista las funcionalidades secundarias separadas por comas"
                      maxLength={500}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Integraciones necesarias
                    </label>
                    <textarea
                      value={formulario.integraciones_necesarias?.join(', ') || ''}
                      onChange={(e) => {
                        const integraciones = e.target.value.split(',').map(i => i.trim()).filter(i => i);
                        setFormulario(prev => prev ? {...prev, integraciones_necesarias: integraciones} : null);
                      }}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ej: PayPal, Google Analytics, CRM, etc."
                      maxLength={500}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Plataforma objetivo
                    </label>
                    <select
                      value={formulario.plataforma_objetivo || 'web'}
                      onChange={(e) => setFormulario(prev => prev ? {...prev, plataforma_objetivo: e.target.value as any} : null)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="web">Web</option>
                      <option value="movil">Móvil</option>
                      <option value="ambas">Ambas</option>
                      <option value="desktop">Desktop</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tecnologías preferidas
                    </label>
                    <textarea
                      value={formulario.tecnologias_preferidas?.join(', ') || ''}
                      onChange={(e) => {
                        const tecnologias = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                        setFormulario(prev => prev ? {...prev, tecnologias_preferidas: tecnologias} : null);
                      }}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ej: React, Node.js, Python, etc."
                      maxLength={500}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Requisitos especiales
                    </label>
                    <textarea
                      value={formulario.requisitos_especiales || ''}
                      onChange={(e) => setFormulario(prev => prev ? {...prev, requisitos_especiales: e.target.value} : null)}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Requisitos técnicos o funcionales especiales"
                      maxLength={500}
                    />
                  </div>
                </div>
              </div>
            )}

            {paso === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
                  <DocumentTextIcon className="w-6 h-6 mr-3 text-indigo-400" />
                  Detalles Específicos
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Público objetivo
                    </label>
                    <input
                      type="text"
                      value={formulario.publico_objetivo || ''}
                      onChange={(e) => setFormulario(prev => prev ? {...prev, publico_objetivo: e.target.value} : null)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ej: Empresarios, jóvenes, etc."
                      maxLength={100}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Estilo de diseño
                    </label>
                    <select
                      value={formulario.estilo_diseno || 'moderno'}
                      onChange={(e) => setFormulario(prev => prev ? {...prev, estilo_diseno: e.target.value as any} : null)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="moderno">Moderno</option>
                      <option value="corporativo">Corporativo</option>
                      <option value="creativo">Creativo</option>
                      <option value="minimalista">Minimalista</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Urgencia
                    </label>
                    <select
                      value={formulario.urgencia || 'media'}
                      onChange={(e) => setFormulario(prev => prev ? {...prev, urgencia: e.target.value as any} : null)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                      <option value="critica">Crítica</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Fecha límite deseada
                    </label>
                    <input
                      type="date"
                      value={formulario.fecha_limite_deseada || ''}
                      onChange={(e) => {
                        setFormulario(prev => prev ? {
                          ...prev, 
                          fecha_limite_deseada: e.target.value || undefined
                        } : null);
                        setErrors(prev => ({ ...prev, fecha_limite_deseada: '' }));
                      }}
                      className={getFieldClassName('fecha_limite_deseada')}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {getFieldError('fecha_limite_deseada') && (
                      <p className="text-red-400 text-sm mt-1">{getFieldError('fecha_limite_deseada')}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Colores preferidos
                  </label>
                  <textarea
                    value={formulario.colores_preferidos?.join(', ') || ''}
                    onChange={(e) => {
                      const colores = e.target.value.split(',').map(c => c.trim()).filter(c => c);
                      setFormulario(prev => prev ? {...prev, colores_preferidos: colores} : null);
                    }}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ej: Azul, Verde, Blanco"
                    maxLength={200}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Referencias de diseño
                  </label>
                  <textarea
                    value={formulario.referencias_diseno?.join(', ') || ''}
                    onChange={(e) => {
                      const referencias = e.target.value.split(',').map(r => r.trim()).filter(r => r);
                      setFormulario(prev => prev ? {...prev, referencias_diseno: referencias} : null);
                    }}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="URLs de sitios web que te gusten como referencia"
                    maxLength={500}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Presupuesto aproximado
                    </label>
                    <input
                      type="number"
                      value={formulario.presupuesto_aproximado || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || (validateNumber(value) && parseInt(value) >= 0)) {
                          setFormulario(prev => prev ? {
                            ...prev, 
                            presupuesto_aproximado: value ? parseInt(value) : undefined
                          } : null);
                          setErrors(prev => ({ ...prev, presupuesto_aproximado: '' }));
                        }
                      }}
                      className={getFieldClassName('presupuesto_aproximado')}
                      placeholder="Ej: 50000"
                      min="0"
                      max="999999999"
                    />
                    {getFieldError('presupuesto_aproximado') && (
                      <p className="text-red-400 text-sm mt-1">{getFieldError('presupuesto_aproximado')}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Divisa
                    </label>
                    <select
                      value={formulario.divisa_presupuesto || 'USD'}
                      onChange={(e) => setFormulario(prev => prev ? {...prev, divisa_presupuesto: e.target.value as 'USD' | 'CLP'} : null)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="CLP">CLP ($)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Análisis de competencia
                  </label>
                  <textarea
                    value={formulario.competencia_analisis || ''}
                    onChange={(e) => setFormulario(prev => prev ? {...prev, competencia_analisis: e.target.value} : null)}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Describe la competencia y cómo te diferenciarías"
                    maxLength={500}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Métricas de éxito
                    </label>
                  <textarea
                    value={formulario.metricas_exito?.join(', ') || ''}
                    onChange={(e) => {
                      const metricas = e.target.value.split(',').map(m => m.trim()).filter(m => m);
                      setFormulario(prev => prev ? {...prev, metricas_exito: metricas} : null);
                    }}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ej: Aumento de ventas, más usuarios, etc."
                    maxLength={500}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Horario preferido para contacto
                  </label>
                  <select
                    value={formulario.horario_preferido || ''}
                    onChange={(e) => setFormulario(prev => prev ? {...prev, horario_preferido: e.target.value} : null)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="mañana">Mañana (9:00 - 12:00)</option>
                    <option value="tarde">Tarde (12:00 - 17:00)</option>
                    <option value="noche">Noche (17:00 - 20:00)</option>
                    <option value="flexible">Horario flexible</option>
                  </select>
                </div>

                {/* Campos de requisitos adicionales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      ¿Requiere mantenimiento?
                    </label>
                    <select
                      value={formulario.mantenimiento_requerido === true ? 'si' : formulario.mantenimiento_requerido === false ? 'no' : ''}
                      onChange={(e) => setFormulario(prev => prev ? {
                        ...prev, 
                        mantenimiento_requerido: e.target.value === 'si' ? true : e.target.value === 'no' ? false : undefined
                      } : null)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="si">Sí</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      ¿Requiere capacitación?
                    </label>
                    <select
                      value={formulario.capacitacion_requerida === true ? 'si' : formulario.capacitacion_requerida === false ? 'no' : ''}
                      onChange={(e) => setFormulario(prev => prev ? {
                        ...prev, 
                        capacitacion_requerida: e.target.value === 'si' ? true : e.target.value === 'no' ? false : undefined
                      } : null)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="si">Sí</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                {/* Campo de notas adicionales */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Notas adicionales
                  </label>
                  <textarea
                    value={formulario.notas_adicionales || ''}
                    onChange={(e) => setFormulario(prev => prev ? {...prev, notas_adicionales: e.target.value || undefined} : null)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={4}
                    placeholder="Información adicional, requisitos especiales, etc."
                    maxLength={1000}
                  />
                </div>
              </div>
            )}

            {paso === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
                  <CheckCircleIcon className="w-6 h-6 mr-3 text-indigo-400" />
                  Revisión Final
                </h2>
                
                <div className="bg-slate-700 rounded-lg p-4 space-y-4">
                  <h3 className="text-lg font-semibold text-slate-100">Información de Contacto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Nombre:</span>
                      <p className="text-slate-100">{datosCliente.nombre}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Email:</span>
                      <p className="text-slate-100">{datosCliente.email}</p>
                    </div>
                    {datosCliente.telefono && (
                      <div>
                        <span className="text-slate-400">Teléfono:</span>
                        <p className="text-slate-100">{datosCliente.telefono}</p>
                      </div>
                    )}
                    {datosCliente.empresa && (
                      <div>
                        <span className="text-slate-400">Empresa:</span>
                        <p className="text-slate-100">{datosCliente.empresa}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-slate-700 rounded-lg p-4 space-y-4">
                  <h3 className="text-lg font-semibold text-slate-100">Información del Proyecto</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-slate-400">Proyecto:</span>
                      <p className="text-slate-100">{formulario.nombre_proyecto || 'No especificado'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Descripción:</span>
                      <p className="text-slate-100">{formulario.descripcion_general || 'No especificada'}</p>
                    </div>
                    {formulario.objetivo_principal && (
                      <div>
                        <span className="text-slate-400">Objetivo:</span>
                        <p className="text-slate-100">{formulario.objetivo_principal}</p>
                      </div>
                    )}
                    {formulario.publico_objetivo && (
                      <div>
                        <span className="text-slate-400">Público objetivo:</span>
                        <p className="text-slate-100">{formulario.publico_objetivo}</p>
                      </div>
                    )}
                    {formulario.funcionalidades_principales?.length && (
                      <div>
                        <span className="text-slate-400">Funcionalidades principales:</span>
                        <p className="text-slate-100">{formulario.funcionalidades_principales.join(', ')}</p>
                      </div>
                    )}
                    {formulario.funcionalidades_secundarias?.length && (
                      <div>
                        <span className="text-slate-400">Funcionalidades secundarias:</span>
                        <p className="text-slate-100">{formulario.funcionalidades_secundarias.join(', ')}</p>
                      </div>
                    )}
                    {formulario.integraciones_necesarias?.length && (
                      <div>
                        <span className="text-slate-400">Integraciones:</span>
                        <p className="text-slate-100">{formulario.integraciones_necesarias.join(', ')}</p>
                      </div>
                    )}
                    {formulario.plataforma_objetivo && (
                      <div>
                        <span className="text-slate-400">Plataforma:</span>
                        <p className="text-slate-100">{formulario.plataforma_objetivo}</p>
                      </div>
                    )}
                    {formulario.tecnologias_preferidas?.length && (
                      <div>
                        <span className="text-slate-400">Tecnologías:</span>
                        <p className="text-slate-100">{formulario.tecnologias_preferidas.join(', ')}</p>
                      </div>
                    )}
                    {formulario.requisitos_especiales && (
                      <div>
                        <span className="text-slate-400">Requisitos especiales:</span>
                        <p className="text-slate-100">{formulario.requisitos_especiales}</p>
                      </div>
                    )}
                    {formulario.estilo_diseno && (
                      <div>
                        <span className="text-slate-400">Estilo de diseño:</span>
                        <p className="text-slate-100">{formulario.estilo_diseno}</p>
                      </div>
                    )}
                    {formulario.colores_preferidos?.length && (
                      <div>
                        <span className="text-slate-400">Colores preferidos:</span>
                        <p className="text-slate-100">{formulario.colores_preferidos.join(', ')}</p>
                      </div>
                    )}
                    {formulario.referencias_diseno?.length && (
                      <div>
                        <span className="text-slate-400">Referencias:</span>
                        <p className="text-slate-100">{formulario.referencias_diseno.join(', ')}</p>
                      </div>
                    )}
                    {formulario.urgencia && (
                      <div>
                        <span className="text-slate-400">Urgencia:</span>
                        <p className="text-slate-100">{formulario.urgencia}</p>
                      </div>
                    )}
                    {formulario.fecha_limite_deseada && (
                      <div>
                        <span className="text-slate-400">Fecha límite:</span>
                        <p className="text-slate-100">{formulario.fecha_limite_deseada}</p>
                      </div>
                    )}
                    {formulario.presupuesto_aproximado && (
                      <div>
                        <span className="text-slate-400">Presupuesto:</span>
                        <p className="text-slate-100">
                          ${formulario.presupuesto_aproximado.toLocaleString()} {formulario.divisa_presupuesto === 'USD' ? 'USD ($)' : 'CLP ($)'}
                        </p>
                      </div>
                    )}
                    {formulario.competencia_analisis && (
                      <div>
                        <span className="text-slate-400">Análisis de competencia:</span>
                        <p className="text-slate-100">{formulario.competencia_analisis}</p>
                      </div>
                    )}
                    {formulario.metricas_exito?.length && (
                      <div>
                        <span className="text-slate-400">Métricas de éxito:</span>
                        <p className="text-slate-100">{formulario.metricas_exito.join(', ')}</p>
                      </div>
                    )}
                    {formulario.mantenimiento_requerido !== undefined && (
                      <div>
                        <span className="text-slate-400">Mantenimiento:</span>
                        <p className="text-slate-100">
                          {formulario.mantenimiento_requerido ? 'Sí' : 'No'}
                        </p>
                      </div>
                    )}
                    {formulario.capacitacion_requerida !== undefined && (
                      <div>
                        <span className="text-slate-400">Capacitación:</span>
                        <p className="text-slate-100">
                          {formulario.capacitacion_requerida ? 'Sí' : 'No'}
                        </p>
                      </div>
                    )}
                    {formulario.horario_preferido && (
                      <div>
                        <span className="text-slate-400">Horario preferido:</span>
                        <p className="text-slate-100">{formulario.horario_preferido}</p>
                      </div>
                    )}
                    {formulario.notas_adicionales && (
                      <div>
                        <span className="text-slate-400">Notas adicionales:</span>
                        <p className="text-slate-100">{formulario.notas_adicionales}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {paso === 5 && (
              <div className="text-center space-y-6">
                <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto" />
                <h2 className="text-2xl font-bold text-slate-100">
                  ¡Formulario Enviado!
                </h2>
                <p className="text-slate-400">
                  Gracias por completar el formulario. Nos pondremos en contacto contigo pronto.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Botones de navegación */}
        {paso < 5 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={pasoAnterior}
              disabled={paso === 1}
              className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                paso === 1
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Anterior
            </button>
            
            {paso < 4 ? (
              <button
                onClick={siguientePaso}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Siguiente
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={enviarFormulario}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                Enviar Formulario
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioCliente; 