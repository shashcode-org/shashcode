
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import AnimatedElement from './AnimatedElement';

interface SectionProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  contentClassName?: string;
  id?: string;
  gradient?: boolean;
}

const Section = ({
  children,
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
  contentClassName,
  id,
  gradient = false
}: SectionProps) => {
  return (
    <section 
      id={id} 
      className={cn(
        'py-16 px-4 sm:px-6 lg:px-8',
        gradient && 'bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5',
        className
      )}
    >
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <AnimatedElement animation="fadeIn" delay="100">
                <h2 className={cn(
                  "text-3xl md:text-4xl font-bold mb-4",
                  titleClassName
                )}>
                  {title}
                </h2>
              </AnimatedElement>
            )}
            {subtitle && (
              <AnimatedElement animation="fadeIn" delay="200">
                <p className={cn(
                  "text-lg text-gray-600 max-w-3xl mx-auto",
                  subtitleClassName
                )}>
                  {subtitle}
                </p>
              </AnimatedElement>
            )}
          </div>
        )}
        <div className={contentClassName}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default Section;
