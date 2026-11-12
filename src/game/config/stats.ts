import { PLAYER } from './player'

export type StatName = 'might' | 'area' | 'haste' | 'amount' | 'speed' | 'magnet' | 'healthMax' | 'regen' | 'luck' | 'greed' | 'extraSkillChance'

export const BASE_STATS: Record<StatName, number> = {
  might: 1, area: 1, haste: 0, amount: 0, speed: 1, magnet: 1, healthMax: PLAYER.healthMax, regen: 0, luck: 1, greed: 1, extraSkillChance: 0,
}

export const STAT_LIMITS = { hasteCap: 0.6 }
