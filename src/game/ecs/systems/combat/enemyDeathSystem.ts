import { addComponent, Not, removeComponent } from 'bitecs'
import { Dead, Enemy, Health, Shootable } from '../../components'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const livingEnemyQuery = defineQuery([Enemy, Health, Not(Dead)])

export function enemyDeathSystem(world: GameWorld): void {
  for (const enemy of [...livingEnemyQuery(world)]) {
    if (Health.hp[enemy] > 0) continue
    Health.hp[enemy] = 0
    addComponent(world, enemy, Dead)
    removeComponent(world, enemy, Shootable)
    world.run.kills++
  }
}
