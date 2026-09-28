'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Component = 'button',
  duration = 3,
  clockwise = true,
  ...props
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  as?: any;
  duration?: number;
  clockwise?: boolean;
} & React.HTMLAttributes<HTMLElement>) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<'TOP' | 'LEFT' | 'BOTTOM' | 'RIGHT'>('TOP');

  const rotateDirection = (currentDirection: 'TOP' | 'LEFT' | 'BOTTOM' | 'RIGHT') => {
    const directions: ('TOP' | 'LEFT' | 'BOTTOM' | 'RIGHT')[] = ['TOP', 'LEFT', 'BOTTOM', 'RIGHT'];
    const index = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (index - 1 + directions.length) % directions.length
      : (index + 1) % directions.length;
    return directions[nextIndex];
  };

  const movingMap: Record<string, string> = {
    TOP: 'radial-gradient(20.7% 50% at 50% 0%, #2A47C9 0%, rgba(255, 255, 255, 0) 100%)',
    LEFT: 'radial-gradient(16.6% 43.1% at 0% 50%, #6366F1 0%, rgba(255, 255, 255, 0) 100%)',
    BOTTOM: 'radial-gradient(20.7% 50% at 50% 100%, #2A47C9 0%, rgba(255, 255, 255, 0) 100%)',
    RIGHT: 'radial-gradient(16.2% 41.2% at 100% 50%, #6366F1 0%, rgba(255, 255, 255, 0) 100%)',
  };

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration, clockwise]);

  return (
    <Component
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative flex rounded-full border border-slate-200/80 p-[1px] content-center transition duration-500 items-center justify-center overflow-visible select-none',
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          'w-auto text-slate-900 z-10 bg-white px-5 py-2.5 rounded-full transition-colors',
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className="flex-none inset-0 overflow-hidden absolute z-0 rounded-full"
        style={{
          filter: 'blur(2px)',
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], 'radial-gradient(50% 50% at 50% 50%, #2A47C9 0%, rgba(255,255,255,0) 100%)']
            : movingMap[direction],
        }}
        transition={{ ease: 'linear', duration: duration ?? 1 }}
      />
      <div className="bg-white absolute z-1 flex-none inset-[1px] rounded-full" />
    </Component>
  );
}
