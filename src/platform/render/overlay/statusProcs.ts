import { Vector3, type Camera } from 'three'
import { getIconImage } from '../../assets'
import { PROCS } from '../../../game/config/view'
import type { StatusProc } from '../../../game/ecs/events'
import type { OverlayLayer } from './overlayLayer'
import { toScreen } from './screen'

interface FloatingProc {
  position: Vector3
  icon: string
  target: number
  age: number
  pop: number
}

const PROC_CULL = 1.1

export function createStatusProcs(camera: Camera): OverlayLayer<StatusProc> {
  const procs: FloatingProc[] = []
  const projected = new Vector3()
  return {
    add(proc) {
      const same = procs.find((floating) => floating.target === proc.target && floating.icon === proc.icon && floating.age < PROCS.merge)
      if (same) {
        same.pop = PROCS.pop
        return
      }
      if (procs.length >= PROCS.max) procs.shift()
      const side = (procs.filter((floating) => floating.target === proc.target).length % PROCS.slots) * PROCS.spread
      procs.push({ position: new Vector3(proc.x + side, proc.z + PROCS.lift, proc.y), icon: proc.icon, target: proc.target, age: 0, pop: PROCS.pop })
    },
    draw(context, width, height, frame) {
      context.imageSmoothingEnabled = false
      for (let i = procs.length - 1; i >= 0; i--) {
        const floating = procs[i]
        floating.age += frame.delta
        floating.pop = Math.max(0, floating.pop - frame.delta)
        if (floating.age > PROCS.life) {
          procs.splice(i, 1)
          continue
        }
        projected.copy(floating.position)
        projected.y += floating.age * PROCS.rise
        const screen = toScreen(projected, camera, width, height, PROC_CULL)
        const icon = getIconImage(floating.icon)
        if (!screen || !icon) continue
        const size = Math.round(PROCS.size * (1 + PROCS.popScale * (floating.pop / PROCS.pop)))
        context.globalAlpha = Math.min(1, PROCS.fadeGain * (1 - floating.age / PROCS.life))
        context.drawImage(icon, Math.round(screen[0] - size / 2), Math.round(screen[1] - size / 2), size, size)
      }
      context.globalAlpha = 1
    },
    clear() {
      procs.length = 0
    },
  }
}
