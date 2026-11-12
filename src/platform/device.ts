export const isMobile = (): boolean =>
  typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) && !window.matchMedia('(pointer: fine)').matches
