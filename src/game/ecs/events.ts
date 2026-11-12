import type { OptionalStatusId } from '../config/status'

export interface DamageEvent {
  target: number
  amount: number
  source: number
  knockbackX: number
  knockbackY: number
  status: OptionalStatusId
  damageOverTimeStatus: OptionalStatusId
}

export interface HitNumber {
  x: number
  y: number
  z: number
  amount: number
  style: number
  target: number
}

export interface StatusProc {
  target: number
  x: number
  y: number
  z: number
  icon: string
}

export interface FrameEvents {
  damage: DamageEvent[]
  hits: HitNumber[]
  hurtFrom: number[]
  confirmed: number
  crits: number
  messages: string[]
  hurt: number
  pickup: number
  aura: number
  lightning: number[][]
  procs: StatusProc[]
  impact: number
}

export function createFrameEvents(): FrameEvents {
  return { damage: [], hits: [], hurtFrom: [], confirmed: 0, crits: 0, messages: [], hurt: 0, pickup: 0, aura: 0, lightning: [], procs: [], impact: 0 }
}

export function clearFrameEvents(events: FrameEvents): void {
  events.messages.length = 0
  events.damage.length = 0
  events.hits.length = 0
  events.hurtFrom.length = 0
  events.confirmed = 0
  events.crits = 0
  events.hurt = 0
  events.pickup = 0
  events.aura = 0
  events.lightning.length = 0
  events.procs.length = 0
  events.impact = 0
}
