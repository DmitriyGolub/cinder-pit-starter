import { Spin, Sprite } from '../../components'
import { SPIN_MIN } from '../../../config/view'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const spinningQuery = defineQuery([Spin, Sprite])

export function spinSystem(world: GameWorld): void {
  for (const entity of spinningQuery(world)) {
    Sprite.squash[entity] = Math.max(SPIN_MIN, Math.abs(Math.cos(world.time.elapsed * Spin.rate[entity] + Spin.phase[entity])))
  }
}
