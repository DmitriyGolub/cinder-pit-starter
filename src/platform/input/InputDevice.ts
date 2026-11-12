import type { InputPort } from '../../game/ecs/ports'

export interface InputDevice extends InputPort {
  locked: boolean
  onLockChange: ((locked: boolean) => void) | null
  wasPressed(code: string): boolean
  requestLock(): void
  exitLock(): void
  endFrame(): void
  dispose(): void
}
