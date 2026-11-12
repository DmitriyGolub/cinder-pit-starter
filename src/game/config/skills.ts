import type { Element } from './elements'
import type { PassiveId } from './passives'

export type SkillId =
  | 'arcaneBolt' | 'boomerangAxe' | 'orbitDaggers' | 'plagueAura' | 'runeShield' | 'chainLightning'
  | 'arrowStorm' | 'axeWhirl' | 'sawHalo' | 'bloodAura' | 'bastion' | 'heavenWrath'

export type SkillBehavior = 'bolt' | 'axe' | 'orbit' | 'aura' | 'shield' | 'chain'

export interface SkillLevelConfig {
  damage: number
  cooldown: number
  count: number
  area: number
  speed: number
  pierce: number
}

export interface SkillConfig {
  name: string
  description: string
  behavior: SkillBehavior
  element: Element
  levels: SkillLevelConfig[]
  evolve?: { passive: PassiveId; into: SkillId }
  evolved?: boolean
  lifesteal?: number
}

const level = (damage: number, cooldown: number, count: number, area: number, speed: number, pierce: number): SkillLevelConfig =>
  ({ damage, cooldown, count, area, speed, pierce })

export const SKILLS: Record<SkillId, SkillConfig> = {
  arcaneBolt: {
    name: 'Магическая стрела', description: 'Самонаводящиеся стрелы в ближайших врагов', behavior: 'bolt', element: 'arcane',
    levels: [level(10, 1.2, 1, 1, 9, 1), level(13, 1.1, 1, 1, 9, 1), level(15, 1.0, 2, 1, 10, 1), level(18, 0.9, 2, 1, 10, 2), level(20, 0.8, 3, 1, 11, 2)],
    evolve: { passive: 'haste', into: 'arrowStorm' },
  },
  boomerangAxe: {
    name: 'Топор-бумеранг', description: 'Летит вперёд и возвращается, прошивая всех', behavior: 'axe', element: 'bone',
    levels: [level(15, 2.0, 1, 1, 9, 99), level(20, 1.9, 1, 1, 9, 99), level(24, 1.7, 2, 1.1, 10, 99), level(30, 1.6, 2, 1.2, 10, 99), level(35, 1.4, 3, 1.3, 11, 99)],
    evolve: { passive: 'amount', into: 'axeWhirl' },
  },
  orbitDaggers: {
    name: 'Кружащие кинжалы', description: 'Кинжалы вращаются вокруг тебя, ломаются об врагов и отрастают', behavior: 'orbit', element: 'bone',
    levels: [level(8, 0.3, 2, 2.2, 2.2, 3), level(10, 0.3, 3, 2.4, 2.4, 3), level(12, 0.28, 3, 2.6, 2.6, 4), level(15, 0.26, 4, 2.9, 2.8, 4), level(18, 0.25, 5, 3.2, 3, 5)],
    evolve: { passive: 'area', into: 'sawHalo' },
  },
  plagueAura: {
    name: 'Чумная аура', description: 'Жжёт всех рядом с тобой', behavior: 'aura', element: 'poison',
    levels: [level(4, 0.6, 1, 3.5, 0, 0), level(5, 0.55, 1, 4, 0, 0), level(7, 0.5, 1, 4.5, 0, 0), level(8, 0.45, 1, 5, 0, 0), level(10, 0.4, 1, 5.5, 0, 0)],
    evolve: { passive: 'regen', into: 'bloodAura' },
  },
  runeShield: {
    name: 'Рунический щит', description: 'Заряды поглощают удары', behavior: 'shield', element: 'arcane',
    levels: [level(0, 8, 1, 0, 0, 0), level(0, 7, 1, 0, 0, 0), level(0, 6, 2, 0, 0, 0), level(0, 5, 2, 0, 0, 0), level(0, 4, 3, 0, 0, 0)],
    evolve: { passive: 'vitality', into: 'bastion' },
  },
  chainLightning: {
    name: 'Цепная молния', description: 'Бьёт врага и перескакивает на соседних', behavior: 'chain', element: 'storm',
    levels: [level(20, 2.0, 2, 3, 0, 0), level(24, 1.8, 3, 3, 0, 0), level(28, 1.6, 4, 3.2, 0, 0), level(34, 1.4, 5, 3.4, 0, 0), level(40, 1.2, 6, 3.6, 0, 0)],
    evolve: { passive: 'might', into: 'heavenWrath' },
  },
  arrowStorm: { name: 'Буря стрел', description: 'Рой пробивающих стрел', behavior: 'bolt', element: 'arcane', evolved: true, levels: [level(25, 0.5, 5, 1, 12, 3)] },
  axeWhirl: { name: 'Вихрь топоров', description: 'Шесть топоров разом', behavior: 'axe', element: 'bone', evolved: true, levels: [level(40, 1.0, 6, 1.4, 11, 99)] },
  sawHalo: { name: 'Пила-нимб', description: 'Кольцо из восьми нерушимых клинков', behavior: 'orbit', element: 'bone', evolved: true, levels: [level(25, 0.22, 8, 3.8, 3.4, 0)] },
  bloodAura: { name: 'Кровавая аура', description: 'Жжёт и лечит тебя', behavior: 'aura', element: 'blood', evolved: true, lifesteal: 0.4, levels: [level(15, 0.35, 1, 6.5, 0, 0)] },
  bastion: { name: 'Бастион', description: 'Пять зарядов, взрыв при поломке', behavior: 'shield', element: 'arcane', evolved: true, levels: [level(40, 3, 5, 3, 0, 0)] },
  heavenWrath: { name: 'Гнев небес', description: 'Молния бьёт по десятку целей', behavior: 'chain', element: 'storm', evolved: true, levels: [level(60, 0.9, 10, 4, 0, 0)] },
}

export const SKILL_TUNING = {
  boltRange: 14,
  boltSpread: 0.3,
  boltTurn: 6,
  boltLife: 2.5,
  boltDrop: 0.2,
  axeHeight: 0.35,
  axeRadius: 0.3,
  axeLife: 6,
  axeOut: 0.55,
  axeRoll: 14,
  chainFirstReach: 10,
  orbitHit: 0.35,
  orbitRespawn: 2.5,
  lifestealCap: 10,
  burstRadius: 3,
  firstCast: 0.3,
  orbiterLift: 0.35,
  orbiterSprite: 'dagger',
}

export const SKILL_IDS = Object.keys(SKILLS) as SkillId[]
export const SLOTS_MAX = 6
