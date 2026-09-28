// UDYOG MITRA Motion Tokens & Animation Utilities
// Part C5: Motion Tokens
export const MOTION_DURATIONS = {
  instant: 0.08, // 80ms
  fast: 0.12,    // 120ms
  base: 0.18,    // 180ms
  slow: 0.28,    // 280ms
  page: 0.35,    // 350ms
};

export const MOTION_EASINGS = {
  // ease-out-expo
  expoOut: [0.16, 1, 0.3, 1] as const,
  // ease-in-out
  easeInOut: [0.65, 0, 0.35, 1] as const,
  default: [0.16, 1, 0.3, 1] as const,
};

export const MOTION_SPRINGS = {
  modal: {
    type: 'spring',
    stiffness: 420,
    damping: 32,
  },
  popover: {
    type: 'spring',
    stiffness: 450,
    damping: 30,
  },
  switch: {
    type: 'spring',
    stiffness: 500,
    damping: 35,
  },
};

export const FADE_ENTER_VARIANTS = {
  initial: { opacity: 0, y: 6, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, transition: { duration: MOTION_DURATIONS.fast } },
};

export const SHEET_SLIDE_VARIANTS = {
  initial: { x: '100%', opacity: 0.8 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 },
};
