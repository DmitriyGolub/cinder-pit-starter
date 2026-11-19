import { addComponent, addEntity } from 'bitecs'
import { Animation, Directional, Heading, Lifetime, NO_HIT, PlayerShot, Position, Projectile, Velocity } from '../ecs/components'
import { PROJECTILE } from '../config/combat'
import { ELEMENTS, type Element } from '../config/elements'
import type { GameWorld } from '../ecs/world'
import { addSprite } from './sprite'

export interface Shot {
  source: number
  x: number
  y: number
  z: number
  yaw: number
  climb: number
  rise: number
  speed: number
  range: number
  damage: number
  pierce: number
  splash: number
  element: Element
}

export function spawnPlayerShot(world: GameWorld, shot: Shot): number {
  const element = ELEMENTS[shot.element]
  const projectile = addEntity(world)
  for (const component of [Position, Velocity, Projectile, PlayerShot, Heading, Directional, Animation, Lifetime]) addComponent(world, projectile, component)
  addSprite(world, projectile, { frame: `${element.sprite}_front`, tint: element.tint, bright: true })
  Position.x[projectile] = shot.x
  Position.y[projectile] = shot.y
  Position.z[projectile] = shot.z
  Velocity.x[projectile] = Math.cos(shot.yaw) * shot.speed
  Velocity.y[projectile] = Math.sin(shot.yaw) * shot.speed
  Velocity.z[projectile] = shot.climb
  Heading.yaw[projectile] = shot.yaw
  Projectile.source[projectile] = shot.source
  Projectile.damage[projectile] = shot.damage
  Projectile.pierce[projectile] = shot.pierce
  Projectile.splash[projectile] = shot.splash
  Projectile.rise[projectile] = shot.rise
  Projectile.lastHit[projectile] = NO_HIT
  Projectile.hit[projectile] = element.hit
  Directional.sprite[projectile] = element.sprite
  Animation.base[projectile] = `${element.sprite}_front`
  Animation.frames[projectile] = element.frames
  Animation.fps[projectile] = PROJECTILE.fps
  Animation.start[projectile] = world.time.elapsed
  Animation.loop[projectile] = 1
  Lifetime.left[projectile] = Math.min(PROJECTILE.life, shot.range / shot.speed)
  return projectile
}
