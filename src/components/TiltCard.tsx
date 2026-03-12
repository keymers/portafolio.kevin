import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const TiltCard: React.FC<Props> = ({ children, className = '' }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Extraídos aquí para no violar las Reglas de Hooks (no llamar hooks dentro de JSX)
  const spotlightBg = useTransform(
    [mouseX, mouseY],
    ([cx, cy]: number[]) => `radial-gradient(600px circle at ${cx}px ${cy}px, rgba(139, 92, 246, 0.1), transparent 80%)`
  );
  const glowBg = useTransform(
    [mouseX, mouseY],
    ([cx, cy]: number[]) => `radial-gradient(400px circle at ${cx}px ${cy}px, rgba(236, 72, 153, 0.2), transparent 80%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mX = e.clientX - rect.left;
    const mY = e.clientY - rect.top;

    const xPct = mX / width - 0.5;
    const yPct = mY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
    mouseX.set(mX);
    mouseY.set(mY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative group ${className}`}
    >
      {/* Neon Top Bar Glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_-5px_15px_rgba(99,102,241,0.5)] z-20" />
      
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background: spotlightBg }}
      />
      
      {/* Glow Border */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: glowBg,
          maskImage: 'linear-gradient(white, white), linear-gradient(white, white)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px'
        }}
      />

      <div className="relative z-10 transition-transform duration-300 group-hover:translate-z-10">
        {children}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .group:hover .service-icon {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.2);
        }
        .group:hover .service-icon svg {
          filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.8));
          color: #ec4899 !important;
          stroke: #ec4899 !important;
        }
      `}} />
    </motion.div>
  );
};

export default TiltCard;

