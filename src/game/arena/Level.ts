import { ARENA, ARENA_NOISE, LEVEL_LIGHT } from '../config/arena'

export const NO_PATH = 0xffff

export const OUTSIDE = -1

export interface Level {
  seed: number
  originX: number
  originY: number
  version: number
  shown: number
  wall: Uint8Array
  floor: Uint8Array
  biome: Uint8Array
  tile: Uint8Array
  light: Float32Array
  path: Uint16Array
  queue: Int32Array
}

export function createLevel(seed: number): Level {
  const cells = ARENA.size * ARENA.size
  return {
    seed,
    originX: 0,
    originY: 0,
    version: 0,
    shown: 0,
    wall: new Uint8Array(cells),
    floor: new Uint8Array(cells),
    biome: new Uint8Array(cells),
    tile: new Uint8Array(cells),
    light: new Float32Array(cells),
    path: new Uint16Array(cells).fill(NO_PATH),
    queue: new Int32Array(cells),
  }
}

export function cellAt(x: number, y: number): number {
  const cellX = Math.floor(x)
  const cellY = Math.floor(y)
  if (cellX < 0 || cellY < 0 || cellX >= ARENA.size || cellY >= ARENA.size) return OUTSIDE
  return cellY * ARENA.size + cellX
}

export const cellHeight = (level: Level, cell: number) => level.floor[cell] * ARENA_NOISE.heightStep

export function isBlocked(level: Level, x: number, y: number, z: number, stepHeight: number): boolean {
  const cell = cellAt(x, y)
  return cell === OUTSIDE || level.wall[cell] === 1 || cellHeight(level, cell) - z > stepHeight
}

export function floorHeight(level: Level, x: number, y: number): number {
  const cell = cellAt(x, y)
  if (cell === OUTSIDE || level.wall[cell] === 1) return ARENA.wallHeight
  return cellHeight(level, cell)
}

export function biomeAt(level: Level, x: number, y: number): number {
  const last = ARENA.size - 1
  return level.biome[cellAt(Math.min(last, Math.max(0, x)), Math.min(last, Math.max(0, y)))]
}

export function lightAt(level: Level, x: number, y: number): number {
  const cell = cellAt(x, y)
  return cell === OUTSIDE ? LEVEL_LIGHT.outside : level.light[cell]
}

export function isReachable(level: Level, x: number, y: number): boolean {
  const cell = cellAt(x, y)
  return cell !== OUTSIDE && level.path[cell] !== NO_PATH
}
