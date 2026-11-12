import type { Element } from './elements'

export interface RangedAttackConfig {
  range: number
  windup: number
  recover: number
  cooldown: number
  aggression: number
  damage: number
  projectileSpeed: number
  element: Element
}

export interface MeleeAttackConfig {
  range: number
  windup: number
  lungeSpeed: number
  lungeTime: number
  reach: number
  damage: number
  knockback: number
  recover: number
  cooldown: number
  impact: number
}

interface PainConfig {
  chance: number
  duration: number
}

export interface EnemyConfig {
  name: string
  sprite: string
  hp: number
  speed: number
  radius: number
  height: number
  contactDamage: number
  xp: number
  pain: PainConfig
  lift?: number
  rangedAttack?: RangedAttackConfig
  meleeAttack?: MeleeAttackConfig
}

export const ENEMIES = {
  bat: {
    name: 'Летучая мышь', sprite: 'bat', hp: 5, speed: 3.6, radius: 0.2, height: 0.5, contactDamage: 1, xp: 1, lift: 0.45,
    pain: { chance: 1, duration: 0.15 },
    meleeAttack: { range: 1.6, windup: 0.3, lungeSpeed: 9, lungeTime: 0.14, reach: 0.4, damage: 4, knockback: 0, recover: 0.35, cooldown: 1.2, impact: 0 },
  },
  skeleton: {
    name: 'Скелет-лучник', sprite: 'skeleton', hp: 14, speed: 1.9, radius: 0.25, height: 0.75, contactDamage: 4, xp: 1,
    pain: { chance: 0.8, duration: 0.25 },
    rangedAttack: { range: 14, windup: 0.7, recover: 0.4, cooldown: 3, aggression: 0.3, damage: 5, projectileSpeed: 9, element: 'bone' },
  },
  goblin: {
    name: 'Гоблин-шаман', sprite: 'goblin', hp: 22, speed: 2.1, radius: 0.24, height: 0.6, contactDamage: 5, xp: 2,
    pain: { chance: 0.7, duration: 0.25 },
    rangedAttack: { range: 16, windup: 0.5, recover: 0.3, cooldown: 2.5, aggression: 0.4, damage: 10, projectileSpeed: 6, element: 'fire' },
  },
  ghoul: {
    name: 'Гуль', sprite: 'ghoul', hp: 45, speed: 3.0, radius: 0.3, height: 0.8, contactDamage: 2, xp: 3,
    pain: { chance: 0.5, duration: 0.25 },
    meleeAttack: { range: 1.8, windup: 0.4, lungeSpeed: 7, lungeTime: 0.15, reach: 0.6, damage: 11, knockback: 3, recover: 0.4, cooldown: 1.3, impact: 0 },
  },
  eye: {
    name: 'Око', sprite: 'eye', hp: 140, speed: 1.3, radius: 0.4, height: 0.9, contactDamage: 8, xp: 12, lift: 0.3,
    pain: { chance: 0.3, duration: 0.3 },
    rangedAttack: { range: 18, windup: 0.6, recover: 0.4, cooldown: 2, aggression: 0.6, damage: 15, projectileSpeed: 7, element: 'poison' },
  },
  executioner: {
    name: 'Палач', sprite: 'executioner', hp: 1800, speed: 4.3, radius: 0.45, height: 1.35, contactDamage: 10, xp: 80,
    pain: { chance: 0.04, duration: 0.2 },
    meleeAttack: { range: 3.2, windup: 0.55, lungeSpeed: 11, lungeTime: 0.18, reach: 1.1, damage: 26, knockback: 10, recover: 0.5, cooldown: 1.4, impact: 1 },
  },
  minotaur: {
    name: 'Минотавр', sprite: 'minotaur', hp: 2500, speed: 2.6, radius: 0.55, height: 1.5, contactDamage: 8, xp: 100,
    pain: { chance: 0.05, duration: 0.3 },
    meleeAttack: { range: 3.6, windup: 1.0, lungeSpeed: 9, lungeTime: 0.25, reach: 1.6, damage: 45, knockback: 16, recover: 0.9, cooldown: 2.2, impact: 1.3 },
  },
} satisfies Record<string, EnemyConfig>

export const ENEMY_AI = { directRange: 3, aggressionScale: 4 }

export const ENEMY_TIERS = { heavyXp: 50, eliteHp: 10, eliteXp: 10, eliteScale: 1.5, corpseLife: 6, minAttackDistance: 2, lineOfSightRetry: 0.5, firstAttack: 1, firstAttackSpread: 2 }

export const ENEMY_SHOT = { scale: 1.8, spawnAhead: 0.4, heightFactor: 0.6, aimHeight: 0.45, minDistance: 0.5, lifePadding: 1 }

export const CONTACT = { query: 1.5, reach: 0.08, cooldown: 0.7, eliteMultiplier: 2 }

export const MELEE_BACKSTEP = 0.7
