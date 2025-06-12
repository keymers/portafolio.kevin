import React, { useEffect } from 'react';

export default function EnvDiagnostic() {
  useEffect(() => {
    // Verificar otras variables
    
    // Verificar si EmailJS está disponible
    if (typeof window !== 'undefined' && (window as any).emailjs) {
    } else {
    }
  }, []);

  return null; // Este componente no renderiza nada
} 