import type { GameWorld } from '../../world'

export function clockSystem(world: GameWorld): void {
  world.run.time += world.time.delta
}
