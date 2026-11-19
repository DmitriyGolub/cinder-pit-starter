import { isBlocked } from '../../../arena/Level'
import { Body, Position, Velocity } from '../../components'
import { GROUND_EPSILON, STEP_HEIGHT } from '../../../config/physics'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const movingQuery = defineQuery([Position, Velocity, Body])

function blockedAlongX(world: GameWorld, entity: number, x: number): boolean {
  const edge = x + Math.sign(Velocity.x[entity]) * Body.radius[entity]
  const side = Body.radius[entity] - GROUND_EPSILON
  const y = Position.y[entity]
  const z = Position.z[entity]
  return isBlocked(world.level, edge, y - side, z, STEP_HEIGHT) || isBlocked(world.level, edge, y + side, z, STEP_HEIGHT)
}

function blockedAlongY(world: GameWorld, entity: number, y: number): boolean {
  const edge = y + Math.sign(Velocity.y[entity]) * Body.radius[entity]
  const side = Body.radius[entity] - GROUND_EPSILON
  const x = Position.x[entity]
  const z = Position.z[entity]
  return isBlocked(world.level, x - side, edge, z, STEP_HEIGHT) || isBlocked(world.level, x + side, edge, z, STEP_HEIGHT)
}

export function movementSystem(world: GameWorld): void {
  const delta = world.time.delta
  for (const entity of movingQuery(world)) {
    const x = Position.x[entity] + Velocity.x[entity] * delta
    if (blockedAlongX(world, entity, x)) Velocity.x[entity] = 0
    else Position.x[entity] = x
    const y = Position.y[entity] + Velocity.y[entity] * delta
    if (blockedAlongY(world, entity, y)) Velocity.y[entity] = 0
    else Position.y[entity] = y
  }
}
