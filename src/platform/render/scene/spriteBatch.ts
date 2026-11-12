import {
  Color, DynamicDrawUsage, InstancedBufferAttribute, InstancedBufferGeometry, Float32BufferAttribute, Mesh, ShaderMaterial,
  Vector3, type Camera,
} from 'three'
import { RENDER, SPRITE_SHADER } from '../../../game/config/view'
import type { SpriteDrawer } from '../../../game/ecs/ports'
import { getSprite, getSpriteAtlas, hasSprite } from '../../assets'
import vertexShader from '../shaders/sprite/vertex.glsl?raw'
import fragmentShader from '../shaders/sprite/fragment.glsl?raw'

interface SpriteBatch extends SpriteDrawer {
  readonly mesh: Mesh<InstancedBufferGeometry, ShaderMaterial>
}

const QUAD = [0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0]

export function createSpriteBatch(fog: Color, camera: Camera): SpriteBatch {
  const capacity = RENDER.spritesMax
  const geometry = new InstancedBufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(QUAD, 3))
  geometry.setIndex([0, 1, 2, 0, 2, 3])
  const createAttribute = (size: number) => new InstancedBufferAttribute(new Float32Array(capacity * size), size).setUsage(DynamicDrawUsage)
  const positions = createAttribute(3)
  const rects = createAttribute(4)
  const uvs = createAttribute(4)
  const lights = createAttribute(1)
  const tints = createAttribute(4)
  const rotations = createAttribute(1)
  const attributes = [positions, rects, uvs, lights, tints, rotations]
  geometry.setAttribute('instancePosition', positions)
  geometry.setAttribute('instanceRect', rects)
  geometry.setAttribute('instanceUv', uvs)
  geometry.setAttribute('instanceLight', lights)
  geometry.setAttribute('instanceTint', tints)
  geometry.setAttribute('instanceRotation', rotations)

  const cameraRight = new Vector3(1, 0, 0)
  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      map: { value: getSpriteAtlas() },
      cameraRight: { value: cameraRight },
      fogColor: { value: fog },
      fogNear: { value: RENDER.fogNear },
      fogFar: { value: RENDER.fogFar },
      alphaCutoff: { value: SPRITE_SHADER.alphaCutoff },
      tintGain: { value: SPRITE_SHADER.tintGain },
      luma: { value: SPRITE_SHADER.luma },
    },
  })
  const mesh = new Mesh(geometry, material)
  mesh.frustumCulled = false
  const tintColor = new Color()
  let count = 0

  return {
    mesh,
    has: hasSprite,
    begin() {
      count = 0
      cameraRight.setFromMatrixColumn(camera.matrixWorld, 0).setY(0).normalize()
    },
    add(frameName, x, y, z, scale, light, tint, flip, squash, rotation) {
      if (count >= capacity) return
      const frame = getSprite(frameName)
      const index = count++
      const size = RENDER.spriteScale * scale
      positions.setXYZ(index, x, z, y)
      rects.setXYZW(index, -(flip ? frame.width - frame.originX : frame.originX) * size * squash, (frame.originY - frame.height) * size, frame.width * size * squash, frame.height * size)
      if (flip) uvs.setXYZW(index, frame.u + frame.uvWidth, frame.v, -frame.uvWidth, frame.uvHeight)
      else uvs.setXYZW(index, frame.u, frame.v, frame.uvWidth, frame.uvHeight)
      lights.setX(index, light)
      rotations.setX(index, rotation)
      if (tint) tints.setXYZW(index, tintColor.setHex(tint).r, tintColor.g, tintColor.b, 1)
      else tints.setXYZW(index, 0, 0, 0, 0)
    },
    end() {
      geometry.instanceCount = count
      for (const attribute of attributes) {
        attribute.clearUpdateRanges()
        attribute.addUpdateRange(0, count * attribute.itemSize)
        attribute.needsUpdate = true
      }
    },
  }
}
