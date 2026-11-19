import { Body, Position, Velocity } from '../../components'
import { bodyBlocked } from '../../../physics/collision'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const movingQuery = defineQuery([Position, Velocity, Body])

export function movementSystem(world: GameWorld): void {
  const delta = world.time.delta
  for (const entity of movingQuery(world)) {
    const radius = Body.radius[entity]
    const z = Position.z[entity]
    const x = Position.x[entity] + Velocity.x[entity] * delta
    if (bodyBlocked(world.level, x, Position.y[entity], z, radius)) Velocity.x[entity] = 0
    else Position.x[entity] = x
    const y = Position.y[entity] + Velocity.y[entity] * delta
    if (bodyBlocked(world.level, Position.x[entity], y, z, radius)) Velocity.y[entity] = 0
    else Position.y[entity] = y
  }
}
