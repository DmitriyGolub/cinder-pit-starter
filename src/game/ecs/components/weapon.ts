import { ENTITIES_MAX } from '../../config/engine'
import type { WeaponId } from '../../config/weapons'

export const Weapon = { kind: [] as WeaponId[], cooldown: new Float32Array(ENTITIES_MAX), sinceShot: new Float32Array(ENTITIES_MAX) }

export const NO_HIT = -1

export const Projectile = {
  source: new Int32Array(ENTITIES_MAX),
  damage: new Float32Array(ENTITIES_MAX),
  pierce: new Uint8Array(ENTITIES_MAX),
  splash: new Float32Array(ENTITIES_MAX),
  rise: new Float32Array(ENTITIES_MAX),
  lastHit: new Int32Array(ENTITIES_MAX).fill(NO_HIT),
  hit: [] as string[],
}

export const PlayerShot = {}
