import { addComponent, hasComponent, query } from 'bitecs'
import { describe, expect, it } from 'vitest'
import { cellAt, floorHeight } from '../../src/game/arena/Level'
import { Dead, Enemy, Health, Player, Position, Rotation, Velocity } from '../../src/game/ecs/components'
import type { Indicator, OverlayFrame } from '../../src/game/ecs/ports'
import type { GameWorld } from '../../src/game/ecs/world'
import { ENEMIES } from '../../src/game/config/enemies'
import { MESSAGES } from '../../src/game/config/messages'
import { PLAYER } from '../../src/game/config/player'
import { SPAWN } from '../../src/game/config/spawn'
import { FLOAT } from '../../src/game/config/view'
import { SWARM } from '../../src/game/config/waves'
import { findSpawnPoint, spawnEnemy } from '../../src/game/entities/enemy'
import { createTestHud, createTestInput, createTestRun, simulate } from '../support/game'

const playerOf = (world: GameWorld) => query(world, [Player])[0]
const enemiesOf = (world: GameWorld) => [...query(world, [Enemy])]
const distanceTo = (world: GameWorld, entity: number) => {
  const player = playerOf(world)
  return Math.hypot(Position.x[entity] - Position.x[player], Position.y[entity] - Position.y[player])
}
const beside = (world: GameWorld, offsetX: number, offsetY = 0) => {
  const player = playerOf(world)
  return [Position.x[player] + offsetX, Position.y[player] + offsetY] as const
}

function readyRun(mode: 'run' | 'training' = 'training', hud = createTestHud()): GameWorld {
  const world = createTestRun(mode, createTestInput(), hud)
  simulate(world, 0.05)
  return world
}

describe('spawn', () => {
  it('finds spawn points on the ring on open reachable floor', () => {
    const world = readyRun()
    for (let attempt = 0; attempt < 20; attempt++) {
      const point = findSpawnPoint(world, ...beside(world, 0), SPAWN.ringMin, SPAWN.ringMax)!
      const player = playerOf(world)
      const distance = Math.hypot(point.x - Position.x[player], point.y - Position.y[player])
      expect(distance).toBeGreaterThan(SPAWN.ringMin - 1)
      expect(distance).toBeLessThan(SPAWN.ringMax + 1)
    }
  })

  it('sends waves in a run and none in training', () => {
    const run = readyRun('run')
    const training = readyRun('training')
    simulate(run, 6)
    simulate(training, 6)
    expect(enemiesOf(run).length).toBeGreaterThanOrEqual(3)
    expect(enemiesOf(training)).toEqual([])
  })

  it('releases a swarm of bats on schedule', () => {
    const hud = createTestHud()
    const world = readyRun('run', hud)
    world.run.time = SWARM.every - 0.02
    simulate(world, 0.05)
    const bats = enemiesOf(world).filter((enemy) => Enemy.sprite[enemy] === SWARM.enemy.sprite)
    expect(bats.length).toBeGreaterThanOrEqual(SWARM.count * 0.8)
    expect(hud.messages).toContain(MESSAGES.swarm)
  })

  it('brings far enemies back to the ring', () => {
    const world = readyRun('run')
    const enemy = spawnEnemy(world, ENEMIES.skeleton, ...beside(world, 3))
    Position.x[enemy] += SPAWN.despawn + 2
    simulate(world, 0.6)
    expect(distanceTo(world, enemy)).toBeLessThan(SPAWN.ringMax + 2)
  })

  it('removes enemies that cannot reach the player', () => {
    const world = readyRun('run')
    const wall = world.level.wall.indexOf(1)
    const enemy = spawnEnemy(world, ENEMIES.skeleton, ...beside(world, 3))
    Position.x[enemy] = wall % 96 + 0.5
    Position.y[enemy] = Math.floor(wall / 96) + 0.5
    simulate(world, 0.6)
    const stuck = enemiesOf(world).filter((other) => world.level.wall[cellAt(Position.x[other], Position.y[other])] === 1)
    expect(stuck).toEqual([])
  })
})

