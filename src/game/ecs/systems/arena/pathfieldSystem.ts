import { cellAt, cellHeight, NO_PATH, OUTSIDE, type Level } from '../../../arena/Level'
import { Player, Position } from '../../components'
import { ARENA } from '../../../config/arena'
import { STEP_HEIGHT } from '../../../config/physics'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const playerQuery = defineQuery([Player, Position])
const NEIGHBORS = [1, -1, ARENA.size, -ARENA.size]

function canClimb(level: Level, from: number, to: number): boolean {
  const sameRow = Math.abs(from - to) !== 1 || Math.floor(from / ARENA.size) === Math.floor(to / ARENA.size)
  return sameRow && level.wall[from] === 0 && cellHeight(level, to) - cellHeight(level, from) <= STEP_HEIGHT
}

function spread(level: Level, start: number): void {
  const { path, queue } = level
  path.fill(NO_PATH)
  path[start] = 0
  queue[0] = start
  for (let head = 0, tail = 1; head < tail; head++) {
    const cell = queue[head]
    for (const step of NEIGHBORS) {
      const next = cell + step
      if (next < 0 || next >= path.length || path[next] !== NO_PATH || !canClimb(level, next, cell)) continue
      path[next] = path[cell] + 1
      queue[tail++] = next
    }
  }
}

export function pathfieldSystem(world: GameWorld): void {
  for (const player of playerQuery(world)) {
    const cell = cellAt(Position.x[player], Position.y[player])
    if (cell !== OUTSIDE) spread(world.level, cell)
  }
}
