import { generateLevel } from '../../../arena/generate'
import { Player, Position } from '../../components'
import { ARENA } from '../../../config/arena'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'
import { runNextFrame } from '../schedule'
import { pathfieldSystem } from './pathfieldSystem'

const playerQuery = defineQuery([Player, Position])
const positionQuery = defineQuery([Position])

function shiftFor(position: number): number {
  const away = position - ARENA.size / 2
  return Math.abs(away) > ARENA.recenter ? Math.sign(away) * ARENA.shift : 0
}

export function arenaSystem(world: GameWorld): void {
  for (const player of playerQuery(world)) {
    const shiftX = shiftFor(Position.x[player])
    const shiftY = shiftFor(Position.y[player])
    if (shiftX === 0 && shiftY === 0) continue
    for (const entity of positionQuery(world)) {
      Position.x[entity] -= shiftX
      Position.y[entity] -= shiftY
    }
    generateLevel(world.level, world.level.originX + shiftX, world.level.originY + shiftY)
    runNextFrame(world, pathfieldSystem)
  }
}
