import { Heading, Velocity } from '../../components'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const headingQuery = defineQuery([Heading, Velocity])

export function headingSystem(world: GameWorld): void {
  for (const entity of headingQuery(world)) {
    if (Velocity.x[entity] !== 0 || Velocity.y[entity] !== 0) Heading.yaw[entity] = Math.atan2(Velocity.y[entity], Velocity.x[entity])
  }
}
