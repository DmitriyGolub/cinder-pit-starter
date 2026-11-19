import type { GameWorld } from '../../world'

export function levelViewSystem(world: GameWorld): void {
  const { level } = world
  if (level.shown === level.version) return
  world.render.showLevel(level)
  level.shown = level.version
}
