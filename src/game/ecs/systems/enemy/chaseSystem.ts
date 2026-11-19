import { Not } from 'bitecs'
import { cellAt, NO_PATH, OUTSIDE } from '../../../arena/Level'
import { Dead, Enemy, Knockback, NO_TARGET, Position, Target, Velocity } from '../../components'
import { ARENA } from '../../../config/arena'
import { KNOCKBACK } from '../../../config/combat'
import { ENEMY_AI } from '../../../config/enemies'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const chaserQuery = defineQuery([Enemy, Target, Position, Velocity, Knockback, Not(Dead)])
const NEIGHBORS = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const
const CELL_CENTER = 0.5

function nextCell(world: GameWorld, enemy: number): number {
  const { path } = world.level
  const cell = cellAt(Position.x[enemy], Position.y[enemy])
  if (cell === OUTSIDE || path[cell] === NO_PATH) return OUTSIDE
  let best = OUTSIDE
  for (const [stepX, stepY] of NEIGHBORS) {
    const next = cellAt(Position.x[enemy] + stepX, Position.y[enemy] + stepY)
    if (next !== OUTSIDE && path[next] < path[best === OUTSIDE ? cell : best]) best = next
  }
  return best
}

function steer(enemy: number, towardX: number, towardY: number): void {
  const deltaX = towardX - Position.x[enemy]
  const deltaY = towardY - Position.y[enemy]
  const speed = Enemy.speed[enemy] / Math.max(Math.hypot(deltaX, deltaY), Number.EPSILON)
  Velocity.x[enemy] = deltaX * speed + Knockback.x[enemy]
  Velocity.y[enemy] = deltaY * speed + Knockback.y[enemy]
}

function chase(world: GameWorld, enemy: number, target: number): void {
  const targetX = Position.x[target]
  const targetY = Position.y[target]
  const next = Math.hypot(targetX - Position.x[enemy], targetY - Position.y[enemy]) < ENEMY_AI.directRange ? OUTSIDE : nextCell(world, enemy)
  if (next === OUTSIDE) steer(enemy, targetX, targetY)
  else steer(enemy, next % ARENA.size + CELL_CENTER, Math.floor(next / ARENA.size) + CELL_CENTER)
}

export function chaseSystem(world: GameWorld): void {
  const decay = Math.exp(-KNOCKBACK.decay * world.time.delta)
  for (const enemy of chaserQuery(world)) {
    Knockback.x[enemy] *= decay
    Knockback.y[enemy] *= decay
    const target = Target.entity[enemy]
    if (target !== NO_TARGET) chase(world, enemy, target)
    else {
      Velocity.x[enemy] = Knockback.x[enemy]
      Velocity.y[enemy] = Knockback.y[enemy]
    }
  }
}
