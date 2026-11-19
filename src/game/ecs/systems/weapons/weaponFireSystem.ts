import { Not } from 'bitecs'
import { Dead, Player, Weapon } from '../../components'
import { fireWeapon } from '../../../weapons/fire'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const armedPlayerQuery = defineQuery([Player, Weapon, Not(Dead)])

export function weaponFireSystem(world: GameWorld): void {
  const delta = world.time.delta
  for (const player of armedPlayerQuery(world)) {
    Weapon.cooldown[player] = Math.max(0, Weapon.cooldown[player] - delta)
    Weapon.sinceShot[player] += delta
    if (world.input.fire && Weapon.cooldown[player] <= 0) fireWeapon(world, player)
  }
}
