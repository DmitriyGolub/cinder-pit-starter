import { isBlocked, type Level } from '../arena/Level'
import { GROUND_EPSILON, STEP_HEIGHT } from '../config/physics'

export function bodyBlocked(level: Level, x: number, y: number, z: number, radius: number): boolean {
  const reach = radius - GROUND_EPSILON
  return isBlocked(level, x - reach, y - reach, z, STEP_HEIGHT) || isBlocked(level, x + reach, y - reach, z, STEP_HEIGHT)
    || isBlocked(level, x - reach, y + reach, z, STEP_HEIGHT) || isBlocked(level, x + reach, y + reach, z, STEP_HEIGHT)
}
