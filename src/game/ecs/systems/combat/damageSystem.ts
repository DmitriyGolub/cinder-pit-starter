import { addComponent, hasComponent, removeComponent } from 'bitecs'
import { Dead, Enemy, Health, Knockback, Lifetime, Player, Shootable, Velocity } from '../../components'
import { ENEMY_TIERS } from '../../../config/enemies'
import { MESSAGES } from '../../../config/messages'
import type { DamageEvent } from '../../events'
import type { GameWorld } from '../../world'

function kill(world: GameWorld, target: number): void {
  Health.hp[target] = 0
  addComponent(world, target, Dead)
  if (hasComponent(world, target, Enemy)) {
    removeComponent(world, target, Shootable)
    addComponent(world, target, Lifetime)
    Lifetime.left[target] = ENEMY_TIERS.corpseLife
    Velocity.x[target] = Velocity.y[target] = 0
  }
  if (hasComponent(world, target, Player)) {
    world.status = 'dead'
    world.hud.message(MESSAGES.death)
  }
}

function apply(world: GameWorld, event: DamageEvent): void {
  const { target } = event
  if (event.amount <= 0 || !hasComponent(world, target, Health) || hasComponent(world, target, Dead)) return
  Health.hp[target] -= event.amount
  if (hasComponent(world, target, Knockback)) {
    Knockback.x[target] += event.knockbackX
    Knockback.y[target] += event.knockbackY
  }
  if (Health.hp[target] <= 0) kill(world, target)
}

export function damageSystem(world: GameWorld): void {
  for (const event of world.events.damage) apply(world, event)
}
