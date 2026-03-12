import React, { useEffect, useState, useRef } from 'react';
import { useInView, animate } from 'framer-motion';

interface Props {
  value: number;
  suffix?: string;
  duration?: number;
}

const Counter: React.FC<Props> = ({ value, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
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
    if (isInView || isMobile) {
      const controls = animate(isMobile ? value : 0, value, {
        duration: isMobile ? 0 : duration,
        onUpdate: (value) => setCount(Math.floor(value)),
      });
      return () => controls.stop();
    }
  }, [isInView, isMobile, value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export default Counter;
