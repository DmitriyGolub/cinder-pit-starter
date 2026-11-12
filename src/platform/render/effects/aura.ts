import { Color, Mesh, PlaneGeometry } from 'three'
import { AURA_SHADER, AURA_VIEW } from '../../../game/config/view'
import { effectMaterial } from './instancedEffects'
import vertexShader from '../shaders/aura/vertex.glsl?raw'
import fragmentShader from '../shaders/aura/fragment.glsl?raw'

export function createAura() {
  const material = effectMaterial(vertexShader, fragmentShader, AURA_SHADER, { color: { value: new Color() }, pulse: { value: -1 } })
  const mesh = new Mesh(new PlaneGeometry(2, 2).rotateX(-Math.PI / 2), material)
  let pulseAt = -Infinity

  const set = (x: number, y: number, z: number, radius: number, color: number, pulse: boolean, time: number) => {
    mesh.visible = radius > 0
    if (!mesh.visible) return
    if (pulse) pulseAt = time
    const progress = (time - pulseAt) / AURA_VIEW.pulseTime
    material.uniforms.time.value = time
    material.uniforms.pulse.value = progress < 1 ? progress : -1
    material.uniforms.color.value.setHex(color)
    mesh.position.set(x, z + AURA_VIEW.lift, y)
    mesh.scale.setScalar(radius)
  }
  return { mesh, set }
}
