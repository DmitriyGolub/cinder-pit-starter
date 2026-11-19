import { Not } from 'bitecs'
import { floorHeight } from '../../../arena/Level'
import { Body, Hover, Position, Velocity } from '../../components'
import { GRAVITY, GROUND_EPSILON } from '../../../config/physics'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const fallingQuery = defineQuery([Position, Velocity, Body, Not(Hover)])

export function gravitySystem(world: GameWorld): void {
  const delta = world.time.delta
  for (const entity of fallingQuery(world)) {
    Velocity.z[entity] -= GRAVITY * delta
    Position.z[entity] += Velocity.z[entity] * delta
    const ground = floorHeight(world.level, Position.x[entity], Position.y[entity])
    if (Position.z[entity] > ground + GROUND_EPSILON) continue
    Position.z[entity] = ground
    Velocity.z[entity] = 0
  }
}
