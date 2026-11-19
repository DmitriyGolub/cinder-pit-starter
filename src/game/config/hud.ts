import type { StatName } from './stats'

export const HUD_BUFFS: StatName[] = ['might', 'area', 'haste', 'amount', 'speed', 'luck']

export const HUD_VIEW = { hpSegment: 25, buffEpsilon: 0.001, lowHp: 0.25 }

export const PLAYER_VIEW_START = { xp: 0, xpNow: 0, xpNext: 1, wave: 1, level: 1, kills: 0, coins: 0, shield: 0, shieldMax: 0, weapon: '', weaponIcon: '', weaponLevel: 1 }
