import type { EffectName } from './effects'

export interface ElementConfig {
  name: string
  sprite: string
  hit: EffectName
  tint: number
  ring: number
  directional: boolean
  frames: number
}

export const ELEMENTS = {
  arcane: { name: 'тайная магия', sprite: 'orb', hit: 'impact', tint: 0xb07aff, ring: 0x6a4ad0, directional: true, frames: 2 },
  fire: { name: 'огонь', sprite: 'orb', hit: 'impact', tint: 0xff8a30, ring: 0xd05a20, directional: true, frames: 2 },
  frost: { name: 'лёд', sprite: 'ice', hit: 'spark', tint: 0, ring: 0x4aa8d0, directional: true, frames: 1 },
  storm: { name: 'молния', sprite: 'orb', hit: 'impact', tint: 0xfff07a, ring: 0xd0c040, directional: true, frames: 2 },
  poison: { name: 'яд', sprite: 'orb', hit: 'impact', tint: 0x8aff6a, ring: 0x4a9a2a, directional: true, frames: 2 },
  blood: { name: 'кровь', sprite: 'orb', hit: 'impact', tint: 0xff4a4a, ring: 0x9a1a2a, directional: true, frames: 2 },
  bone: { name: 'кость', sprite: 'arrow', hit: 'blood', tint: 0, ring: 0x9a9080, directional: true, frames: 1 },
} satisfies Record<string, ElementConfig>

export type Element = keyof typeof ELEMENTS
