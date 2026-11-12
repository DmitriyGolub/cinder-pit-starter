import type { GameWorld, System } from '../world'

export function every(interval: number, system: System): System {
  const scheduled = (world: GameWorld) => {
    const left = (world.timers.get(system) ?? 0) - world.time.delta
    world.timers.set(system, left > 0 ? left : interval)
    if (left <= 0) system(world)
  }
  return Object.defineProperty(scheduled, 'name', { value: system.name })
}

export const runNextFrame = (world: GameWorld, system: System) => world.timers.delete(system)
