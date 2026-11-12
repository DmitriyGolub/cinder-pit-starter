import type { SpriteSpec } from './sprite'

const GEMS = [
  { from: 0, tint: 0x5ab4ff, scale: 1.6 },
  { from: 5, tint: 0x5aff7a, scale: 1.9 },
  { from: 25, tint: 0xff4a5a, scale: 2.2 },
  { from: 100, tint: 0xc070ff, scale: 2.6 },
]

export const gemStyle = (amount: number) => [...GEMS].reverse().find((gem) => amount >= gem.from) ?? GEMS[0]

export const DROPS = { coinChance: 0.04, potionChance: 0.006, jitter: 0.5 }

export const POTION_HEAL = 30

export const BOMB = { radius: 9, damage: 300, ring: 12 }

export const WEAPON_GLOW = { lift: 0.02, radius: 0.42, float: 0.16, max: 16, haze: [0.75, 0.85] as [number, number], hazeDrop: 0.12 }

export const PULL = { base: 6, boost: 40 }

export const CHEST_COINS = 10

export const GOLD_CHOICE = 25

export type PickupName = 'gem' | 'coin' | 'potion' | 'chest' | 'magnet' | 'bomb' | 'weapon'

export const PICKUP_VIEW: Record<PickupName, SpriteSpec> = {
  gem: { frame: 'xp1', lift: 0.38, fullbright: true },
  coin: { frame: 'coin', lift: 0.3, fullbright: true, spin: 5, scale: 1.5 },
  potion: { frame: 'potion' },
  chest: { frame: 'chest' },
  magnet: { frame: 'magnet' },
  bomb: { frame: 'bomb' },
  weapon: { frame: '', lift: WEAPON_GLOW.float, fullbright: true },
}
