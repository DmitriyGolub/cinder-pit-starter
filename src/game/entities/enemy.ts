import { addComponent, addEntity } from 'bitecs'
import { cellAt, floorHeight, isReachable } from '../arena/Level'
import type { EnemyConfig } from '../config/enemies'
import { ENEMY_WALK } from '../config/view'
import { HP_PER_MINUTE } from '../config/waves'
import { SPAWN } from '../config/spawn'
import { Body, Enemy, Health, Hover, Knockback, NO_TARGET, Position, Shootable, Sprite, Target, Velocity } from '../ecs/components'
import { addSprite } from './sprite'
import type { GameWorld } from '../ecs/world'

interface Point {
  x: number
  y: number
}

const CELL_CENTER = 0.5
const SECONDS_PER_MINUTE = 60
const FULL_TURN = Math.PI * 2

export function findSpawnPoint(world: GameWorld, centerX: number, centerY: number, ringMin: number, ringMax: number): Point | null {
  for (let attempt = 0; attempt < SPAWN.tries; attempt++) {
    const angle = world.random() * FULL_TURN
    const radius = ringMin + world.random() * (ringMax - ringMin)
    const x = Math.floor(centerX + Math.cos(angle) * radius) + CELL_CENTER
    const y = Math.floor(centerY + Math.sin(angle) * radius) + CELL_CENTER
    if (isReachable(world.level, x, y) && world.level.wall[cellAt(x, y)] === 0) return { x, y }
  }
  return null
}

export function placeEnemy(world: GameWorld, enemy: number, x: number, y: number): void {
  Position.x[enemy] = x
  Position.y[enemy] = y
  Position.z[enemy] = floorHeight(world.level, x, y) + Hover.lift[enemy]
  Velocity.x[enemy] = Velocity.y[enemy] = Velocity.z[enemy] = 0
  Knockback.x[enemy] = Knockback.y[enemy] = 0
}

function setupHover(world: GameWorld, enemy: number, lift: number): void {
  Hover.lift[enemy] = lift
  Hover.phase[enemy] = world.random() * FULL_TURN
  if (lift > 0) addComponent(world, enemy, Hover)
}

export function spawnEnemy(world: GameWorld, config: EnemyConfig, x: number, y: number): number {
  const enemy = addEntity(world)
  for (const component of [Enemy, Target, Position, Velocity, Knockback, Body, Health, Shootable]) addComponent(world, enemy, component)
  setupHover(world, enemy, config.lift ?? 0)
  placeEnemy(world, enemy, x, y)
  Body.radius[enemy] = config.radius
  Body.height[enemy] = config.height
  Health.max[enemy] = Health.hp[enemy] = config.hp * (1 + HP_PER_MINUTE * world.run.time / SECONDS_PER_MINUTE)
  Enemy.sprite[enemy] = config.sprite
  Enemy.speed[enemy] = config.speed
  Enemy.damage[enemy] = config.contactDamage
  Enemy.timer[enemy] = 0
  Target.entity[enemy] = NO_TARGET
  addSprite(world, enemy, { frame: `${config.sprite}_walk0` })
  Sprite.phase[enemy] = world.random() * ENEMY_WALK.frames
  return enemy
}
