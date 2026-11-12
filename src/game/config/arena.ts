export const ARENA = { size: 96, recenter: 14, shift: 32, wallHeight: 2.4 }

export const ARENA_NOISE = {
  rock: 0.07, rockDetail: 0.23, rockDetailWeight: 0.35, rockThreshold: 0.52, clearRadiusSquared: 30,
  height: 0.025, heightBias: 0.2, heightLevels: 2, heightStep: 0.25,
  light: 0.05, lightBase: 0.55, lightRange: 0.4, lightMin: 0.25,
  variant: 0.02, floorVariant: 0.3, variantBias: 0.5,
}

export const ARENA_SHIFT = { detail: [40, -17], height: [90, 90], light: [-60, 20], wall: [7, -3], floor: [-31, 57] } as const

export const LEVEL_LIGHT = { initial: 0.5, outside: 0.3 }
