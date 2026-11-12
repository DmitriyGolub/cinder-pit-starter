import type { StatName } from './stats'

interface StatUnit {
  suffix: string
  percent: boolean
  sign: 1 | -1
}

const unit = (suffix: string, percent = true, sign: 1 | -1 = 1): StatUnit => ({ suffix, percent, sign })

const STAT_UNITS: Record<StatName, StatUnit> = {
  might: unit('урона'),
  area: unit('площади'),
  haste: unit('перезарядки', true, -1),
  amount: unit('снаряд', false),
  speed: unit('скорости'),
  magnet: unit('радиуса сбора'),
  healthMax: unit('к здоровью', false),
  regen: unit('здоровья/с', false),
  luck: unit('удачи: 4-я карта, двойной сундук, дроп'),
  greed: unit('монет'),
  extraSkillChance: unit('шанс +1 навыка на новом уровне'),
}

export function statAmountText(stat: StatName, amount: number): string {
  const { percent, sign } = STAT_UNITS[stat]
  const value = amount * sign
  const size = +Math.abs(percent ? value * 100 : value).toFixed(2)
  return `${value < 0 ? '-' : '+'}${size}${percent ? '%' : ''}`
}

export const statBonusText = (stat: StatName, amount: number) => `${statAmountText(stat, amount)} ${STAT_UNITS[stat].suffix}`
