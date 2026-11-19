import { Animation, Sprite } from '../../components'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const animatedQuery = defineQuery([Animation, Sprite])

export function frameAnimationSystem(world: GameWorld): void {
  for (const entity of animatedQuery(world)) {
    const frames = Animation.frames[entity]
    if (frames <= 1) {
      Sprite.frame[entity] = Animation.base[entity]
      continue
    }
    const step = Math.max(0, Math.floor((world.time.elapsed - Animation.start[entity]) * Animation.fps[entity]))
    const frame = Animation.loop[entity] ? step % frames : Math.min(step, frames - 1)
    Sprite.frame[entity] = `${Animation.base[entity]}${frame}`
  }
}
