import { ENTITIES_MAX } from '../../config/engine'

export const NO_TARGET = -1

export const Enemy = { sprite: [] as string[], timer: new Float32Array(ENTITIES_MAX), speed: new Float32Array(ENTITIES_MAX), damage: new Float32Array(ENTITIES_MAX) }

export const Target = { entity: new Int32Array(ENTITIES_MAX).fill(NO_TARGET) }

export const Knockback = { x: new Float32Array(ENTITIES_MAX), y: new Float32Array(ENTITIES_MAX) }

export const Hover = { lift: new Float32Array(ENTITIES_MAX), phase: new Float32Array(ENTITIES_MAX) }
