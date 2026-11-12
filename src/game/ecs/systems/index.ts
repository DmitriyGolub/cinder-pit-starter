import type { GameWorld, System } from '../world'
import { cleanupSystem, clockSystem, lifetimeSystem, spatialSystem } from './core'
import { cameraSystem } from './view'

const viewPipeline: System[] = [cameraSystem]

const simulation = (spawn: System[]): System[] => [
  clockSystem, spatialSystem,
  ...spawn,
  lifetimeSystem,
  ...viewPipeline, cleanupSystem,
]

const pipeline = simulation([])

const trainingPipeline = simulation([])

export function runSystems(world: GameWorld): void {
  for (const system of world.run.mode === 'training' ? trainingPipeline : pipeline) system(world)
}

export function runView(world: GameWorld): void {
  for (const system of viewPipeline) system(world)
}
