import { hasComponent } from 'bitecs'
import { Body, Dead, Enemy, Position } from '../../components'
import { KNOCKBACK, PROJECTILE } from '../../../config/combat'
import { NO_STATUS } from '../../../config/status'
import { spawnEffect } from '../../../entities/effect'
import type { ImpactEvent } from '../../events'
import type { GameWorld } from '../../world'

function splash(world: GameWorld, impact: ImpactEvent): void {
  world.hash.near(impact.x, impact.y, impact.splash + 1, (enemy) => {
    if (!hasComponent(world, enemy, Enemy) || hasComponent(world, enemy, Dead)) return
    const deltaX = Position.x[enemy] - impact.x
    const deltaY = Position.y[enemy] - impact.y
    const distance = Math.hypot(deltaX, deltaY)
    if (distance - Body.radius[enemy] > impact.splash) return
    const push = KNOCKBACK.splash / Math.max(distance, PROJECTILE.radius)
    world.events.damage.push({
      target: enemy,
      amount: impact.damage * PROJECTILE.splashFactor,
      source: impact.source,
      knockbackX: deltaX * push,
      knockbackY: deltaY * push,
      status: NO_STATUS,
      damageOverTimeStatus: NO_STATUS,
    })
  })
}

export function impactSystem(world: GameWorld): void {
  for (const impact of world.events.impacts) {
    spawnEffect(world, impact.effect, impact.x, impact.y, impact.z)
    if (impact.splash > 0) splash(world, impact)
  }
}
