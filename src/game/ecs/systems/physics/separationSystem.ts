import { hasComponent } from 'bitecs'
import { Body, Player, Position, Shootable } from '../../components'
import { SEPARATION } from '../../../config/physics'
import { bodyBlocked } from '../../../physics/collision'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const crowdQuery = defineQuery([Shootable, Position, Body])

function push(world: GameWorld, entity: number, deltaX: number, deltaY: number): void {
  const radius = Body.radius[entity]
  const z = Position.z[entity]
  const x = Position.x[entity] + deltaX
  if (!bodyBlocked(world.level, x, Position.y[entity], z, radius)) Position.x[entity] = x
  const y = Position.y[entity] + deltaY
  if (!bodyBlocked(world.level, Position.x[entity], y, z, radius)) Position.y[entity] = y
}

function share(world: GameWorld, entity: number, other: number): number {
  if (hasComponent(world, entity, Player)) return 0
  return hasComponent(world, other, Player) ? 1 : SEPARATION.share
}

function separate(world: GameWorld, entity: number, other: number): void {
  const deltaX = Position.x[other] - Position.x[entity]
  const deltaY = Position.y[other] - Position.y[entity]
  const distance = Math.hypot(deltaX, deltaY)
  const overlap = Body.radius[entity] + Body.radius[other] - distance
  if (overlap <= 0) return
  const normalX = distance > SEPARATION.epsilon ? deltaX / distance : 1
  const normalY = distance > SEPARATION.epsilon ? deltaY / distance : 0
  const entityShare = share(world, entity, other)
  push(world, entity, -normalX * overlap * entityShare, -normalY * overlap * entityShare)
  push(world, other, normalX * overlap * (1 - entityShare), normalY * overlap * (1 - entityShare))
}

export function separationSystem(world: GameWorld): void {
  for (const entity of crowdQuery(world)) {
    world.hash.near(Position.x[entity], Position.y[entity], Body.radius[entity] + SEPARATION.query, (other) => {
      if (other > entity && hasComponent(world, other, Shootable)) separate(world, entity, other)
    })
  }
}
