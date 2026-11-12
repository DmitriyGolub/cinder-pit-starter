import { PlaneGeometry } from 'three'
import { WEAPON_GLOW } from '../../../game/config/loot'
import { GLOW_SHADER } from '../../../game/config/view'
import { createInstancedEffects, effectMaterial, type Place } from './instancedEffects'
import vertexShader from '../shaders/glow/vertex.glsl?raw'
import fragmentShader from '../shaders/glow/fragment.glsl?raw'

const place: Place = (matrix, x, y, z) => matrix.makeScale(WEAPON_GLOW.radius, 1, WEAPON_GLOW.radius).setPosition(x, z + WEAPON_GLOW.lift, y)

export function createGlows() {
  const material = effectMaterial(vertexShader, fragmentShader, GLOW_SHADER)
  return createInstancedEffects(new PlaneGeometry(2, 2).rotateX(-Math.PI / 2), material, WEAPON_GLOW.max, place)
}
