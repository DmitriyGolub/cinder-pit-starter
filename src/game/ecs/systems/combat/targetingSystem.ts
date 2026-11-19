import { Not } from 'bitecs'
import { Dead, Enemy, NO_TARGET, Player, Position, Target } from '../../components'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const hunterQuery = defineQuery([Enemy, Target, Position, Not(Dead)])
const preyQuery = defineQuery([Player, Position, Not(Dead)])

export function targetingSystem(world: GameWorld): void {
  for (const hunter of hunterQuery(world)) {
    let closest = NO_TARGET
    let closestDistance = Infinity
    for (const prey of preyQuery(world)) {
      const distance = Math.hypot(Position.x[prey] - Position.x[hunter], Position.y[prey] - Position.y[hunter])
      if (distance >= closestDistance) continue
      closest = prey
      closestDistance = distance
    }
    Target.entity[hunter] = closest
  }
}
