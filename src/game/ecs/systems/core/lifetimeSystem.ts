import { Lifetime } from '../../components'
import { destroyEntity, type GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const lifetimeQuery = defineQuery([Lifetime])

export function lifetimeSystem(world: GameWorld): void {
  for (const entity of lifetimeQuery(world)) {
    Lifetime.left[entity] -= world.time.delta
    if (Lifetime.left[entity] <= 0) destroyEntity(world, entity)
  }
}
