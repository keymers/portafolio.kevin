import React, { useState, lazy, Suspense } from 'react';
import {
  ChatBubbleLeftRightIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline';
import FormularioRapido from './FormularioRapido';

const AddTestimonialForm = lazy(() => import('./AddTestimonialForm'));

const TABS = [
  {
    id: 'cotizacion',
    label: 'Cotización Rápida',
    icon: CalculatorIcon,
  },
  {
    id: 'testimonios',
    label: 'Dejar Testimonio',
    icon: ChatBubbleLeftRightIcon,
  },
] as const;

type TabId = typeof TABS[number]['id'];

const FormularioSelector: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('cotizacion');

  return (
    <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-600/30 p-0">
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-700">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[150px] sm:min-w-0 flex items-center justify-center gap-2 py-3 sm:py-4 px-2 text-base sm:text-lg font-semibold transition-colors
              ${activeTab === tab.id
                ? 'text-white sm:border-b-2 sm:border-indigo-500 bg-gray-900'
                : 'text-gray-400 hover:text-white bg-transparent'}
            `}
            style={{ outline: 'none' }}
          >
            <tab.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {activeTab === 'cotizacion' && (
          <FormularioRapido />
        )}
        {activeTab === 'testimonios' && (
          <Suspense fallback={
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mx-auto mb-4"></div>
              <p className="text-slate-300">Cargando formulario de testimonios...</p>
            </div>
          }>
            <AddTestimonialForm />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default FormularioSelector;
