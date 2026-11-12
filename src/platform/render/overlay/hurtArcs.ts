import { HURT_ARC } from '../../../game/config/view'
import type { OverlayLayer } from './overlayLayer'

const HURT_STYLE = { color: '230, 30, 20', alpha: 0.75 }

interface HurtArc {
  angle: number
  age: number
}

export function createHurtArcs(): OverlayLayer<number> {
  const arcs: HurtArc[] = []
  return {
    add(worldAngle) {
      arcs.push({ angle: worldAngle, age: 0 })
    },
    draw(context, width, height, frame) {
      const radius = Math.min(width, height) * HURT_ARC.radius
      context.lineWidth = HURT_ARC.width
      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i]
        arc.age += frame.delta
        if (arc.age > HURT_ARC.life) {
          arcs.splice(i, 1)
          continue
        }
        const screenAngle = arc.angle - frame.facing - Math.PI / 2
        context.strokeStyle = `rgba(${HURT_STYLE.color}, ${HURT_STYLE.alpha * (1 - arc.age / HURT_ARC.life)})`
        context.beginPath()
        context.arc(width / 2, height / 2, radius, screenAngle - HURT_ARC.spread, screenAngle + HURT_ARC.spread)
        context.stroke()
      }
    },
    clear() {
      arcs.length = 0
    },
  }
}
