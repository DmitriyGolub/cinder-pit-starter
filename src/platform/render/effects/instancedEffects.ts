import { AdditiveBlending, Color, InstancedMesh, Matrix4, ShaderMaterial, type BufferGeometry, type IUniform } from 'three'

const EFFECT_STRIDE = 4

type Tunables = Record<string, number>

export type Place = (matrix: Matrix4, x: number, y: number, z: number) => Matrix4

export function effectMaterial(vertexShader: string, fragmentShader: string, tunables: Tunables, extraUniforms: Record<string, IUniform> = {}): ShaderMaterial {
  const uniforms: Record<string, IUniform> = { time: { value: 0 }, ...extraUniforms }
  for (const [key, uniformValue] of Object.entries(tunables)) uniforms[key] = { value: uniformValue }
  return new ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, blending: AdditiveBlending, depthWrite: false })
}

export function createInstancedEffects(geometry: BufferGeometry, material: ShaderMaterial, max: number, place: Place) {
  const mesh = new InstancedMesh(geometry, material, max)
  mesh.frustumCulled = false
  mesh.count = 0
  const matrix = new Matrix4()
  const color = new Color()
  mesh.setColorAt(0, color)

  const set = (points: number[], time: number) => {
    material.uniforms.time.value = time
    const count = Math.min(max, Math.floor(points.length / EFFECT_STRIDE))
    for (let i = 0; i < count; i++) {
      const offset = i * EFFECT_STRIDE
      mesh.setMatrixAt(i, place(matrix, points[offset], points[offset + 1], points[offset + 2]))
      mesh.setColorAt(i, color.setHex(points[offset + 3]))
    }
    mesh.count = count
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }
  return { mesh, set }
}
