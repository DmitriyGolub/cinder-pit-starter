import type { Level } from '../arena/Level'
import type { HitNumber, StatusProc } from './events'

export interface CameraView {
  x: number
  y: number
  rightX: number
  rightY: number
  halfHorizontalFov: number
}

export interface SpriteDrawer {
  begin(): void
  add(frame: string, x: number, y: number, z: number, scale: number, light: number, tint: number, flip: boolean, squash: number, rotation: number): void
  end(): void
  has(frame: string): boolean
}

export interface Indicator {
  angle: number
  alpha: number
  elite: boolean
}

export interface OverlayFrame {
  delta: number
  facing: number
  indicators: Indicator[]
}

export interface OverlayDrawer {
  addNumber(hit: HitNumber): void
  addHurt(worldAngle: number): void
  addLightning(points: number[]): void
  addProc(proc: StatusProc): void
  addConfirm(crit: boolean): void
  draw(frame: OverlayFrame): void
}

export interface RenderPort {
  readonly view: Readonly<CameraView>
  readonly sprites: SpriteDrawer
  readonly overlay: OverlayDrawer
  setCamera(x: number, y: number, height: number, yaw: number): void
  setFog(red: number, green: number, blue: number): void
  showLevel(level: Level): void
  setViewModel(frame: string, offsetX: number, offsetY: number, light: number): void
}

export interface InputPort {
  readonly moveX: number
  readonly moveY: number
  readonly turn: number
  readonly lookX: number
  readonly fire: boolean
  readonly walk: boolean
}

export interface SlotView {
  name: string
  level: number
  max: number
  evolved: boolean
  icon: string
}

export interface BuffView {
  icon: string
  text: string
}

export interface PlayerView {
  hp: number
  healthMax: number
  xp: number
  xpNow: number
  xpNext: number
  wave: number
  level: number
  time: number
  kills: number
  coins: number
  shield: number
  shieldMax: number
  weapon: string
  weaponIcon: string
  weaponLevel: number
}

export interface LoadoutView {
  skills: SlotView[]
  passives: SlotView[]
  buffs: BuffView[]
}

export interface HudPort {
  showPlayer(view: PlayerView): void
  showLoadout(view: LoadoutView): void
  message(text: string): void
  flashHurt(): void
  flashPickup(): void
}
