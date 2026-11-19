import { Not } from 'bitecs'
import { Dead, Enemy, Player, Position, Rotation } from '../../components'
import { INDICATORS } from '../../../config/view'
import { wrapAngle } from '../../../math/angle'
import type { Indicator } from '../../ports'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const viewerQuery = defineQuery([Player, Position, Rotation])
const threatQuery = defineQuery([Enemy, Position, Not(Dead)])

function indicators(world: GameWorld, viewer: number): Indicator[] {
  const hidden = world.render.view.halfHorizontalFov * INDICATORS.fovMargin
  const found: Indicator[] = []
  for (const enemy of threatQuery(world)) {
    const deltaX = Position.x[enemy] - Position.x[viewer]
    const deltaY = Position.y[enemy] - Position.y[viewer]
    const distance = Math.hypot(deltaX, deltaY)
    const angle = wrapAngle(Math.atan2(deltaY, deltaX) - Rotation.yaw[viewer])
    if (distance > INDICATORS.range || Math.abs(angle) < hidden) continue
    found.push({ angle, alpha: INDICATORS.alphaMin + INDICATORS.alphaRange * (1 - distance / INDICATORS.range), elite: false })
  }
  return found.sort((first, second) => second.alpha - first.alpha).slice(0, INDICATORS.max)
}

export function overlaySystem(world: GameWorld): void {
  const { overlay } = world.render
  for (const angle of world.events.hurtFrom) overlay.addHurt(angle)
  for (const viewer of viewerQuery(world)) {
    overlay.draw({ delta: world.time.delta, facing: Rotation.yaw[viewer], indicators: indicators(world, viewer) })
  }
}
