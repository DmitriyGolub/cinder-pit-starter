import { ENTITIES_MAX } from '../../config/engine'

export const Player = { invulnerabilityTime: new Float32Array(ENTITIES_MAX), walkX: new Float32Array(ENTITIES_MAX), walkY: new Float32Array(ENTITIES_MAX) }

export const Dead = {}

export const ViewRig = { height: new Float32Array(ENTITIES_MAX), bob: new Float32Array(ENTITIES_MAX), kick: new Float32Array(ENTITIES_MAX), shake: new Float32Array(ENTITIES_MAX) }
