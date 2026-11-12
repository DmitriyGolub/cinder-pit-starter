import { PLAYER } from '../game/config/player'
import { DEFAULT_HERO } from '../game/config/heroes'
import type { HudPort, LoadoutView, PlayerView, SlotView } from '../game/ecs/ports'
import type { RunMode } from '../game/ecs/world'

export type { SlotView }

export type Phase = 'menu' | 'playing' | 'paused'

export interface HudState extends PlayerView, LoadoutView {
  phase: Phase
  mode: RunMode
  won: boolean
  bank: number
  hero: string
  meta: Record<string, number>
  message: string
  messageId: number
  hurtTick: number
  pickupTick: number
}

export interface HudStore {
  get(): HudState
  set(patch: Partial<HudState>): void
  subscribe(listener: () => void): () => void
}

const INITIAL_STATE: HudState = {
  phase: 'menu', mode: 'run', hp: PLAYER.healthMax, healthMax: PLAYER.healthMax, xp: 0, xpNow: 0, xpNext: 1, wave: 1, buffs: [], level: 1, time: 0, kills: 0,
  coins: 0, shield: 0, shieldMax: 0, weapon: '', weaponIcon: '', weaponLevel: 1, skills: [], passives: [], won: false, bank: 0,
  hero: DEFAULT_HERO, meta: {}, message: '', messageId: 0, hurtTick: 0, pickupTick: 0,
}

export function createHudStore(): HudStore {
  let state = INITIAL_STATE
  const listeners = new Set<() => void>()
  return {
    get: () => state,
    set(patch) {
      const keys = Object.keys(patch) as (keyof HudState)[]
      if (keys.every((key) => state[key] === patch[key])) return
      state = { ...state, ...patch }
      listeners.forEach((listener) => listener())
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

export function createHudPort(store: HudStore): HudPort {
  return {
    showPlayer: (view) => store.set(view),
    showLoadout: (view) => store.set(view),
    message: (text) => store.set({ message: text, messageId: store.get().messageId + 1 }),
    flashHurt: () => store.set({ hurtTick: store.get().hurtTick + 1 }),
    flashPickup: () => store.set({ pickupTick: store.get().pickupTick + 1 }),
  }
}
