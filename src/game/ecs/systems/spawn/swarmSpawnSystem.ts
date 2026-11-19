import { Not } from 'bitecs'
import { Dead, Player, Position } from '../../components'
import { MESSAGES } from '../../../config/messages'
import { SWARM } from '../../../config/waves'
import { findSpawnPoint, spawnEnemy } from '../../../entities/enemy'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const livingPlayerQuery = defineQuery([Player, Position, Not(Dead)])

export function swarmSpawnSystem(world: GameWorld): void {
  const swarm = Math.floor(world.run.time / SWARM.every)
  if (swarm <= world.waves.swarms) return
  world.waves.swarms = swarm
  for (const player of livingPlayerQuery(world)) {
    for (let bat = 0; bat < SWARM.count; bat++) {
      const point = findSpawnPoint(world, Position.x[player], Position.y[player], SWARM.ringMin, SWARM.ringMax)
      if (point) spawnEnemy(world, SWARM.enemy, point.x, point.y)
    }
    world.hud.message(MESSAGES.swarm)
  }
}
