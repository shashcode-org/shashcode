
import React, { useEffect, useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedElementProps {
  children: ReactNode;
  animation?: 'fadeIn' | 'slideIn' | 'pulse' | 'float';
  delay?: 'none' | '100' | '200' | '300' | '400' | '500';
  threshold?: number;
  className?: string;
}

const AnimatedElement = ({
  children,
  animation = 'fadeIn',
  delay = 'none',
  threshold = 0.1,
  className
}: AnimatedElementProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(`animate-${animation}`);
          if (delay !== 'none') {
            entry.target.classList.add(`animate-delay-${delay}`);
          }
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
      }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [animation, delay, threshold]);
  
  return (
    <div 
      ref={ref} 
      className={cn("opacity-0", className)}
    >
      {children}
    </div>
  );
};

export default AnimatedElement;
