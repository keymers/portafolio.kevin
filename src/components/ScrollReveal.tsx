import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  duration?: number;
  distance?: number;
  scale?: number;
}

const ScrollReveal: React.FC<Props> = ({ 
  children, 
  delay = 0, 
  direction = 'up', 
  className = '',
  duration = 0.6,
  distance = 50,
  scale = 1
}) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        scale: scale === 1 ? 1 : scale,
        ...directions[direction] 
      }}
      whileInView={{ 
        opacity: 1, 
        scale: 1,
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: duration, 
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
