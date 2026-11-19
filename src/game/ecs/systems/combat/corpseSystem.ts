import { addComponent, Not } from 'bitecs'
import { Dead, Enemy, Knockback, Lifetime, Sprite, Velocity } from '../../components'
import { ENEMY_TIERS } from '../../../config/enemies'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const freshCorpseQuery = defineQuery([Enemy, Dead, Sprite, Velocity, Not(Lifetime)])

export function corpseSystem(world: GameWorld): void {
  for (const corpse of [...freshCorpseQuery(world)]) {
    addComponent(world, corpse, Lifetime)
    Lifetime.left[corpse] = ENEMY_TIERS.corpseLife
    Velocity.x[corpse] = Velocity.y[corpse] = 0
    Knockback.x[corpse] = Knockback.y[corpse] = 0
    Sprite.frame[corpse] = `${Enemy.sprite[corpse]}_dead`
  }
}
