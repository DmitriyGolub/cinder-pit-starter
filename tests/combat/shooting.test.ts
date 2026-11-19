import { readFileSync } from 'node:fs'
import { addComponent, addEntity, hasComponent, query } from 'bitecs'
import { describe, expect, it } from 'vitest'
import { Dead, Health, Lifetime, Player, PlayerShot, Position, Projectile, Rotation, Spin, Roll, Sprite, Velocity, Weapon } from '../../src/game/ecs/components'
import type { HitNumber } from '../../src/game/ecs/events'
import type { GameWorld } from '../../src/game/ecs/world'
import { floorHeight } from '../../src/game/arena/Level'
import { ARENA } from '../../src/game/config/arena'
import { PLAYER_SHOT, PROJECTILE } from '../../src/game/config/combat'
import { PLAYER } from '../../src/game/config/player'
import { ENEMIES } from '../../src/game/config/enemies'
import { SPIN_MIN } from '../../src/game/config/view'
import { WEAPONS } from '../../src/game/config/weapons'
import { spawnEnemy } from '../../src/game/entities/enemy'
import { spawnPlayerShot } from '../../src/game/entities/projectile'
import { addSprite } from '../../src/game/entities/sprite'
import { createTestHud, createTestInput, createTestRun, simulate } from '../support/game'

const playerOf = (world: GameWorld) => query(world, [Player])[0]
const shotsOf = (world: GameWorld) => [...query(world, [PlayerShot])]

function armed() {
  const input = createTestInput()
  const hud = createTestHud()
  const world = createTestRun('training', input, hud)
  simulate(world, 0.5)
  return { world, input, hud, player: playerOf(world) }
}

function aimAt(player: number, enemy: number): void {
  Rotation.yaw[player] = Math.atan2(Position.y[enemy] - Position.y[player], Position.x[enemy] - Position.x[player])
}

function wandShot(world: GameWorld, x: number, y: number, yaw: number): number {
  const wand = WEAPONS.wand
  return spawnPlayerShot(world, { source: playerOf(world), x, y, z: floorHeight(world.level, x, y) + 0.5, yaw, climb: 0, rise: 0, speed: wand.speed, range: wand.range, damage: wand.damage, pierce: 1, splash: 0, element: wand.element })
}

describe('weapon', () => {
  it('fires on the button with the weapon cooldown', () => {
    const { world, input, player } = armed()
    expect(shotsOf(world)).toEqual([])
    let shots = 0
    let since = Weapon.sinceShot[player]
    input.fire = true
    simulate(world, 1, () => {
      if (Weapon.sinceShot[player] < since) shots++
      since = Weapon.sinceShot[player]
    })
    expect(shots).toBe(Math.ceil(1 / WEAPONS.wand.cooldown))
  })

  it('shows the weapon in hand and its fire frame', () => {
    const { world, input } = armed()
    const frames: string[] = []
    world.render.setViewModel = (frame) => { frames.push(frame) }
    simulate(world, 0.1)
    input.fire = true
    simulate(world, 0.05)
    expect(frames).toContain('wand_idle')
    expect(frames.at(-1)).toBe('wand_fire')
  })
})

