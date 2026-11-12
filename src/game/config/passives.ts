import type { StatName } from './stats'
import { statBonusText } from './statText'

export type PassiveId = 'might' | 'area' | 'haste' | 'amount' | 'swift' | 'magnet' | 'vitality' | 'regen' | 'luck' | 'greed'

interface PassiveConfig {
  name: string
  description: string
  stat: StatName
  perLevel: number
  levelMax: number
}

const passive = (name: string, stat: StatName, perLevel: number, levelMax: number): PassiveConfig =>
  ({ name, stat, perLevel, levelMax, description: statBonusText(stat, perLevel) })

export const PASSIVES: Record<PassiveId, PassiveConfig> = {
  might: passive('Сила', 'might', 0.1, 5),
  area: passive('Размах', 'area', 0.1, 5),
  haste: passive('Спешка', 'haste', 0.08, 5),
  amount: passive('Дубликат', 'amount', 1, 2),
  swift: passive('Лёгкость', 'speed', 0.1, 5),
  magnet: passive('Магнит', 'magnet', 0.4, 5),
  vitality: passive('Живучесть', 'healthMax', 20, 5),
  regen: passive('Регенерация', 'regen', 0.3, 5),
  luck: passive('Удача', 'luck', 0.1, 5),
  greed: passive('Жадность', 'greed', 0.2, 5),
}

export const PASSIVE_IDS = Object.keys(PASSIVES) as PassiveId[]
