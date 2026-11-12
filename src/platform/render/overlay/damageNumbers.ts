import { Vector3, type Camera } from 'three'
import { STATUS, type StatusId } from '../../../game/config/status'
import { NUMBERS, NUMBER_STYLE } from '../../../game/config/view'
import type { HitNumber } from '../../../game/ecs/events'
import type { OverlayLayer } from './overlayLayer'
import { toScreen } from './screen'

const NUMBER_DRAW = { stroke: '#000', slots: 3, cull: 1.1, fadeGain: 2.5, amountUnit: 100 }

interface FloatingNumber {
  position: Vector3
  amount: number
  style: number
  target: number
  age: number
  idle: number
  pop: number
}

interface NumberLook {
  size: number
  color: string
  suffix: string
}

function hexColor(tint: number): string {
  return `#${tint.toString(16).padStart(6, '0')}`
}

function numberLook(style: number): NumberLook {
  if (style === NUMBER_STYLE.crit) return NUMBERS.crit
  if (style >= NUMBER_STYLE.damageOverTime) return { ...NUMBERS.damageOverTime, color: hexColor(STATUS[(style - NUMBER_STYLE.damageOverTime) as StatusId].tint) }
  return NUMBERS.normal
}

export function createDamageNumbers(camera: Camera): OverlayLayer<HitNumber> {
  const numbers: FloatingNumber[] = []
  const projected = new Vector3()
  return {
    add(hit) {
      const same = numbers.find((floating) => floating.target === hit.target && floating.style === hit.style && floating.idle < NUMBERS.merge)
      if (same) {
        same.amount += hit.amount
        same.idle = 0
        same.pop = NUMBERS.pop
        return
      }
      if (numbers.length >= NUMBERS.max) numbers.shift()
      const near = numbers.filter((floating) => floating.target === hit.target).length
      const side = ((near % NUMBER_DRAW.slots) - 1) * NUMBERS.spread
      const up = hit.style === NUMBER_STYLE.crit ? NUMBERS.spread : hit.style >= NUMBER_STYLE.damageOverTime ? -NUMBERS.spread : 0
      numbers.push({ position: new Vector3(hit.x + side, hit.z + up, hit.y + side), amount: hit.amount, style: hit.style, target: hit.target, age: 0, idle: 0, pop: NUMBERS.pop })
    },
    draw(context, width, height, frame) {
      context.textAlign = 'center'
      context.lineWidth = NUMBERS.stroke
      context.strokeStyle = NUMBER_DRAW.stroke
      for (let i = numbers.length - 1; i >= 0; i--) {
        const floating = numbers[i]
        floating.age += frame.delta
        floating.idle += frame.delta
        floating.pop = Math.max(0, floating.pop - frame.delta)
        if (floating.idle > NUMBERS.life) {
          numbers.splice(i, 1)
          continue
        }
        projected.copy(floating.position)
        projected.y += Math.min(floating.age, NUMBERS.life) * NUMBERS.rise
        const screen = toScreen(projected, camera, width, height, NUMBER_DRAW.cull)
        if (!screen) continue
        const look = numberLook(floating.style)
        const grow = 1 + Math.min(NUMBERS.growMax, (floating.amount / NUMBER_DRAW.amountUnit) * NUMBERS.growPerHundred)
        const size = Math.round(look.size * grow * (1 + NUMBERS.popScale * (floating.pop / NUMBERS.pop)))
        context.globalAlpha = Math.min(1, NUMBER_DRAW.fadeGain * (1 - floating.idle / NUMBERS.life))
        context.font = `bold ${size}px ${NUMBERS.font}`
        context.fillStyle = look.color
        const screenX = Math.round(screen[0])
        const screenY = Math.round(screen[1])
        const text = `${Math.round(floating.amount)}${look.suffix}`
        context.strokeText(text, screenX, screenY)
        context.fillText(text, screenX, screenY)
      }
      context.globalAlpha = 1
    },
    clear() {
      numbers.length = 0
    },
  }
}
