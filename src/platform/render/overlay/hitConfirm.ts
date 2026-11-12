import { CONFIRM_LIFE } from '../../../game/config/view'
import type { OverlayLayer } from './overlayLayer'

const CONFIRM_STYLE = {
  color: '255, 240, 200',
  critColor: '255, 200, 40',
  width: 2,
  critWidth: 3,
  inner: 6,
  outer: 12,
  critOuter: 15,
  corners: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
}

export function createHitConfirm(): OverlayLayer<boolean> {
  let remaining = 0
  let crit = false
  return {
    add(isCrit) {
      remaining = CONFIRM_LIFE
      crit = isCrit
    },
    draw(context, width, height, frame) {
      remaining = Math.max(0, remaining - frame.delta)
      if (remaining <= 0) return
      const centerX = width / 2
      const centerY = height / 2
      const outer = crit ? CONFIRM_STYLE.critOuter : CONFIRM_STYLE.outer
      context.strokeStyle = `rgba(${crit ? CONFIRM_STYLE.critColor : CONFIRM_STYLE.color}, ${remaining / CONFIRM_LIFE})`
      context.lineWidth = crit ? CONFIRM_STYLE.critWidth : CONFIRM_STYLE.width
      context.beginPath()
      for (const [directionX, directionY] of CONFIRM_STYLE.corners) {
        context.moveTo(centerX + directionX * CONFIRM_STYLE.inner, centerY + directionY * CONFIRM_STYLE.inner)
        context.lineTo(centerX + directionX * outer, centerY + directionY * outer)
      }
      context.stroke()
    },
    clear() {
      remaining = 0
    },
  }
}
