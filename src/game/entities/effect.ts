import { addComponent, addEntity } from 'bitecs'
import { Animation, Lifetime, Position, Roll } from '../ecs/components'
import { EFFECTS, type EffectName } from '../config/effects'
import { SPIN_MIN } from '../config/view'
import type { GameWorld } from '../ecs/world'
import { addSprite } from './sprite'

const ROLL_RANGE = Math.PI * 2

export function spawnEffect(world: GameWorld, name: EffectName, x: number, y: number, z: number): number {
  const config = EFFECTS[name]
  const effect = addEntity(world)
  for (const component of [Position, Animation, Lifetime, Roll]) addComponent(world, effect, component)
  addSprite(world, effect, { frame: `${config.sprite}0`, scale: config.scale, bright: config.fullbright })
  Position.x[effect] = x
  Position.y[effect] = y
  Position.z[effect] = z
  Animation.base[effect] = config.sprite
  Animation.frames[effect] = config.frames
  Animation.fps[effect] = config.fps
  Animation.start[effect] = world.time.elapsed
  Animation.loop[effect] = 0
  Lifetime.left[effect] = config.frames / config.fps
  Roll.speed[effect] = (world.random() * 2 - 1) * ROLL_RANGE * SPIN_MIN
  return effect
}
