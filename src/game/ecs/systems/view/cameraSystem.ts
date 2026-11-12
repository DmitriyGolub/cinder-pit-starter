import { Not } from 'bitecs'
import { Dead, Player, Position, Rotation, Velocity, ViewRig } from '../../components'
import { PLAYER } from '../../../config/player'
import { CAMERA, IMPACT } from '../../../config/view'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const livingPlayerQuery = defineQuery([Player, Position, Rotation, Velocity, ViewRig, Not(Dead)])
const deadPlayerQuery = defineQuery([Player, Position, Rotation, Velocity, ViewRig, Dead])
const PLAYER_STATES = [[livingPlayerQuery, false], [deadPlayerQuery, true]] as const

function followHeight(player: number, delta: number): void {
  ViewRig.height[player] += (Position.z[player] - ViewRig.height[player]) * Math.min(1, delta * CAMERA.heightLerp)
}

function eyeHeight(player: number, delta: number, dead: boolean): number {
  const speed = Math.hypot(Velocity.x[player], Velocity.y[player])
  ViewRig.bob[player] += delta * speed * CAMERA.bobRate
  if (dead) return CAMERA.deadEye
  return PLAYER.eye + Math.sin(ViewRig.bob[player] * CAMERA.bobFrequency) * CAMERA.bobHeight * Math.min(1, speed / PLAYER.speed)
}

function updateShake(world: GameWorld, player: number): number {
  if (world.events.impact > 0) ViewRig.shake[player] = Math.max(ViewRig.shake[player], IMPACT.shake * world.events.impact)
  ViewRig.shake[player] *= Math.exp(-IMPACT.shakeDecay * world.time.delta)
  return ViewRig.shake[player]
}

function shakeOffset(elapsed: number, shake: number) {
  const phase = elapsed * IMPACT.shakeFrequency
  return {
    x: Math.sin(phase * IMPACT.shakePhaseX) * shake,
    y: Math.cos(phase * IMPACT.shakePhaseY) * shake,
    z: Math.sin(phase * IMPACT.shakePhaseZ) * shake * IMPACT.shakeVerticalScale,
  }
}

export function cameraSystem(world: GameWorld): void {
  const delta = world.time.delta
  for (const [playerQuery, dead] of PLAYER_STATES) {
    for (const player of playerQuery(world)) {
      followHeight(player, delta)
      const eye = eyeHeight(player, delta, dead)
      const shake = shakeOffset(world.time.elapsed, updateShake(world, player))
      world.render.setCamera(
        Position.x[player] + shake.x,
        Position.y[player] + shake.y,
        ViewRig.height[player] + eye + shake.z,
        Rotation.yaw[player],
      )
    }
  }
}