describe('enemies', () => {
  it('chase the player around walls by the path field', () => {
    const world = readyRun()
    const point = findSpawnPoint(world, ...beside(world, 0), SPAWN.ringMin, SPAWN.ringMax)!
    const enemy = spawnEnemy(world, ENEMIES.ghoul, point.x, point.y)
    const start = distanceTo(world, enemy)
    simulate(world, 10)
    expect(start).toBeGreaterThan(SPAWN.ringMin - 1)
    expect(distanceTo(world, enemy)).toBeLessThan(1)
  })

  it('push each other apart', () => {
    const world = readyRun()
    const first = spawnEnemy(world, ENEMIES.skeleton, ...beside(world, 3.5))
    const second = spawnEnemy(world, ENEMIES.skeleton, ...beside(world, 3.5))
    simulate(world, 0.3)
    const apart = Math.hypot(Position.x[first] - Position.x[second], Position.y[first] - Position.y[second])
    expect(apart).toBeGreaterThan(ENEMIES.skeleton.radius * 1.5)
  })

  it('hover above the floor and fall when dead', () => {
    const world = readyRun()
    const bat = spawnEnemy(world, ENEMIES.bat, ...beside(world, 4))
    simulate(world, 0.2)
    const floor = () => floorHeight(world.level, Position.x[bat], Position.y[bat])
    expect(Math.abs(Position.z[bat] - floor() - ENEMIES.bat.lift)).toBeLessThanOrEqual(FLOAT.amplitude + 1e-3)
    addComponent(world, bat, Dead)
    simulate(world, 1)
    expect(Position.z[bat]).toBeCloseTo(floor(), 3)
  })
})

describe('combat', () => {
  it('hurts the player by touch with invulnerability in between', () => {
    const hud = createTestHud()
    let flashes = 0
    hud.flashHurt = () => { flashes++ }
    const world = readyRun('training', hud)
    const player = playerOf(world)
    spawnEnemy(world, ENEMIES.ghoul, ...beside(world, 0.5))
    simulate(world, 0.1)
    expect(Health.hp[player]).toBe(PLAYER.healthMax - ENEMIES.ghoul.contactDamage)
    simulate(world, 0.2)
    expect(Health.hp[player]).toBe(PLAYER.healthMax - ENEMIES.ghoul.contactDamage)
    simulate(world, 1)
    expect(Health.hp[player]).toBeLessThan(PLAYER.healthMax - ENEMIES.ghoul.contactDamage)
    expect(flashes).toBeGreaterThanOrEqual(2)
  })

  it('kills the hero at zero health', () => {
    const hud = createTestHud()
    const world = readyRun('training', hud)
    const player = playerOf(world)
    Health.hp[player] = 1
    spawnEnemy(world, ENEMIES.ghoul, ...beside(world, 0.5))
    simulate(world, 1)
    expect(hasComponent(world, player, Dead)).toBe(true)
    expect(Health.hp[player]).toBe(0)
    expect(world.status).toBe('dead')
    expect(hud.messages).toContain(MESSAGES.death)
  })

  it('lets a dead hero only drift to a stop', () => {
    const input = createTestInput()
    const world = createTestRun('training', input)
    const player = playerOf(world)
    addComponent(world, player, Dead)
    Velocity.x[player] = 3
    input.moveY = 1
    input.lookX = 0.5
    simulate(world, 1)
    expect(Math.hypot(Velocity.x[player], Velocity.y[player])).toBeLessThan(0.01)
    expect(Rotation.yaw[player]).toBe(0)
  })
})

describe('enemy view', () => {
  it('draws walking enemies and corpses', () => {
    const world = readyRun()
    const frames: string[] = []
    world.render.sprites.add = (frame) => { frames.push(frame) }
    const enemy = spawnEnemy(world, ENEMIES.skeleton, ...beside(world, 4))
    simulate(world, 0.05)
    expect(frames.some((frame) => frame.startsWith('skeleton_walk'))).toBe(true)
    addComponent(world, enemy, Dead)
    frames.length = 0
    simulate(world, 0.05)
    expect(frames).toContain('skeleton_dead')
  })

  it('points at enemies behind and shows where the hit came from', () => {
    const world = readyRun()
    const drawn: Indicator[][] = []
    const hurts: number[] = []
    world.render.overlay.draw = (frame: OverlayFrame) => { drawn.push(frame.indicators) }
    world.render.overlay.addHurt = (angle) => { hurts.push(angle) }
    spawnEnemy(world, ENEMIES.ghoul, ...beside(world, -4))
    simulate(world, 0.05)
    expect(Math.abs(drawn.at(-1)![0].angle)).toBeGreaterThan(Math.PI * 0.8)
    simulate(world, 1.5)
    expect(hurts.length).toBeGreaterThan(0)
  })
})
