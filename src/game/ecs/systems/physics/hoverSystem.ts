import { Not, removeComponent } from 'bitecs'
import { floorHeight } from '../../../arena/Level'
import { Dead, Hover, Position, Velocity } from '../../components'
import { FLOAT } from '../../../config/view'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const hoverQuery = defineQuery([Hover, Position, Velocity, Not(Dead)])
const fallenQuery = defineQuery([Hover, Dead])

export function hoverSystem(world: GameWorld): void {
  for (const flyer of [...fallenQuery(world)]) removeComponent(world, flyer, Hover)
  for (const flyer of hoverQuery(world)) {
    const bob = Math.sin(world.time.elapsed * FLOAT.rate + Hover.phase[flyer]) * FLOAT.amplitude
    Position.z[flyer] = floorHeight(world.level, Position.x[flyer], Position.y[flyer]) + Hover.lift[flyer] + bob
    Velocity.z[flyer] = 0
  }
}
