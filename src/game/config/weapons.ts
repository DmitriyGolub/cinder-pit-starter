import type { Element } from './elements'

export type WeaponId = 'wand' | 'crossbow' | 'staff' | 'firestaff'

export interface WeaponConfig {
  name: string
  view: string
  pickup: string
  element: Element
  pellets: number
  spread: number
  damage: number
  cooldown: number
  speed: number
  range: number
  pierce: number
  splash: number
  muzzle: number
  upgrades: WeaponUpgrade[]
}

interface WeaponUpgrade {
  stat: 'damage' | 'cooldown' | 'pierce' | 'pellets' | 'splash'
  amount: number
}

const DAMAGE_UPGRADE: WeaponUpgrade = { stat: 'damage', amount: 0.25 }
const COOLDOWN_UPGRADE: WeaponUpgrade = { stat: 'cooldown', amount: 0.15 }
const PIERCE_UPGRADE: WeaponUpgrade = { stat: 'pierce', amount: 1 }
const PELLET_UPGRADE: WeaponUpgrade = { stat: 'pellets', amount: 1 }
const VOLLEY_UPGRADE: WeaponUpgrade = { stat: 'pellets', amount: 2 }
const SPLASH_UPGRADE: WeaponUpgrade = { stat: 'splash', amount: 0.3 }

export const WEAPONS: Record<WeaponId, WeaponConfig> = {
  wand: { name: 'Жезл', view: 'wand', pickup: 'wand_idle', element: 'arcane', pellets: 1, spread: 0.01, damage: 10, cooldown: 0.35, speed: 22, range: 30, pierce: 1, splash: 0, muzzle: -0.2, upgrades: [DAMAGE_UPGRADE, PELLET_UPGRADE, COOLDOWN_UPGRADE, PIERCE_UPGRADE, PELLET_UPGRADE] },
  crossbow: { name: 'Ледяной арбалет', view: 'crossbow', pickup: 'crossbow', element: 'frost', pellets: 5, spread: 0.08, damage: 9, cooldown: 0.85, speed: 26, range: 22, pierce: 1, splash: 0, muzzle: -0.3, upgrades: [VOLLEY_UPGRADE, DAMAGE_UPGRADE, PIERCE_UPGRADE, COOLDOWN_UPGRADE, VOLLEY_UPGRADE] },
  staff: { name: 'Посох-скорострел', view: 'staff', pickup: 'staff', element: 'storm', pellets: 1, spread: 0.035, damage: 7, cooldown: 0.11, speed: 28, range: 26, pierce: 1, splash: 0, muzzle: 0, upgrades: [COOLDOWN_UPGRADE, DAMAGE_UPGRADE, PIERCE_UPGRADE, COOLDOWN_UPGRADE, PELLET_UPGRADE] },
  firestaff: { name: 'Огненный посох', view: 'firestaff', pickup: 'firestaff', element: 'fire', pellets: 1, spread: 0, damage: 28, cooldown: 0.5, speed: 14, range: 30, pierce: 1, splash: 1.3, muzzle: 0, upgrades: [SPLASH_UPGRADE, DAMAGE_UPGRADE, COOLDOWN_UPGRADE, SPLASH_UPGRADE, PELLET_UPGRADE] },
}

export const WEAPON_IDS = Object.keys(WEAPONS) as WeaponId[]
export const STARTING_WEAPON: WeaponId = 'wand'

export const WEAPON_LEVEL_MAX = Math.max(...Object.values(WEAPONS).map((weapon) => weapon.upgrades.length)) + 1

const UPGRADE_TEXT: Record<WeaponUpgrade['stat'], (amount: number) => string> = {
  damage: (amount) => `+${amount * 100}% урона`,
  cooldown: (amount) => `-${amount * 100}% перезарядки`,
  pierce: (amount) => `+${amount} пробитие`,
  pellets: (amount) => `+${amount} снаряд${amount > 1 ? 'а' : ''}`,
  splash: (amount) => `+${amount * 100}% радиуса взрыва`,
}

export const upgradeDescription = (upgrade: WeaponUpgrade) => UPGRADE_TEXT[upgrade.stat](upgrade.amount)

export const WEAPON_RAISE = 0.4
