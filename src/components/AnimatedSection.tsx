'use client';

import React from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-in' | 'slide-up' | 'scale-in' | 'stagger' | 'on-appear';
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  debug?: boolean;
}

export function AnimatedSection({
  children,
  className,
  animation = 'on-appear',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -100px 0px',
  debug = false,
}: AnimatedSectionProps) {
  const { ref, isIntersecting, prefersReducedMotion } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  // Debug logging
  React.useEffect(() => {
    if (debug) {
      console.log(`AnimatedSection (${animation}):`, { isIntersecting });
    }
  }, [isIntersecting, animation, debug]);

  return (
    <div
      ref={ref}
      className={cn(
        `animate-${animation}`,
        isIntersecting && 'animate-in',
        className
      )}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
      }}
      data-animation={animation}
      data-intersecting={isIntersecting}
      data-prefers-reduced-motion={prefersReducedMotion}
    >
      {children}
    </div>
  );
}