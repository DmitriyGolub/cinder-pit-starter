import { Dead, Player, Velocity } from '../../components'
import { PLAYER } from '../../../config/player'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const deadPlayerQuery = defineQuery([Player, Velocity, Dead])

export function deadDriftSystem(world: GameWorld): void {
  const keep = PLAYER.deadFriction ** (world.time.delta / PLAYER.deadFrictionStep)
  for (const player of deadPlayerQuery(world)) {
    Velocity.x[player] *= keep
    Velocity.y[player] *= keep
  }
}
