import { hasComponent } from 'bitecs'
import { lightAt } from '../../../arena/Level'
import { Dead, Player, Position, Velocity, ViewRig, Weapon } from '../../components'
import { CAMERA, WEAPON_VIEW } from '../../../config/view'
import { PLAYER } from '../../../config/player'
import { WEAPON_RAISE, WEAPONS } from '../../../config/weapons'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const armedPlayerQuery = defineQuery([Player, Weapon, Position, Velocity, ViewRig])

function offsetY(world: GameWorld, player: number, stride: number, phase: number): number {
  if (hasComponent(world, player, Dead)) return WEAPON_VIEW.deadOffset
  const raise = Math.max(0, 1 - world.run.time / WEAPON_RAISE) * WEAPON_VIEW.raiseOffset
  return Math.abs(Math.cos(phase)) * WEAPON_VIEW.swayY * stride + ViewRig.kick[player] + raise
}

export function weaponViewSystem(world: GameWorld): void {
  for (const player of armedPlayerQuery(world)) {
    const weapon = WEAPONS[Weapon.kind[player]]
    ViewRig.kick[player] *= Math.exp(-WEAPON_VIEW.kickDecay * world.time.delta)
    const stride = Math.min(1, Math.hypot(Velocity.x[player], Velocity.y[player]) / PLAYER.speed)
    const phase = ViewRig.bob[player] * CAMERA.bobFrequency / 2
    const firing = Weapon.sinceShot[player] < weapon.cooldown * WEAPON_VIEW.fireFrame
    const light = WEAPON_VIEW.lightBase + WEAPON_VIEW.lightScale * lightAt(world.level, Position.x[player], Position.y[player])
    world.render.setViewModel(`${weapon.view}_${firing ? 'fire' : 'idle'}`, Math.sin(phase) * WEAPON_VIEW.swayX * stride, offsetY(world, player, stride, phase), light)
  }
}
