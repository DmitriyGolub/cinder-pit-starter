import { BufferGeometry, DoubleSide, Float32BufferAttribute, Group, Mesh, MeshBasicMaterial } from 'three'
import { cellHeight, type Level } from '../../../game/arena/Level'
import { ARENA } from '../../../game/config/arena'
import { biomeTexture } from '../../../game/config/biomes'
import { LEVEL_VIEW } from '../../../game/config/view'
import { getTexture } from '../../assets'

interface Batch {
  positions: number[]
  uvs: number[]
  colors: number[]
}

interface Edge {
  fromX: number
  fromY: number
  toX: number
  toY: number
}

const SIDES = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const
const WALL_TILES = ['wall0', 'wall1'] as const
const FLOOR_TILES = ['floor0', 'floor1', 'floor2'] as const

function pushVertex(batch: Batch, x: number, y: number, z: number, u: number, v: number, light: number): void {
  batch.positions.push(x, z, y)
  batch.uvs.push(u, v)
  batch.colors.push(light, light, light)
}

function pushFloor(batch: Batch, x: number, y: number, z: number, light: number): void {
  const corners = [[x, y], [x + 1, y], [x + 1, y + 1], [x, y], [x + 1, y + 1], [x, y + 1]]
  for (const [cornerX, cornerY] of corners) pushVertex(batch, cornerX, cornerY, z, cornerX, cornerY, light)
}

function pushSide(batch: Batch, edge: Edge, bottom: number, top: number, light: number): void {
  const corners = [[0, bottom], [1, bottom], [1, top], [0, bottom], [1, top], [0, top]]
  for (const [along, z] of corners) {
    pushVertex(batch, edge.fromX + (edge.toX - edge.fromX) * along, edge.fromY + (edge.toY - edge.fromY) * along, z, along, z, light)
  }
}

function edgeOf(x: number, y: number, sideX: number, sideY: number): Edge {
  if (sideX !== 0) {
    const edgeX = x + (sideX > 0 ? 1 : 0)
    return { fromX: edgeX, fromY: y, toX: edgeX, toY: y + 1 }
  }
  const edgeY = y + (sideY > 0 ? 1 : 0)
  return { fromX: x, fromY: edgeY, toX: x + 1, toY: edgeY }
}

function neighbor(x: number, y: number, sideX: number, sideY: number): number {
  const nextX = x + sideX
  const nextY = y + sideY
  if (nextX < 0 || nextY < 0 || nextX >= ARENA.size || nextY >= ARENA.size) return -1
  return nextY * ARENA.size + nextX
}

function collect(level: Level): Map<string, Batch> {
  const batches = new Map<string, Batch>()
  const batchOf = (texture: string) => {
    let batch = batches.get(texture)
    if (!batch) batches.set(texture, batch = { positions: [], uvs: [], colors: [] })
    return batch
  }
  for (let y = 0; y < ARENA.size; y++) {
    for (let x = 0; x < ARENA.size; x++) {
      const cell = y * ARENA.size + x
      const biome = level.biome[cell]
      const wall = level.wall[cell] === 1
      const height = cellHeight(level, cell)
      if (!wall) pushFloor(batchOf(biomeTexture(biome, FLOOR_TILES[level.tile[cell]])), x, y, height, level.light[cell])
      for (const [sideX, sideY] of SIDES) {
        const next = neighbor(x, y, sideX, sideY)
        if (next < 0 || level.wall[next] === 1) continue
        const bottom = cellHeight(level, next)
        if (!wall && bottom >= height) continue
        const light = level.light[next] * (sideX !== 0 ? LEVEL_VIEW.sideShade : 1)
        const texture = biomeTexture(biome, wall ? WALL_TILES[level.tile[cell]] : 'ledge')
        pushSide(batchOf(texture), edgeOf(x, y, sideX, sideY), bottom, wall ? ARENA.wallHeight : height, light)
      }
    }
  }
  return batches
}

export function createLevelMesh() {
  const group = new Group()
  const materials = new Map<string, MeshBasicMaterial>()
  const materialOf = (texture: string) => {
    let material = materials.get(texture)
    if (!material) materials.set(texture, material = new MeshBasicMaterial({ map: getTexture(texture), vertexColors: true, side: DoubleSide }))
    return material
  }
  const clear = () => {
    for (const mesh of group.children as Mesh[]) mesh.geometry.dispose()
    group.clear()
  }

  return {
    group,
    build(level: Level): void {
      clear()
      for (const [texture, batch] of collect(level)) {
        const geometry = new BufferGeometry()
        geometry.setAttribute('position', new Float32BufferAttribute(batch.positions, 3))
        geometry.setAttribute('uv', new Float32BufferAttribute(batch.uvs, 2))
        geometry.setAttribute('color', new Float32BufferAttribute(batch.colors, 3))
        group.add(new Mesh(geometry, materialOf(texture)))
      }
    },
    dispose(): void {
      clear()
      for (const material of materials.values()) material.dispose()
      materials.clear()
    },
  }
}
