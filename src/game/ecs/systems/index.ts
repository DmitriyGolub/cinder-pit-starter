import { SYSTEM_INTERVALS } from '../../config/engine'
import type { GameWorld, System } from '../world'
import { arenaSystem, pathfieldSystem } from './arena'
import { cleanupSystem, clockSystem, lifetimeSystem, spatialSystem } from './core'
import { gravitySystem, movementSystem } from './physics'
import { playerLookSystem, playerMoveSystem } from './player'
import { every } from './schedule'
import { atmosphereSystem, cameraSystem, hudSystem, levelViewSystem } from './view'

const viewPipeline: System[] = [atmosphereSystem, levelViewSystem, cameraSystem, every(SYSTEM_INTERVALS.hud, hudSystem)]

const simulation = (spawn: System[]): System[] => [
  clockSystem,
  playerLookSystem, playerMoveSystem,
  movementSystem, gravitySystem,
  arenaSystem, spatialSystem, every(SYSTEM_INTERVALS.pathfield, pathfieldSystem),
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
