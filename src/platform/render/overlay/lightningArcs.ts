import { Vector3, type Camera } from 'three'
import { LIGHTNING } from '../../../game/config/view'
import type { OverlayLayer } from './overlayLayer'
import { toScreen } from './screen'

const POINT_STRIDE = 3

interface LightningArc {
  points: Vector3[]
  age: number
}

function jaggedPath(from: [number, number], to: [number, number]): number[] {
  const deltaX = to[0] - from[0]
  const deltaY = to[1] - from[1]
  const length = Math.hypot(deltaX, deltaY)
  const normalX = -deltaY / (length || 1)
  const normalY = deltaX / (length || 1)
  const path = [from[0], from[1]]
  for (let segment = 1; segment < LIGHTNING.segments; segment++) {
    const progress = segment / LIGHTNING.segments
    const offset = (Math.random() - 0.5) * length * LIGHTNING.jaggedness
    path.push(from[0] + deltaX * progress + normalX * offset, from[1] + deltaY * progress + normalY * offset)
  }
  path.push(to[0], to[1])
  return path
}

export function createLightningArcs(camera: Camera): OverlayLayer<number[]> {
  const arcs: LightningArc[] = []
  return {
    add(worldPoints) {
      const points: Vector3[] = []
      for (let i = 0; i + 2 < worldPoints.length; i += POINT_STRIDE) points.push(new Vector3(worldPoints[i], worldPoints[i + 2], worldPoints[i + 1]))
      if (points.length > 1) arcs.push({ points, age: 0 })
    },
    draw(context, width, height, frame) {
      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i]
        arc.age += frame.delta
        if (arc.age > LIGHTNING.life) {
          arcs.splice(i, 1)
          continue
        }
        const screen = arc.points.map((point) => toScreen(point, camera, width, height))
        const paths: number[][] = []
        for (let segment = 1; segment < screen.length; segment++) {
          const previous = screen[segment - 1]
          const point = screen[segment]
          if (previous && point) paths.push(jaggedPath(previous, point))
        }
        context.globalAlpha = 1 - arc.age / LIGHTNING.life
        for (const [lineWidth, color] of [[LIGHTNING.glow, LIGHTNING.glowColor], [LIGHTNING.core, LIGHTNING.coreColor]] as const) {
          context.lineWidth = lineWidth
          context.strokeStyle = color
          context.beginPath()
          for (const path of paths) {
            context.moveTo(path[0], path[1])
            for (let point = 2; point < path.length; point += 2) context.lineTo(path[point], path[point + 1])
          }
          context.stroke()
        }
      }
      context.globalAlpha = 1
    },
    clear() {
      arcs.length = 0
    },
  }
}
