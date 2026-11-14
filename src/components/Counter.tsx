import React, { useEffect, useState, useRef } from 'react';
import { useInView, animate } from 'framer-motion';

interface Props {
  value: number;
  suffix?: string;
  duration?: number;
}

/**
 * Contador: el HTML inicial ya muestra el valor final (3+, 100%, 2+).
 * Así el dato correcto existe sin JavaScript y también para los buscadores;
 * la animación solo reemplaza el número cuando el bloque ya está hidratado.
 */
const Counter: React.FC<Props> = ({ value, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(value);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setCount(value);
      return;
    }
    if (!isInView) return;

    const controls = animate(0, value, {
      duration,
      onUpdate: (current) => setCount(Math.floor(current)),
    });
    return () => controls.stop();
  }, [isInView, isMobile, value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

export default Counter;
