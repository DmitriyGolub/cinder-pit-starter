import { InstancedMesh, Matrix4, NormalBlending, PlaneGeometry, ShaderMaterial } from 'three'
import { RENDER, SHADOW_SHADER, SHADOW_VIEW } from '../../../game/config/view'
import vertexShader from '../shaders/shadow/vertex.glsl?raw'
import fragmentShader from '../shaders/shadow/fragment.glsl?raw'

const SHADOW_STRIDE = 4

interface Shadows {
  readonly mesh: InstancedMesh
  set(points: number[]): void
}

export function createShadows(): Shadows {
  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      strength: { value: SHADOW_SHADER.strength },
      softness: { value: SHADOW_SHADER.softness },
      fogNear: { value: RENDER.fogNear },
      fogFar: { value: RENDER.fogFar },
    },
    transparent: true,
    blending: NormalBlending,
    depthWrite: false,
  })
  const mesh = new InstancedMesh(new PlaneGeometry(2, 2).rotateX(-Math.PI / 2), material, SHADOW_VIEW.max)
  mesh.frustumCulled = false
  mesh.count = 0
  const matrix = new Matrix4()
  return {
    mesh,
    set(points) {
      const count = Math.min(SHADOW_VIEW.max, Math.floor(points.length / SHADOW_STRIDE))
      for (let i = 0; i < count; i++) {
        const offset = i * SHADOW_STRIDE
        const radius = points[offset + 3]
        mesh.setMatrixAt(i, matrix.makeScale(radius, 1, radius).setPosition(points[offset], points[offset + 2] + SHADOW_VIEW.lift, points[offset + 1]))
      }
      mesh.count = count
      mesh.instanceMatrix.needsUpdate = true
    },
  }
}
