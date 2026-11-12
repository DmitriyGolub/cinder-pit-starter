import { PlaneGeometry } from 'three'
import { WEAPON_GLOW } from '../../../game/config/loot'
import { HAZE_SHADER } from '../../../game/config/view'
import { createInstancedEffects, effectMaterial, type Place } from './instancedEffects'
import vertexShader from '../shaders/haze/vertex.glsl?raw'
import fragmentShader from '../shaders/haze/fragment.glsl?raw'

const place: Place = (matrix, x, y, z) => matrix.makeTranslation(x, z + WEAPON_GLOW.float - WEAPON_GLOW.hazeDrop, y)

export function createHaze() {
  const material = effectMaterial(vertexShader, fragmentShader, HAZE_SHADER, { size: { value: WEAPON_GLOW.haze } })
  return createInstancedEffects(new PlaneGeometry(1, 1), material, WEAPON_GLOW.max, place)
}
