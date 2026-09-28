'use client';

import React, { useState } from 'react';
import { motion, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TooltipItem {
  id: number | string;
  name: string;
  designation: string;
  metric?: string;
  badge?: string;
  color?: string;
}

export function AnimatedTooltip({
  items,
  className,
}: {
  items: TooltipItem[];
  className?: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | string | null>(null);
  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);

  const rotate = useSpring(useTransform(x, [-100, 100], [-30, 30]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-30, 30]), springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {items.map((item) => (
        <div
          className="relative group select-none"
          key={item.id}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
          onMouseMove={handleMouseMove}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.85 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: 'spring',
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 15, scale: 0.85 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: 'nowrap',
                }}
                className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-xl bg-slate-900 text-white z-50 shadow-xl px-3.5 py-1.5 border border-slate-700/80 pointer-events-none"
              >
                <div className="absolute inset-x-10 -bottom-px bg-gradient-to-r from-transparent via-[#6366F1] to-transparent h-px " />
                <div className="font-bold text-[11px] leading-tight text-white">{item.name}</div>
                <div className="text-[10px] text-slate-300 font-medium">{item.designation}</div>
                {item.metric && (
                  <div className="text-[9px] font-mono text-emerald-400 mt-0.5">{item.metric}</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={cn(
              'w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-xs cursor-pointer transition-transform duration-200 group-hover:scale-115 group-hover:z-30 relative',
              item.color || 'bg-blue-50 text-blue-700'
            )}
          >
            {item.badge || item.name.slice(0, 3).toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );
}
