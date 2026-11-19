import { Not } from 'bitecs'
import { Dead, Enemy, Player, Position } from '../../components'
import { SPAWN } from '../../../config/spawn'
import { findSpawnPoint, placeEnemy } from '../../../entities/enemy'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const livingPlayerQuery = defineQuery([Player, Position, Not(Dead)])
const livingEnemyQuery = defineQuery([Enemy, Position, Not(Dead)])

export function recycleSystem(world: GameWorld): void {
  for (const player of livingPlayerQuery(world)) {
    const x = Position.x[player]
    const y = Position.y[player]
    for (const enemy of livingEnemyQuery(world)) {
      if (Math.hypot(Position.x[enemy] - x, Position.y[enemy] - y) <= SPAWN.despawn) continue
      const point = findSpawnPoint(world, x, y, SPAWN.ringMin, SPAWN.ringMax)
      if (point) placeEnemy(world, enemy, point.x, point.y)
    }
  }
}
