import { ENTITIES_MAX } from '../../config/engine'

export const Sprite = {
  frame: [] as string[],
  scale: new Float32Array(ENTITIES_MAX),
  phase: new Float32Array(ENTITIES_MAX),
  rotation: new Float32Array(ENTITIES_MAX),
  squash: new Float32Array(ENTITIES_MAX),
  tint: new Uint32Array(ENTITIES_MAX),
  flip: new Uint8Array(ENTITIES_MAX),
  bright: new Uint8Array(ENTITIES_MAX),
}

export const Animation = { base: [] as string[], frames: new Uint8Array(ENTITIES_MAX), fps: new Float32Array(ENTITIES_MAX), start: new Float32Array(ENTITIES_MAX), loop: new Uint8Array(ENTITIES_MAX) }

export const Heading = { yaw: new Float32Array(ENTITIES_MAX) }

export const Directional = { sprite: [] as string[] }

export const Spin = { rate: new Float32Array(ENTITIES_MAX), phase: new Float32Array(ENTITIES_MAX) }

export const Roll = { speed: new Float32Array(ENTITIES_MAX) }
