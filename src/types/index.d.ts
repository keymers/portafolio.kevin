// Tipos para formularios de requisitos/cotización
export interface FormularioRequisitos {
  id: string;
  cotizacion_id?: string;
  estado: 'enviado' | 'completado' | 'pendiente';
  fecha_envio: string;
  fecha_completado?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  nombre_proyecto: string;
  descripcion_general?: string;
  objetivo_principal?: string;
  publico_objetivo?: string;
  funcionalidades_principales?: string[];
  funcionalidades_secundarias?: string[];
  integraciones_necesarias?: string[];
  plataforma_objetivo?: 'web' | 'movil' | 'ambas' | 'desktop';
  tecnologias_preferidas?: string[];
  requisitos_especiales?: string;
  estilo_diseno?: 'moderno' | 'corporativo' | 'creativo' | 'minimalista' | 'otro';
  colores_preferidos?: string[];
  referencias_diseno?: string[];
  fecha_limite_deseada?: string;
  presupuesto_aproximado?: number;
  divisa_presupuesto?: 'USD' | 'CLP';
  urgencia?: 'baja' | 'media' | 'alta' | 'critica';
  competencia_analisis?: string;
  metricas_exito?: string[];
  mantenimiento_requerido?: boolean;
  capacitacion_requerida?: boolean;
  persona_contacto?: string;
  telefono_contacto?: string;
  email_contacto?: string;
  horario_preferido?: string;
  notas_adicionales?: string;
}

export interface RespuestaRequisito {
  id: string;
  formulario_id?: string;
  pregunta: string;
  respuesta: string;
  tipo_respuesta: 'texto' | 'seleccion' | 'multiple' | 'archivo';
  fecha_respuesta: string;
}

// Tipos para crear un nuevo formulario
export interface CreateFormularioRequisitos {
  cotizacion_id?: string;
  nombre_proyecto: string;
  descripcion_general?: string;
  objetivo_principal?: string;
  publico_objetivo?: string;
  funcionalidades_principales?: string[];
  funcionalidades_secundarias?: string[];
  integraciones_necesarias?: string[];
  plataforma_objetivo?: 'web' | 'movil' | 'ambas' | 'desktop';
  tecnologias_preferidas?: string[];
  requisitos_especiales?: string;
  estilo_diseno?: 'moderno' | 'corporativo' | 'creativo' | 'minimalista' | 'otro';
  colores_preferidos?: string[];
  referencias_diseno?: string[];
  fecha_limite_deseada?: string;
  presupuesto_aproximado?: number;
  divisa_presupuesto?: 'USD' | 'CLP';
  urgencia?: 'baja' | 'media' | 'alta' | 'critica';
  competencia_analisis?: string;
  metricas_exito?: string[];
  mantenimiento_requerido?: boolean;
  capacitacion_requerida?: boolean;
  persona_contacto?: string;
  telefono_contacto?: string;
  email_contacto?: string;
  horario_preferido?: string;
  notas_adicionales?: string;
}

// Tipos para crear una nueva respuesta
export interface CreateRespuestaRequisito {
  formulario_id?: string;
  pregunta: string;
  respuesta: string;
  tipo_respuesta: 'texto' | 'seleccion' | 'multiple' | 'archivo';
} 