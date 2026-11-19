import { lightAt } from '../../../arena/Level'
import { Position, Sprite } from '../../components'
import { RENDER } from '../../../config/view'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const drawnQuery = defineQuery([Sprite, Position])
const FULL_LIGHT = 1

export function spriteDrawSystem(world: GameWorld): void {
  const { sprites, view } = world.render
  sprites.begin()
  for (const entity of drawnQuery(world)) {
    const x = Position.x[entity]
    const y = Position.y[entity]
    if (Math.hypot(x - view.x, y - view.y) > RENDER.fogFar) continue
    const light = Sprite.bright[entity] ? FULL_LIGHT : lightAt(world.level, x, y)
    sprites.add(Sprite.frame[entity], x, y, Position.z[entity], Sprite.scale[entity], light, Sprite.tint[entity], Sprite.flip[entity] === 1, Sprite.squash[entity], Sprite.rotation[entity])
  }
  sprites.end()
}
