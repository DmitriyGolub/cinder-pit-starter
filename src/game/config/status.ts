import type { Element } from './elements'

export const StatusId = { Burn: 1, Chill: 2, Shock: 3, Poison: 4, Bleed: 5 } as const
export type StatusId = (typeof StatusId)[keyof typeof StatusId]

export const NO_STATUS = 0
export type OptionalStatusId = StatusId | typeof NO_STATUS

interface StatusConfig {
  name: string
  chance: number
  duration: number
  tick: number
  damageOverTime: number
  stacksMax: number
  slow: number
  freezeAt: number
  freeze: number
  vulnerability: number
  tint: number
  icon: string
}

const DEFAULTS: StatusConfig = { name: '', chance: 0, duration: 0, tick: 0, damageOverTime: 0, stacksMax: 1, slow: 0, freezeAt: 0, freeze: 0, vulnerability: 0, tint: 0, icon: '' }

export const STATUS: Record<StatusId, StatusConfig> = {
  [StatusId.Burn]: { ...DEFAULTS, name: 'Горение', chance: 0.4, duration: 3, tick: 0.5, damageOverTime: 0.15, tint: 0xff8a30, icon: 'status_burn' },
  [StatusId.Chill]: { ...DEFAULTS, name: 'Холод', chance: 0.35, duration: 2.5, stacksMax: 4, slow: 0.18, freezeAt: 4, freeze: 1.2, tint: 0x8ad8ff, icon: 'status_chill' },
  [StatusId.Shock]: { ...DEFAULTS, name: 'Шок', chance: 0.3, duration: 2.5, vulnerability: 0.25, tint: 0xfff07a, icon: 'status_shock' },
  [StatusId.Poison]: { ...DEFAULTS, name: 'Яд', chance: 1, duration: 4, tick: 1, damageOverTime: 0.08, stacksMax: 8, tint: 0x8aff6a, icon: 'status_poison' },
  [StatusId.Bleed]: { ...DEFAULTS, name: 'Кровотечение', chance: 0.5, duration: 3, tick: 0.5, damageOverTime: 0.1, stacksMax: 3, tint: 0xff4a5a, icon: 'status_bleed' },
}

export const FROZEN_ICON = 'status_frozen'

export const ELEMENT_STATUS: Record<Element, OptionalStatusId> = {
  arcane: NO_STATUS,
  fire: StatusId.Burn,
  frost: StatusId.Chill,
  storm: StatusId.Shock,
  poison: StatusId.Poison,
  blood: StatusId.Bleed,
  bone: StatusId.Bleed,
}
