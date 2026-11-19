import { Not } from 'bitecs'
import { Dead, Enemy, Player, Position } from '../../components'
import type { EnemyConfig } from '../../../config/enemies'
import { SPAWN } from '../../../config/spawn'
import { WAVES, waveIndex } from '../../../config/waves'
import { findSpawnPoint, spawnEnemy } from '../../../entities/enemy'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const livingPlayerQuery = defineQuery([Player, Position, Not(Dead)])
const livingEnemyQuery = defineQuery([Enemy, Not(Dead)])

function pick(world: GameWorld, pool: [EnemyConfig, number][]): EnemyConfig {
  let roll = world.random() * pool.reduce((sum, [, weight]) => sum + weight, 0)
  for (const [config, weight] of pool) {
    roll -= weight
    if (roll <= 0) return config
  }
  return pool[pool.length - 1][0]
}

export function waveSpawnSystem(world: GameWorld): void {
  const wave = WAVES[waveIndex(world.run.time)]
  const { waves } = world
  waves.debt += wave.rate * world.time.delta
  for (const player of livingPlayerQuery(world)) {
    while (waves.debt >= 1 && livingEnemyQuery(world).length < SPAWN.aliveMax) {
      waves.debt -= 1
      const point = findSpawnPoint(world, Position.x[player], Position.y[player], SPAWN.ringMin, SPAWN.ringMax)
      if (point) spawnEnemy(world, pick(world, wave.pool), point.x, point.y)
    }
  }
  waves.debt = Math.min(waves.debt, 1)
}
