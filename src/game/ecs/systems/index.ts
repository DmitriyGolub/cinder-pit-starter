import { SYSTEM_INTERVALS } from '../../config/engine'
import type { GameWorld, System } from '../world'
import { arenaSystem, pathfieldSystem } from './arena'
import { contactSystem, damageSystem, playerHurtSystem, targetingSystem } from './combat'
import { cleanupSystem, clockSystem, lifetimeSystem, spatialSystem } from './core'
import { chaseSystem, enemyCooldownSystem } from './enemy'
import { gravitySystem, hoverSystem, movementSystem, separationSystem } from './physics'
import { deadDriftSystem, playerLookSystem, playerMoveSystem } from './player'
import { every } from './schedule'
import { despawnSystem, recycleSystem, swarmSpawnSystem, waveSpawnSystem } from './spawn'
import { atmosphereSystem, cameraSystem, enemyPoseSystem, hudSystem, levelViewSystem, overlaySystem, spriteDrawSystem } from './view'

const viewPipeline: System[] = [
  atmosphereSystem, levelViewSystem, enemyPoseSystem, spriteDrawSystem, cameraSystem, overlaySystem,
  every(SYSTEM_INTERVALS.hud, hudSystem),
]

const simulation = (spawn: System[]): System[] => [
  clockSystem,
  playerLookSystem, playerMoveSystem, deadDriftSystem,
  targetingSystem, chaseSystem, enemyCooldownSystem,
  movementSystem, hoverSystem, gravitySystem,
  arenaSystem, spatialSystem, separationSystem, every(SYSTEM_INTERVALS.pathfield, pathfieldSystem),
  ...spawn,
  contactSystem, playerHurtSystem, damageSystem,
  lifetimeSystem,
  ...viewPipeline, cleanupSystem,
]

const pipeline = simulation([
  waveSpawnSystem, swarmSpawnSystem,
  every(SYSTEM_INTERVALS.recycle, recycleSystem), every(SYSTEM_INTERVALS.despawn, despawnSystem),
])

const trainingPipeline = simulation([])

export function runSystems(world: GameWorld): void {
  for (const system of world.run.mode === 'training' ? trainingPipeline : pipeline) system(world)
}

export function runView(world: GameWorld): void {
  for (const system of viewPipeline) system(world)
}
