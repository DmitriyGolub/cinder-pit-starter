import { hasComponent, Not } from 'bitecs'
import { Body, Dead, Destroyed, Enemy, PlayerShot, Position, Projectile, Velocity } from '../../components'
import { CRIT, KNOCKBACK, PROJECTILE } from '../../../config/combat'
import { NO_STATUS } from '../../../config/status'
import { NUMBER_STYLE } from '../../../config/view'
import { breakShot } from '../../../weapons/impact'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const shotQuery = defineQuery([Projectile, PlayerShot, Position, Velocity, Not(Destroyed)])
const MISS = -1

function entry(world: GameWorld, projectile: number, enemy: number): number {
  const z = Position.z[projectile]
  if (z < Position.z[enemy] - PROJECTILE.hitBelow || z > Position.z[enemy] + Body.height[enemy] + PROJECTILE.hitAbove) return MISS
  const stepX = Velocity.x[projectile] * world.time.delta
  const stepY = Velocity.y[projectile] * world.time.delta
  const startX = Position.x[projectile] - stepX - Position.x[enemy]
  const startY = Position.y[projectile] - stepY - Position.y[enemy]
  const reach = PROJECTILE.radius + Body.radius[enemy]
  const a = stepX * stepX + stepY * stepY
  const b = startX * stepX + startY * stepY
  const c = startX * startX + startY * startY - reach * reach
  if (c <= 0) return 0
  const discriminant = b * b - a * c
  if (a === 0 || discriminant < 0) return MISS
  const time = (-b - Math.sqrt(discriminant)) / a
  return time >= 0 && time <= 1 ? time : MISS
}

function strike(world: GameWorld, projectile: number, enemy: number): void {
  const crit = world.random() < CRIT.chance
  const amount = Projectile.damage[projectile] * (crit ? CRIT.multiplier : 1)
  const speed = Math.hypot(Velocity.x[projectile], Velocity.y[projectile])
  const { events } = world
  events.damage.push({
    target: enemy,
    amount,
    source: Projectile.source[projectile],
    knockbackX: Velocity.x[projectile] / speed * KNOCKBACK.hit,
    knockbackY: Velocity.y[projectile] / speed * KNOCKBACK.hit,
    status: NO_STATUS,
    damageOverTimeStatus: NO_STATUS,
  })
  events.hits.push({ x: Position.x[enemy], y: Position.y[enemy], z: Position.z[enemy] + Body.height[enemy], amount: Math.round(amount), style: crit ? NUMBER_STYLE.crit : NUMBER_STYLE.normal, target: enemy })
  events.confirmed++
  if (crit) events.crits++
  Projectile.lastHit[projectile] = enemy
  Projectile.pierce[projectile]--
}

function firstHit(world: GameWorld, projectile: number): [number, number] {
  let hit = MISS
  let hitTime = Infinity
  world.hash.near(Position.x[projectile], Position.y[projectile], PROJECTILE.radius + Math.hypot(Velocity.x[projectile], Velocity.y[projectile]) * world.time.delta + 1, (enemy) => {
    if (enemy === Projectile.lastHit[projectile] || !hasComponent(world, enemy, Enemy) || hasComponent(world, enemy, Dead)) return
    const time = entry(world, projectile, enemy)
    if (time === MISS || time >= hitTime) return
    hit = enemy
    hitTime = time
  })
  return [hit, hitTime]
}

export function playerShotHitSystem(world: GameWorld): void {
  for (const projectile of [...shotQuery(world)]) {
    const [enemy, time] = firstHit(world, projectile)
    if (enemy === MISS) continue
    strike(world, projectile, enemy)
    if (Projectile.pierce[projectile] > 0) continue
    const back = (1 - time) * world.time.delta
    breakShot(world, projectile, Position.x[projectile] - Velocity.x[projectile] * back, Position.y[projectile] - Velocity.y[projectile] * back, Position.z[projectile])
  }
}
