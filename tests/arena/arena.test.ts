import { describe, expect, it } from 'vitest'
import { query } from 'bitecs'
import { cellAt, floorHeight, NO_PATH } from '../../src/game/arena/Level'
import { generateLevel } from '../../src/game/arena/generate'
import { Player, Position, Rotation, Velocity } from '../../src/game/ecs/components'
import { ARENA, ARENA_NOISE } from '../../src/game/config/arena'
import { BIOMES } from '../../src/game/config/biomes'
import { createTestInput, createTestRun, simulate } from '../support/game'

const playerOf = (world: ReturnType<typeof createTestRun>) => query(world, [Player])[0]
const TURN_WHEN_STUCK = 1.3
const STUCK_SPEED = 1

function steer(input: ReturnType<typeof createTestInput>, player: number): void {
  input.moveY = 1
  input.lookX = Math.hypot(Velocity.x[player], Velocity.y[player]) < STUCK_SPEED ? TURN_WHEN_STUCK : 0
}

describe('arena', () => {
  it('keeps rock as islands in open caves', () => {
    const { level } = createTestRun()
    const walls = level.wall.reduce((sum, wall) => sum + wall, 0)
    expect(walls / level.wall.length).toBeGreaterThan(0.05)
    expect(walls / level.wall.length).toBeLessThan(0.4)
  })

  it('lays the floor on three heights', () => {
    const { level } = createTestRun()
    const heights = new Set(level.floor.filter((_, cell) => level.wall[cell] === 0))
    expect([...heights].sort()).toEqual([0, 1, 2])
    expect(ARENA_NOISE.heightLevels).toBe(2)
  })

  it('has all four biomes somewhere around', () => {
    const { level } = createTestRun()
    const seen = new Set<number>()
    for (let step = 0; step < 40 && seen.size < BIOMES.length; step++) {
      generateLevel(level, step * ARENA.size, step * ARENA.size * 3)
      for (const biome of level.biome) seen.add(biome)
    }
    expect(seen.size).toBe(BIOMES.length)
  })

  it('reaches most open cells from the player', () => {
    const world = createTestRun()
    simulate(world, 0.5)
    const { level } = world
    const open = level.wall.filter((wall) => wall === 0).length
    const reached = level.path.filter((distance) => distance !== NO_PATH).length
    expect(reached / open).toBeGreaterThan(0.8)
  })
})

describe('walking', () => {
  it('walks forward with the keys and stays on the floor', () => {
    const input = createTestInput()
    const world = createTestRun('run', input)
    const player = playerOf(world)
    input.moveY = 1
    simulate(world, 0.5)
    expect(Math.hypot(world.level.originX + Position.x[player], world.level.originY + Position.y[player])).toBeGreaterThan(1)
    expect(Position.z[player]).toBeCloseTo(floorHeight(world.level, Position.x[player], Position.y[player]), 3)
  })

  it('turns with the mouse', () => {
    const input = createTestInput()
    const world = createTestRun('run', input)
    input.lookX = 0.1
    simulate(world, 0.1)
    expect(Rotation.yaw[playerOf(world)]).toBeGreaterThan(0.5)
  })

  it('never walks into rock and never leaves the arena', () => {
    const input = createTestInput()
    const world = createTestRun('run', input)
    const player = playerOf(world)
    simulate(world, 60, (frameWorld) => {
      steer(input, player)
      const cell = cellAt(Position.x[player], Position.y[player])
      expect(cell).toBeGreaterThanOrEqual(0)
      expect(frameWorld.level.wall[cell]).toBe(0)
      expect(Math.abs(Position.x[player] - ARENA.size / 2)).toBeLessThanOrEqual(ARENA.recenter + 1)
    })
  })

  it('moves the caves with the player without an edge', () => {
    const input = createTestInput()
    const world = createTestRun('run', input)
    const player = playerOf(world)
    const before = world.level.version
    let travelled = 0
    simulate(world, 30, (frameWorld) => {
      steer(input, player)
      travelled = Math.max(travelled, Math.abs(frameWorld.level.originX + Position.x[player]), Math.abs(frameWorld.level.originY + Position.y[player]))
    })
    expect(travelled).toBeGreaterThan(ARENA.recenter)
    expect(world.level.version).toBeGreaterThan(before)
  })
})

describe('atmosphere', () => {
  it('fades the fog to the biome under the player', () => {
    const input = createTestInput()
    const world = createTestRun('run', input)
    const fogs: number[][] = []
    world.render.setFog = (red, green, blue) => { fogs.push([red, green, blue]) }
    world.atmosphere.red = 1
    simulate(world, 0.1)
    expect(fogs.length).toBeGreaterThan(1)
    expect(fogs[1][0]).toBeLessThan(fogs[0][0])
    expect(fogs.at(-1)![0]).toBeGreaterThan(0.1)
  })
})
