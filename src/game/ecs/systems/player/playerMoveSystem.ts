import { Not } from 'bitecs'
import { Dead, Player, Rotation, Velocity } from '../../components'
import { PLAYER } from '../../../config/player'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const walkingPlayerQuery = defineQuery([Player, Rotation, Velocity, Not(Dead)])

function setWalk(world: GameWorld, player: number): void {
  const { moveX, moveY, walk } = world.input
  const length = Math.hypot(moveX, moveY)
  const speed = length > 0 ? PLAYER.speed * (walk ? PLAYER.walkFactor : 1) / Math.max(1, length) : 0
  const forwardX = Math.cos(Rotation.yaw[player])
  const forwardY = Math.sin(Rotation.yaw[player])
  Player.walkX[player] = (forwardX * moveY - forwardY * moveX) * speed
  Player.walkY[player] = (forwardY * moveY + forwardX * moveX) * speed
}

export function playerMoveSystem(world: GameWorld): void {
  const blend = Math.min(1, PLAYER.acceleration * world.time.delta)
  for (const player of walkingPlayerQuery(world)) {
    setWalk(world, player)
    Velocity.x[player] += (Player.walkX[player] - Velocity.x[player]) * blend
    Velocity.y[player] += (Player.walkY[player] - Velocity.y[player]) * blend
  }
}
