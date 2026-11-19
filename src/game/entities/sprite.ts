import { addComponent } from 'bitecs'
import { Sprite } from '../ecs/components'
import type { GameWorld } from '../ecs/world'

interface SpriteLook {
  frame: string
  scale?: number
  tint?: number
  bright?: boolean
}

export function addSprite(world: GameWorld, entity: number, look: SpriteLook): void {
  addComponent(world, entity, Sprite)
  Sprite.frame[entity] = look.frame
  Sprite.scale[entity] = look.scale ?? 1
  Sprite.tint[entity] = look.tint ?? 0
  Sprite.bright[entity] = look.bright ? 1 : 0
  Sprite.phase[entity] = 0
  Sprite.rotation[entity] = 0
  Sprite.squash[entity] = 1
  Sprite.flip[entity] = 0
}
