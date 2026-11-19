import { addComponent, hasComponent } from 'bitecs'
import { Dead, Health, Knockback, Player } from '../../components'
import { MESSAGES } from '../../../config/messages'
import type { DamageEvent } from '../../events'
import type { GameWorld } from '../../world'

function killPlayer(world: GameWorld, player: number): void {
  Health.hp[player] = 0
  addComponent(world, player, Dead)
  world.status = 'dead'
  world.hud.message(MESSAGES.death)
}

function apply(world: GameWorld, event: DamageEvent): void {
  const { target } = event
  if (event.amount <= 0 || !hasComponent(world, target, Health) || hasComponent(world, target, Dead)) return
  Health.hp[target] -= event.amount
  if (hasComponent(world, target, Knockback)) {
    Knockback.x[target] += event.knockbackX
    Knockback.y[target] += event.knockbackY
  }
  if (Health.hp[target] <= 0 && hasComponent(world, target, Player)) killPlayer(world, target)
}

export function damageSystem(world: GameWorld): void {
  for (const event of world.events.damage) apply(world, event)
}
