import type { Camera } from 'three'
import type { OverlayDrawer } from '../../../game/ecs/ports'
import { createDamageNumbers } from './damageNumbers'
import { createHitConfirm } from './hitConfirm'
import { createHurtArcs } from './hurtArcs'
import { drawIndicators } from './indicators'
import { createLightningArcs } from './lightningArcs'
import { createStatusProcs } from './statusProcs'

interface Overlay extends OverlayDrawer {
  dispose(): void
}

export function createOverlay(canvas: HTMLCanvasElement, camera: Camera): Overlay {
  const context = canvas.getContext('2d')!
  const lightningArcs = createLightningArcs(camera)
  const hurtArcs = createHurtArcs()
  const damageNumbers = createDamageNumbers(camera)
  const statusProcs = createStatusProcs(camera)
  const hitConfirm = createHitConfirm()
  const layers = [lightningArcs, hurtArcs, damageNumbers, statusProcs, hitConfirm]
  return {
    addNumber: damageNumbers.add,
    addHurt: hurtArcs.add,
    addLightning: lightningArcs.add,
    addProc: statusProcs.add,
    addConfirm: hitConfirm.add,
    draw(frame) {
      drawIndicators(context, canvas.width, canvas.height, frame.indicators)
      for (const layer of layers) layer.draw(context, canvas.width, canvas.height, frame)
    },
    dispose() {
      for (const layer of layers) layer.clear()
      canvas.remove()
    },
  }
}
