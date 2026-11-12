import type { StatName } from './stats'
import { statBonusText } from './statText'

interface MetaConfig {
  name: string
  stat: StatName
  perLevel: number
  levelMax: number
  cost: number
}

export type MetaId = 'might' | 'vitality' | 'regen' | 'magnet' | 'swift' | 'greed'

export const META: Record<MetaId, MetaConfig> = {
  might: { name: 'Сила', stat: 'might', perLevel: 0.05, levelMax: 5, cost: 40 },
  vitality: { name: 'Живучесть', stat: 'healthMax', perLevel: 10, levelMax: 5, cost: 30 },
  regen: { name: 'Регенерация', stat: 'regen', perLevel: 0.1, levelMax: 5, cost: 50 },
  magnet: { name: 'Магнит', stat: 'magnet', perLevel: 0.2, levelMax: 3, cost: 25 },
  swift: { name: 'Лёгкость', stat: 'speed', perLevel: 0.05, levelMax: 3, cost: 35 },
  greed: { name: 'Жадность', stat: 'greed', perLevel: 0.1, levelMax: 5, cost: 20 },
}

export const META_IDS = Object.keys(META) as MetaId[]

export function isMetaId(id: string): id is MetaId {
  return id in META
}

export function metaLevel(levels: Record<string, number>, id: MetaId): number {
  return levels[id] ?? 0
}

export function metaState(id: MetaId, levels: Record<string, number>): { level: number; maxed: boolean; cost: number } {
  const level = metaLevel(levels, id)
  return { level, maxed: level >= META[id].levelMax, cost: META[id].cost * (level + 1) }
}

export function metaBonusText(id: MetaId, level: number): string {
  return statBonusText(META[id].stat, META[id].perLevel * level)
}
