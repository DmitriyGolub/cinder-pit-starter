import { ENTITIES_MAX } from '../config/engine'

export interface SpatialHash {
  clear(): void
  insert(entity: number, x: number, y: number): void
  near(x: number, y: number, radius: number, visit: (entity: number) => void): void
}

export function createSpatialHash(width: number, height: number): SpatialHash {
  const head = new Int32Array(width * height).fill(-1)
  const next = new Int32Array(ENTITIES_MAX)
  return {
    clear() {
      head.fill(-1)
    },
    insert(entity, x, y) {
      const cellX = Math.floor(x)
      const cellY = Math.floor(y)
      if (cellX < 0 || cellY < 0 || cellX >= width || cellY >= height) return
      const cell = cellY * width + cellX
      next[entity] = head[cell]
      head[cell] = entity
    },
    near(x, y, radius, visit) {
      const left = Math.max(0, Math.floor(x - radius))
      const right = Math.min(width - 1, Math.floor(x + radius))
      const top = Math.max(0, Math.floor(y - radius))
      const bottom = Math.min(height - 1, Math.floor(y + radius))
      for (let cellY = top; cellY <= bottom; cellY++) {
        for (let cellX = left; cellX <= right; cellX++) {
          for (let entity = head[cellY * width + cellX]; entity !== -1; entity = next[entity]) visit(entity)
        }
      }
    },
  }
}
