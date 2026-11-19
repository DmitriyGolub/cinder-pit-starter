import { Not } from 'bitecs'
import { isReachable } from '../../../arena/Level'
import { Dead, Enemy, Position } from '../../components'
import { destroyEntity, type GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const livingEnemyQuery = defineQuery([Enemy, Position, Not(Dead)])

export function despawnSystem(world: GameWorld): void {
  for (const enemy of livingEnemyQuery(world)) {
    if (!isReachable(world.level, Position.x[enemy], Position.y[enemy])) destroyEntity(world, enemy)
  }
}
