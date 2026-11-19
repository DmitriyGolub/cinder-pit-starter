import { Not } from 'bitecs'
import { Dead, Player, Rotation } from '../../components'
import { PLAYER } from '../../../config/player'
import { wrapAngle } from '../../../math/angle'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const lookingPlayerQuery = defineQuery([Player, Rotation, Not(Dead)])

export function playerLookSystem(world: GameWorld): void {
  const turn = world.input.lookX + world.input.turn * PLAYER.turnSpeed * world.time.delta
  for (const player of lookingPlayerQuery(world)) Rotation.yaw[player] = wrapAngle(Rotation.yaw[player] + turn)
}
