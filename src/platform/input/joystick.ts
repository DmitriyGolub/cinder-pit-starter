import { STICK } from '../../game/config/controls'

interface Joystick {
  readonly x: number
  readonly y: number
  readonly pointerId: number
  grab(pointerId: number, pointerX: number, pointerY: number): void
  move(pointerX: number, pointerY: number): void
  release(): void
  show(visible: boolean): void
  dispose(): void
}

const NO_POINTER = -1

export function createJoystick(parent: HTMLElement): Joystick {
  const base = document.createElement('div')
  const knob = document.createElement('div')
  base.className = 'stick'
  knob.className = 'stick-knob'
  base.appendChild(knob)
  parent.appendChild(base)
  let x = 0
  let y = 0
  let pointerId = NO_POINTER
  let anchorX = 0
  let anchorY = 0

  const placeAtRest = () => {
    base.style.left = `${STICK.rest[0] * 100}%`
    base.style.top = `${STICK.rest[1] * 100}%`
    base.style.transform = ''
    knob.style.transform = ''
  }
  const placeAtAnchor = (deltaX: number, deltaY: number) => {
    base.style.left = base.style.top = '0'
    base.style.transform = `translate(${anchorX}px, ${anchorY}px)`
    knob.style.transform = `translate(${deltaX}px, ${deltaY}px)`
  }

  const joystick: Joystick = {
    get x() { return x },
    get y() { return y },
    get pointerId() { return pointerId },
    grab(id, pointerX, pointerY) {
      pointerId = id
      anchorX = pointerX
      anchorY = pointerY
      base.classList.add('active')
      joystick.move(pointerX, pointerY)
    },
    move(pointerX, pointerY) {
      const radius = STICK.radius
      let deltaX = pointerX - anchorX
      let deltaY = pointerY - anchorY
      const length = Math.hypot(deltaX, deltaY)
      if (length > radius) {
        deltaX = (deltaX / length) * radius
        deltaY = (deltaY / length) * radius
      }
      const strength = Math.min(1, length / radius)
      const scale = strength < STICK.deadZone ? 0 : (strength - STICK.deadZone) / (1 - STICK.deadZone) / (strength || 1)
      x = (deltaX / radius) * scale
      y = (-deltaY / radius) * scale
      placeAtAnchor(deltaX, deltaY)
    },
    release() {
      pointerId = NO_POINTER
      x = y = 0
      base.classList.remove('active')
      placeAtRest()
    },
    show(visible) {
      base.style.display = visible ? '' : 'none'
    },
    dispose() {
      base.remove()
    },
  }
  placeAtRest()
  return joystick
}
