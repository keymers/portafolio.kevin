import React from 'react';

interface Props {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  duration?: number;
  distance?: number;
  scale?: number;
}

/**
 * Reveal al hacer scroll, 100% CSS.
 *
 * El contenido SIEMPRE existe y es visible en el HTML: no dependemos de
 * JavaScript ni de IntersectionObserver, así que Google, un navegador lento
 * o alguien con JS desactivado ve la página completa. Donde el navegador
 * soporta animaciones por scroll (animation-timeline) se añade un desplazamiento
 * sutil; donde no, no pasa nada.
 *
 * Las props de animación se mantienen por compatibilidad con las páginas que
 * ya usan <ScrollReveal delay=... direction=...>.
 */
const ScrollReveal: React.FC<Props> = ({ children, className = '' }) => {
  return <div className={`reveal ${className}`.trim()}>{children}</div>;
};

export default ScrollReveal;
