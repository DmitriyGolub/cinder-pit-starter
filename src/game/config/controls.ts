export const LOOK_SENSITIVITY = { mouse: 0.0024, touch: 0.0065 }

export const STICK = { radius: 64, deadZone: 0.12, zone: 0.45, rest: [0.84, 0.78] as const }

export const KEYS = {
  right: ['KeyD'],
  left: ['KeyA'],
  forward: ['KeyW', 'ArrowUp'],
  back: ['KeyS', 'ArrowDown'],
  turnRight: ['ArrowRight'],
  turnLeft: ['ArrowLeft'],
  walk: 'ShiftLeft',
  wheelDown: 'WheelDown',
  wheelUp: 'WheelUp',
  noScroll: 'Space',
  arrowPrefix: 'Arrow',
  choices: ['Digit1', 'Digit2', 'Digit3', 'Digit4'],
  reroll: 'KeyR',
}
