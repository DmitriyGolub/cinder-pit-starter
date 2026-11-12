import { ENTITIES_MAX } from '../../config/engine'

export const Position = { x: new Float32Array(ENTITIES_MAX), y: new Float32Array(ENTITIES_MAX), z: new Float32Array(ENTITIES_MAX) }

export const Velocity = { x: new Float32Array(ENTITIES_MAX), y: new Float32Array(ENTITIES_MAX), z: new Float32Array(ENTITIES_MAX) }

export const Rotation = { yaw: new Float32Array(ENTITIES_MAX) }
