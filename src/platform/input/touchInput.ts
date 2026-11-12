import { STICK, LOOK_SENSITIVITY } from '../../game/config/controls'
import type { InputDevice } from './InputDevice'
import { createJoystick } from './joystick'

const NO_POINTER = -1

export function createTouchInput(element: HTMLElement): InputDevice {
  const parent = element.parentElement!
  const stick = createJoystick(parent)
  const pauseButton = document.createElement('button')
  let lookPointer = NO_POINTER
  let lookLastX = 0
  let lookDeltaX = 0

  const show = () => {
    stick.show(device.locked)
    pauseButton.style.display = device.locked ? '' : 'none'
  }
  const setLocked = (locked: boolean) => {
    if (device.locked === locked) return
    device.locked = locked
    stick.release()
    lookPointer = NO_POINTER
    show()
    device.onLockChange?.(locked)
  }

  const device: InputDevice = {
    get moveX() { return stick.x },
    get moveY() { return stick.y },
    turn: 0,
    get lookX() { return lookDeltaX * LOOK_SENSITIVITY.touch },
    get fire() { return device.locked },
    walk: false,
    locked: false,
    onLockChange: null,
    wasPressed: () => false,
    requestLock: () => setLocked(true),
    exitLock: () => setLocked(false),
    endFrame() {
      lookDeltaX = 0
    },
    dispose() {
      element.removeEventListener('pointerdown', onPointerDown)
      element.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerup', onPointerUp)
      element.removeEventListener('pointercancel', onPointerUp)
      stick.dispose()
      pauseButton.remove()
    },
  }

  const onPointerDown = (event: PointerEvent) => {
    if (!device.locked) return
    event.preventDefault()
    element.setPointerCapture(event.pointerId)
    const stickSide = event.offsetX > element.clientWidth * (1 - STICK.zone)
    if (stickSide && stick.pointerId === NO_POINTER) stick.grab(event.pointerId, event.offsetX, event.offsetY)
    else if (!stickSide && lookPointer === NO_POINTER) {
      lookPointer = event.pointerId
      lookLastX = event.offsetX
    }
  }
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerId === stick.pointerId) stick.move(event.offsetX, event.offsetY)
    if (event.pointerId !== lookPointer) return
    lookDeltaX += event.offsetX - lookLastX
    lookLastX = event.offsetX
  }
  const onPointerUp = (event: PointerEvent) => {
    if (event.pointerId === stick.pointerId) stick.release()
    if (event.pointerId === lookPointer) lookPointer = NO_POINTER
  }
  const onPause = (event: MouseEvent) => {
    event.stopPropagation()
    device.exitLock()
  }

  pauseButton.className = 'touch-pause'
  pauseButton.textContent = 'II'
  parent.appendChild(pauseButton)
  pauseButton.addEventListener('click', onPause)
  element.style.touchAction = 'none'
  element.addEventListener('pointerdown', onPointerDown)
  element.addEventListener('pointermove', onPointerMove)
  element.addEventListener('pointerup', onPointerUp)
  element.addEventListener('pointercancel', onPointerUp)
  show()
  return device
}
