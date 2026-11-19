import { floorHeight, type Level } from '../arena/Level'
import { Projectile } from '../ecs/components'
import type { EffectName } from '../config/effects'
import { destroyEntity, type GameWorld } from '../ecs/world'

export const shotBlocked = (level: Level, x: number, y: number, z: number) => floorHeight(level, x, y) > z

export function breakShot(world: GameWorld, projectile: number, x: number, y: number, z: number): void {
  world.events.impacts.push({
    x,
    y,
    z,
    effect: Projectile.hit[projectile] as EffectName,
    splash: Projectile.splash[projectile],
    damage: Projectile.damage[projectile],
    source: Projectile.source[projectile],
  })
  destroyEntity(world, projectile)
}
