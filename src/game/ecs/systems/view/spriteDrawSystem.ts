import { lightAt } from '../../../arena/Level'
import { Position, Sprite } from '../../components'
import { RENDER } from '../../../config/view'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const drawnQuery = defineQuery([Sprite, Position])
const NO_TINT = 0
const NO_SQUASH = 1
const NO_ROTATION = 0

export function spriteDrawSystem(world: GameWorld): void {
  const { sprites, view } = world.render
  sprites.begin()
  for (const entity of drawnQuery(world)) {
    const x = Position.x[entity]
    const y = Position.y[entity]
    if (Math.hypot(x - view.x, y - view.y) > RENDER.fogFar) continue
    sprites.add(Sprite.frame[entity], x, y, Position.z[entity], Sprite.scale[entity], lightAt(world.level, x, y), NO_TINT, false, NO_SQUASH, NO_ROTATION)
  }
  sprites.end()
}
