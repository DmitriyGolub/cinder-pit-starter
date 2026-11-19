import { Position, Projectile, Velocity } from '../../components'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const flyingQuery = defineQuery([Projectile, Position, Velocity])

export function projectileMoveSystem(world: GameWorld): void {
  const delta = world.time.delta
  for (const projectile of flyingQuery(world)) {
    const climbTime = Math.min(delta, Math.max(0, Projectile.rise[projectile]))
    Position.x[projectile] += Velocity.x[projectile] * delta
    Position.y[projectile] += Velocity.y[projectile] * delta
    Position.z[projectile] += Velocity.z[projectile] * climbTime
    Projectile.rise[projectile] -= delta
    if (Projectile.rise[projectile] <= 0) Velocity.z[projectile] = 0
  }
}
