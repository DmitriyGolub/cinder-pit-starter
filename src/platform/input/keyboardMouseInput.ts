import { KEYS, LOOK_SENSITIVITY } from '../../game/config/controls'
import type { InputDevice } from './InputDevice'

export function createKeyboardMouseInput(element: HTMLElement): InputDevice {
  const down = new Set<string>()
  const pressed = new Set<string>()
  let mouseDeltaX = 0
  let mouseDown = false
  const isDown = (code: string) => down.has(code)
  const axis = (plus: string[], minus: string[]) => (plus.some(isDown) ? 1 : 0) - (minus.some(isDown) ? 1 : 0)

  const device: InputDevice = {
    get moveX() { return axis(KEYS.right, KEYS.left) },
    get moveY() { return axis(KEYS.forward, KEYS.back) },
    get turn() { return axis(KEYS.turnRight, KEYS.turnLeft) },
    get lookX() { return mouseDeltaX * LOOK_SENSITIVITY.mouse },
    get fire() { return mouseDown },
    get walk() { return isDown(KEYS.walk) },
    locked: false,
    onLockChange: null,
    wasPressed: (code) => pressed.has(code),
    requestLock() {
      const request = element.requestPointerLock() as unknown
      if (request instanceof Promise) request.catch(() => {})
    },
    exitLock() {
      if (document.pointerLockElement) document.exitPointerLock()
    },
    endFrame() {
      pressed.clear()
      mouseDeltaX = 0
    },
    dispose() {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('wheel', onWheel)
      document.removeEventListener('pointerlockchange', onLockChange)
      device.exitLock()
    },
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.code === KEYS.noScroll || event.code.startsWith(KEYS.arrowPrefix)) event.preventDefault()
    if (!event.repeat) pressed.add(event.code)
    down.add(event.code)
  }
  const onKeyUp = (event: KeyboardEvent) => {
    down.delete(event.code)
  }
  const onBlur = () => {
    down.clear()
    mouseDown = false
  }
  const onMouseMove = (event: MouseEvent) => {
    if (device.locked) mouseDeltaX += event.movementX
  }
  const onMouseDown = (event: MouseEvent) => {
    if (device.locked && event.button === 0) mouseDown = true
  }
  const onMouseUp = (event: MouseEvent) => {
    if (event.button === 0) mouseDown = false
  }
  const onWheel = (event: WheelEvent) => {
    if (device.locked) pressed.add(event.deltaY > 0 ? KEYS.wheelDown : KEYS.wheelUp)
  }
  const onLockChange = () => {
    device.locked = document.pointerLockElement === element
    mouseDown = false
    device.onLockChange?.(device.locked)
  }

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', onBlur)
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mousedown', onMouseDown)
  document.addEventListener('mouseup', onMouseUp)
  document.addEventListener('wheel', onWheel, { passive: true })
  document.addEventListener('pointerlockchange', onLockChange)
  return device
}
