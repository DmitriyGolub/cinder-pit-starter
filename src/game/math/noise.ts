const PRIME = { x: 0x27d4eb2d, y: 0x165667b1, mixA: 0x85ebca6b, mixB: 0xc2b2ae35 }
const UINT_RANGE = 4294967296

function hash(seed: number, x: number, y: number): number {
  let mixed = Math.imul(x, PRIME.x) ^ Math.imul(y, PRIME.y) ^ seed
  mixed = Math.imul(mixed ^ (mixed >>> 15), PRIME.mixA)
  mixed = Math.imul(mixed ^ (mixed >>> 13), PRIME.mixB)
  return ((mixed ^ (mixed >>> 16)) >>> 0) / UINT_RANGE
}

const smooth = (t: number) => t * t * (3 - 2 * t)

export function valueNoise(seed: number, x: number, y: number): number {
  const left = Math.floor(x)
  const top = Math.floor(y)
  const blendX = smooth(x - left)
  const blendY = smooth(y - top)
  const upper = hash(seed, left, top) + (hash(seed, left + 1, top) - hash(seed, left, top)) * blendX
  const lower = hash(seed, left, top + 1) + (hash(seed, left + 1, top + 1) - hash(seed, left, top + 1)) * blendX
  return upper + (lower - upper) * blendY
}
