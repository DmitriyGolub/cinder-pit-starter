import { Not } from 'bitecs'
import { Destroyed, Position, Projectile, Velocity } from '../../components'
import { PLAYER_SHOT } from '../../../config/combat'
import { breakShot, shotBlocked } from '../../../weapons/impact'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const flyingQuery = defineQuery([Projectile, Position, Velocity, Not(Destroyed)])

function surface(world: GameWorld, projectile: number): number {
  const delta = world.time.delta
  const z = Position.z[projectile]
  let free = 0
  let blocked = 1
  for (let step = 0; step < PLAYER_SHOT.surfaceSteps; step++) {
    const middle = (free + blocked) / 2
    const back = (1 - middle) * delta
    if (shotBlocked(world.level, Position.x[projectile] - Velocity.x[projectile] * back, Position.y[projectile] - Velocity.y[projectile] * back, z)) blocked = middle
    else free = middle
  }
  return (1 - free) * delta
}

export function projectileWallSystem(world: GameWorld): void {
  for (const projectile of [...flyingQuery(world)]) {
    const z = Position.z[projectile]
    if (!shotBlocked(world.level, Position.x[projectile], Position.y[projectile], z)) continue
    const back = surface(world, projectile)
    breakShot(world, projectile, Position.x[projectile] - Velocity.x[projectile] * back, Position.y[projectile] - Velocity.y[projectile] * back, z)
  }
}
