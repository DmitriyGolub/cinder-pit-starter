import { Animation, Directional, Heading, Sprite } from '../../components'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const directionalQuery = defineQuery([Directional, Heading, Animation, Sprite])

export function directionalSpriteSystem(world: GameWorld): void {
  const { rightX, rightY } = world.render.view
  for (const entity of directionalQuery(world)) {
    const headingX = Math.cos(Heading.yaw[entity])
    const headingY = Math.sin(Heading.yaw[entity])
    const across = headingX * rightX + headingY * rightY
    const along = headingX * rightY - headingY * rightX
    const side = Math.abs(across) > Math.abs(along)
    Animation.base[entity] = `${Directional.sprite[entity]}_${side ? 'side' : 'front'}`
    Sprite.flip[entity] = side && across < 0 ? 1 : 0
  }
}
