import { SYSTEM_INTERVALS } from '../../config/engine'
import type { GameWorld, System } from '../world'
import { arenaSystem, pathfieldSystem } from './arena'
import { contactSystem, corpseSystem, damageSystem, enemyDeathSystem, playerHurtSystem, targetingSystem } from './combat'
import { cleanupSystem, clockSystem, lifetimeSystem, spatialSystem } from './core'
import { chaseSystem, enemyCooldownSystem } from './enemy'
import { gravitySystem, hoverSystem, movementSystem, separationSystem } from './physics'
import { deadDriftSystem, playerLookSystem, playerMoveSystem } from './player'
import { impactSystem, playerShotHitSystem, projectileMoveSystem, projectileWallSystem } from './projectile'
import { every } from './schedule'
import { despawnSystem, recycleSystem, swarmSpawnSystem, waveSpawnSystem } from './spawn'
import {
  atmosphereSystem, cameraSystem, directionalSpriteSystem, enemyPoseSystem, frameAnimationSystem, headingSystem, hudSystem, levelViewSystem,
  overlaySystem, rollSystem, spinSystem, spriteDrawSystem, weaponViewSystem,
} from './view'
import { weaponFireSystem } from './weapons'

const viewPipeline: System[] = [
  atmosphereSystem, levelViewSystem,
  headingSystem, directionalSpriteSystem, frameAnimationSystem, spinSystem, rollSystem, enemyPoseSystem, spriteDrawSystem,
  cameraSystem, weaponViewSystem, overlaySystem,
  every(SYSTEM_INTERVALS.hud, hudSystem),
]

const simulation = (spawn: System[]): System[] => [
  clockSystem,
  playerLookSystem, playerMoveSystem, deadDriftSystem, weaponFireSystem,
  targetingSystem, chaseSystem, enemyCooldownSystem,
  movementSystem, hoverSystem, gravitySystem, projectileMoveSystem,
  arenaSystem, spatialSystem, separationSystem, every(SYSTEM_INTERVALS.pathfield, pathfieldSystem),
  ...spawn,
  playerShotHitSystem, projectileWallSystem, impactSystem,
  contactSystem, playerHurtSystem, damageSystem, enemyDeathSystem, corpseSystem,
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
