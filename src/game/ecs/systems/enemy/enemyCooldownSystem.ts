import { Not } from 'bitecs'
import { Dead, Enemy } from '../../components'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const livingEnemyQuery = defineQuery([Enemy, Not(Dead)])

export function enemyCooldownSystem(world: GameWorld): void {
  for (const enemy of livingEnemyQuery(world)) Enemy.timer[enemy] = Math.max(0, Enemy.timer[enemy] - world.time.delta)
}
