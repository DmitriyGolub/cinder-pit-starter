import { Roll, Sprite } from '../../components'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const rollingQuery = defineQuery([Roll, Sprite])

export function rollSystem(world: GameWorld): void {
  for (const entity of rollingQuery(world)) Sprite.rotation[entity] += Roll.speed[entity] * world.time.delta
}
