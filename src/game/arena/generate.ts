import { ARENA, ARENA_NOISE, ARENA_SHIFT } from '../config/arena'
import { BIOME_NOISE } from '../config/biomes'
import { valueNoise } from '../math/noise'
import type { Level } from './Level'

const FLOOR_TILE = { plain: 0, worn: 1, rich: 2 }
const BIOME_SPLIT = 0.5

type Shift = readonly [number, number]

const noiseAt = (level: Level, x: number, y: number, scale: number, [shiftX, shiftY]: Shift = [0, 0]) =>
  valueNoise(level.seed, (x + shiftX) * scale, (y + shiftY) * scale)

function isRock(level: Level, x: number, y: number): boolean {
  if (x * x + y * y <= ARENA_NOISE.clearRadiusSquared) return false
  const base = noiseAt(level, x, y, ARENA_NOISE.rock)
  const detail = noiseAt(level, x, y, ARENA_NOISE.rockDetail, ARENA_SHIFT.detail)
  return base + (detail - base) * ARENA_NOISE.rockDetailWeight > ARENA_NOISE.rockThreshold
}

function heightLevel(level: Level, x: number, y: number): number {
  const noise = noiseAt(level, x, y, ARENA_NOISE.height, ARENA_SHIFT.height)
  const spread = Math.min(1, Math.max(0, (noise - ARENA_NOISE.heightBias) / (1 - 2 * ARENA_NOISE.heightBias)))
  return Math.min(ARENA_NOISE.heightLevels, Math.floor(spread * (ARENA_NOISE.heightLevels + 1)))
}

function biome(level: Level, x: number, y: number): number {
  const first = valueNoise(level.seed, x * BIOME_NOISE.scale + BIOME_NOISE.offsetA, y * BIOME_NOISE.scale + BIOME_NOISE.offsetA)
  const second = valueNoise(level.seed, x * BIOME_NOISE.scale + BIOME_NOISE.offsetB, y * BIOME_NOISE.scale + BIOME_NOISE.offsetB)
  return (first > BIOME_SPLIT ? 1 : 0) + (second > BIOME_SPLIT ? 2 : 0)
}

function floorTile(level: Level, x: number, y: number): number {
  const noise = noiseAt(level, x, y, ARENA_NOISE.variant, ARENA_SHIFT.floor)
  if (noise < ARENA_NOISE.floorVariant) return FLOOR_TILE.worn
  return noise > 1 - ARENA_NOISE.floorVariant ? FLOOR_TILE.rich : FLOOR_TILE.plain
}

function light(level: Level, x: number, y: number): number {
  const noise = noiseAt(level, x, y, ARENA_NOISE.light, ARENA_SHIFT.light)
  return Math.max(ARENA_NOISE.lightMin, ARENA_NOISE.lightBase + (noise * 2 - 1) * ARENA_NOISE.lightRange)
}

export function generateLevel(level: Level, originX: number, originY: number): void {
  level.originX = originX
  level.originY = originY
  for (let cellY = 0; cellY < ARENA.size; cellY++) {
    for (let cellX = 0; cellX < ARENA.size; cellX++) {
      const cell = cellY * ARENA.size + cellX
      const x = originX + cellX
      const y = originY + cellY
      const rock = isRock(level, x, y)
      level.wall[cell] = rock ? 1 : 0
      level.floor[cell] = rock ? 0 : heightLevel(level, x, y)
      level.tile[cell] = rock ? Number(noiseAt(level, x, y, ARENA_NOISE.variant, ARENA_SHIFT.wall) > ARENA_NOISE.variantBias) : floorTile(level, x, y)
      level.biome[cell] = biome(level, x, y)
      level.light[cell] = light(level, x, y)
    }
  }
  level.version++
}
