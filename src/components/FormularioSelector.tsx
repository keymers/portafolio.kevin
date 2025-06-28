import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline';
import AddTestimonialForm from './AddTestimonialForm';
import FormularioCliente from './FormularioCliente';
import { formulariosCotizacionAPI } from '../services/api-cotizacion';
import { toast } from 'react-hot-toast';

const TABS = [
  {
    id: 'testimonios',
    label: 'Testimonios',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    id: 'cotizacion',
    label: 'Cotización',
    icon: CalculatorIcon,
  },
] as const;

type TabId = typeof TABS[number]['id'];

const FormularioSelector: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('testimonios');
  const [formularioId, setFormularioId] = useState<string>('');

  const handleTabChange = async (tabId: TabId) => {
    setActiveTab(tabId);
    
    // Si se selecciona cotización, crear un formulario real
    if (tabId === 'cotizacion' && !formularioId) {
      try {
        const nuevoFormulario = {
          nombre_proyecto: 'Nuevo Proyecto',
          descripcion_general: '',
          objetivo_principal: '',
          publico_objetivo: '',
          plataforma_objetivo: 'web' as const,
          estilo_diseno: 'moderno' as const,
          urgencia: 'media' as const,
          presupuesto_aproximado: undefined,
          divisa_presupuesto: 'USD' as const,
          persona_contacto: '',
          email_contacto: '',
          telefono_contacto: '',
          mantenimiento_requerido: false,
          capacitacion_requerida: false
        };
        
        const response = await formulariosCotizacionAPI.create(nuevoFormulario);
        
        if (response.data && response.data.id) {
          setFormularioId(response.data.id);
        } else {
          toast.error('Error: No se pudo obtener el ID del formulario');
        }
      } catch (error) {
        // No usar IDs temporales, mostrar error al usuario
        toast.error('Error al crear el formulario. Por favor, intenta de nuevo.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-600/30 p-0">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-2 text-lg font-semibold transition-colors
              ${activeTab === tab.id
                ? 'text-white border-b-2 border-indigo-500 bg-gray-900'
                : 'text-gray-400 hover:text-white bg-transparent'}
            `}
            style={{ outline: 'none' }}
          >
            <tab.icon className="w-6 h-6" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'testimonios' && (
          <AddTestimonialForm />
        )}
        {activeTab === 'cotizacion' && formularioId && (
          <FormularioCliente formularioId={formularioId} />
        )}
        {activeTab === 'cotizacion' && !formularioId && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Preparando formulario...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioSelector; 