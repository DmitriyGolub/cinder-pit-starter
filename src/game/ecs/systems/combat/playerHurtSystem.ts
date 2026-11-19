import { hasComponent } from 'bitecs'
import { Player, Position } from '../../components'
import { PLAYER } from '../../../config/player'
import type { DamageEvent } from '../../events'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const playerQuery = defineQuery([Player])

function hurt(world: GameWorld, event: DamageEvent): void {
  const { target, source } = event
  if (Player.invulnerabilityTime[target] > 0) {
    event.amount = 0
    return
  }
  Player.invulnerabilityTime[target] = PLAYER.invulnerabilityTime
  world.events.hurt += event.amount
  world.events.hurtFrom.push(Math.atan2(Position.y[source] - Position.y[target], Position.x[source] - Position.x[target]))
}

export function playerHurtSystem(world: GameWorld): void {
  for (const player of playerQuery(world)) Player.invulnerabilityTime[player] = Math.max(0, Player.invulnerabilityTime[player] - world.time.delta)
  for (const event of world.events.damage) {
    if (event.amount > 0 && hasComponent(world, event.target, Player)) hurt(world, event)
  }
  if (world.events.hurt > 0) world.hud.flashHurt()
}
