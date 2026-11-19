import { hasComponent, Not } from 'bitecs'
import { Body, Dead, Enemy, Player, Position } from '../../components'
import { CONTACT } from '../../../config/enemies'
import { NO_STATUS } from '../../../config/status'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const victimQuery = defineQuery([Player, Position, Body, Not(Dead)])

function touches(attacker: number, victim: number): boolean {
  const reach = Body.radius[attacker] + Body.radius[victim] + CONTACT.reach
  const above = Position.z[attacker] < Position.z[victim] + Body.height[victim]
  const below = Position.z[attacker] + Body.height[attacker] > Position.z[victim]
  return above && below && Math.hypot(Position.x[attacker] - Position.x[victim], Position.y[attacker] - Position.y[victim]) <= reach
}

export function contactSystem(world: GameWorld): void {
  for (const victim of victimQuery(world)) {
    world.hash.near(Position.x[victim], Position.y[victim], CONTACT.query, (attacker) => {
      if (!hasComponent(world, attacker, Enemy) || hasComponent(world, attacker, Dead) || Enemy.timer[attacker] > 0 || !touches(attacker, victim)) return
      Enemy.timer[attacker] = CONTACT.cooldown
      world.events.damage.push({ target: victim, amount: Enemy.damage[attacker], source: attacker, knockbackX: 0, knockbackY: 0, status: NO_STATUS, damageOverTimeStatus: NO_STATUS })
    })
  }
}
