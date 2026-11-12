interface EffectConfig {
  sprite: string
  frames: number
  fps: number
  scale: number
  fullbright: boolean
}

export const EFFECTS = {
  boom: { sprite: 'boom', frames: 3, fps: 12, scale: 1, fullbright: true },
  burst: { sprite: 'boom', frames: 3, fps: 9, scale: 2.2, fullbright: true },
  spark: { sprite: 'arcane', frames: 2, fps: 14, scale: 1, fullbright: true },
  blood: { sprite: 'blood', frames: 1, fps: 4, scale: 1, fullbright: false },
  impact: { sprite: 'impact', frames: 3, fps: 14, scale: 1.2, fullbright: true },
} satisfies Record<string, EffectConfig>

export type EffectName = keyof typeof EFFECTS

export const EFFECT_Z = { hit: 0.5, body: 0.4 }