describe('projectiles', () => {
  it('leave the weapon tip and rise to the crosshair', () => {
    const { world, input, player } = armed()
    Rotation.yaw[player] = Math.PI
    input.fire = true
    simulate(world, 1 / 60)
    const shot = shotsOf(world)[0]
    const tip = Position.z[player] + PLAYER.eye + WEAPONS.wand.muzzle * PLAYER_SHOT.muzzleDistance
    expect(Position.z[shot] - Velocity.z[shot] / 60).toBeCloseTo(tip, 2)
    input.fire = false
    simulate(world, PLAYER_SHOT.riseTiles / WEAPONS.wand.speed + 0.05)
    expect(Position.z[shot]).toBeCloseTo(Position.z[player] + PLAYER.eye - PLAYER_SHOT.aimDrop, 2)
  })

  it('break on the wall surface at their flight height', () => {
    const { world } = armed()
    const { wall } = world.level
    const cell = wall.findIndex((rock, index) => rock === 0 && wall[index + 1] === 1 && index % ARENA.size < ARENA.size - 2)
    const x = cell % ARENA.size + 0.5
    const y = Math.floor(cell / ARENA.size) + 0.5
    const shot = wandShot(world, x, y, 0)
    const z = Position.z[shot]
    const impacts: number[][] = []
    simulate(world, 0.1, () => impacts.push(...world.events.impacts.map((impact) => [impact.x, impact.z])))
    expect(hasComponent(world, shot, Projectile) && !hasComponent(world, shot, Dead)).toBe(false)
    const effect = query(world, [Sprite, Lifetime]).find((entity) => Sprite.frame[entity].startsWith('impact'))!
    expect(Position.x[effect]).toBeGreaterThan(x + 0.45)
    expect(Position.x[effect]).toBeLessThanOrEqual(x + 0.5)
    expect(Position.z[effect]).toBeCloseTo(z, 3)
  })

  it('break on the enemy body edge', () => {
    const { world, player } = armed()
    const enemy = spawnEnemy(world, ENEMIES.ghoul, Position.x[player] + 3, Position.y[player])
    Health.hp[enemy] = 1000
    simulate(world, 0.02)
    const shot = wandShot(world, Position.x[player] + 0.5, Position.y[enemy], 0)
    const z = Position.z[shot]
    const edges: number[] = []
    const heights: number[] = []
    simulate(world, 0.2, () => {
      for (const impact of world.events.impacts) {
        edges.push(Math.hypot(impact.x - Position.x[enemy], impact.y - Position.y[enemy]))
        heights.push(impact.z)
      }
    })
    expect(edges).toHaveLength(1)
    expect(edges[0]).toBeCloseTo(ENEMIES.ghoul.radius + PROJECTILE.radius, 1)
    expect(heights[0]).toBeCloseTo(z, 3)
  })

  it('kill enemies into corpses and count kills', () => {
    const { world, input, hud, player } = armed()
    const enemy = spawnEnemy(world, ENEMIES.skeleton, Position.x[player] + 4, Position.y[player])
    input.fire = true
    simulate(world, 1.5, () => aimAt(player, enemy))
    expect(hasComponent(world, enemy, Dead)).toBe(true)
    expect(Sprite.frame[enemy]).toBe('skeleton_dead')
    expect(Lifetime.left[enemy]).toBeGreaterThan(0)
    expect(world.run.kills).toBe(1)
    expect(hud.player?.kills).toBe(1)
    expect(Health.hp[player]).toBeGreaterThan(0)
  })

  it('show damage numbers on hits', () => {
    const { world, input, player } = armed()
    const numbers: HitNumber[] = []
    world.render.overlay.addNumber = (hit) => { numbers.push(hit) }
    const enemy = spawnEnemy(world, ENEMIES.ghoul, Position.x[player] + 4, Position.y[player])
    input.fire = true
    simulate(world, 1, () => aimAt(player, enemy))
    expect(numbers.length).toBeGreaterThan(0)
    expect(numbers[0].target).toBe(enemy)
  })

  it('splash nearby enemies from the fire staff', () => {
    const { world, input, player } = armed()
    Weapon.kind[player] = 'firestaff'
    const first = spawnEnemy(world, ENEMIES.ghoul, Position.x[player] + 4, Position.y[player])
    const second = spawnEnemy(world, ENEMIES.ghoul, Position.x[player] + 4.6, Position.y[player] + 0.6)
    const full = Health.hp[second]
    input.fire = true
    simulate(world, 0.6, () => aimAt(player, first))
    expect(Health.hp[second]).toBeLessThan(full)
  })
})

describe('sprite motion', () => {
  it('draws only frames that exist in the sprite sheets', () => {
    const index = JSON.parse(readFileSync('public/sprites/index.json', 'utf8')) as string[]
    const known = new Set(index.flatMap((path) => Object.keys(JSON.parse(readFileSync(`public/sprites/${path}`, 'utf8')).frames)))
    const { world, input, player } = armed()
    const drawn = new Set<string>()
    world.render.sprites.add = (frame) => { drawn.add(frame) }
    spawnEnemy(world, ENEMIES.ghoul, Position.x[player] + 4, Position.y[player])
    input.fire = true
    simulate(world, 2)
    expect([...drawn].filter((frame) => !known.has(frame))).toEqual([])
  })

  it('shows a side sprite across the view and a front sprite along it', () => {
    const { world, player } = armed()
    Rotation.yaw[player] = 0
    simulate(world, 0.05)
    const across = wandShot(world, Position.x[player], Position.y[player], Math.PI / 2)
    const along = wandShot(world, Position.x[player], Position.y[player], 0)
    simulate(world, 0.02)
    expect(Sprite.frame[across]).toMatch(/^orb_side\d$/)
    expect(Sprite.frame[along]).toMatch(/^orb_front\d$/)
  })

  it('spins and rolls sprites', () => {
    const { world } = armed()
    const entity = addEntity(world)
    addComponent(world, entity, Position)
    addSprite(world, entity, { frame: 'missing' })
    addComponent(world, entity, Spin)
    addComponent(world, entity, Roll)
    Spin.rate[entity] = 5
    Roll.speed[entity] = 2
    const squashes = new Set<number>()
    simulate(world, 1, () => squashes.add(Math.round(Sprite.squash[entity] * 10)))
    expect(squashes.size).toBeGreaterThan(3)
    expect(Math.min(...squashes) / 10).toBeGreaterThanOrEqual(SPIN_MIN - 0.05)
    expect(Sprite.rotation[entity]).toBeCloseTo(2, 1)
  })
})
