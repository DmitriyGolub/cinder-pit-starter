import { ENEMIES, type EnemyConfig } from './enemies'

interface WavePhase {
  from: number
  rate: number
  pool: [EnemyConfig, number][]
}

const { bat, skeleton, goblin, ghoul, eye, executioner, minotaur } = ENEMIES

export const WAVES: WavePhase[] = [
  { from: 0, rate: 0.7, pool: [[bat, 3], [skeleton, 2]] },
  { from: 60, rate: 2, pool: [[bat, 3], [skeleton, 3], [goblin, 1]] },
  { from: 180, rate: 3, pool: [[skeleton, 3], [goblin, 2], [ghoul, 2], [bat, 2]] },
  { from: 360, rate: 4.5, pool: [[ghoul, 3], [goblin, 3], [bat, 3], [skeleton, 2]] },
  { from: 600, rate: 6, pool: [[ghoul, 4], [goblin, 3], [bat, 4], [eye, 0.3]] },
  { from: 900, rate: 8, pool: [[ghoul, 4], [goblin, 4], [bat, 5], [eye, 0.6]] },
]

export const ELITE = { every: 120, enemy: eye }
export const SWARM = { every: 90, enemy: bat, count: 24, ringMin: 9, ringMax: 11 }
interface BossTier {
  health: number
  scale: number
  damage: number
  speed: number
  tint: number
}

export const BOSS_TIERS: BossTier[] = [
  { health: 0.35, scale: 1, damage: 0.7, speed: 0.95, tint: 0 },
  { health: 0.7, scale: 1.1, damage: 0.85, speed: 1, tint: 0xd03838 },
  { health: 1.1, scale: 1.2, damage: 1, speed: 1.03, tint: 0x9a50ff },
  { health: 1.6, scale: 1.3, damage: 1.2, speed: 1.06, tint: 0x40a8ff },
  { health: 2.2, scale: 1.45, damage: 1.45, speed: 1.1, tint: 0xffc040 },
]

const FINAL_BOSS_AT = 1140

export const BOSSES = [
  ...WAVES.slice(1).map((wave, tier) => ({ at: wave.from, enemy: executioner, tier })),
  { at: FINAL_BOSS_AT, enemy: minotaur, tier: -1 },
]
export const HP_PER_MINUTE = 0.15

export const waveIndex = (time: number) => WAVES.filter((wave) => wave.from <= time).length - 1
