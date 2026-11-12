import { ENTITIES_MAX } from '../../config/engine'

export const Health = { hp: new Float32Array(ENTITIES_MAX), max: new Float32Array(ENTITIES_MAX) }

export const Side = { Player: 0, Enemy: 1, Neutral: 2, None: 255 } as const

export const Faction = { side: new Uint8Array(ENTITIES_MAX) }
