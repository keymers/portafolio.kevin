import React, { useEffect, useState, useRef } from 'react';
import { useInView, animate } from 'framer-motion';

interface Props {
  value: number;
  suffix?: string;
  duration?: number;
}

const Counter: React.FC<Props> = ({ value, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: duration,
        onUpdate: (value) => setCount(Math.floor(value)),
      });
      return () => controls.stop();
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export default Counter;
