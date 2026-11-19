import { Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, Scene, type Texture, type WebGLRenderer } from 'three'
import { VIEW_SCREEN } from '../../../game/config/view'
import { getSprite, getSpriteAtlas } from '../../assets'

export function createViewModel() {
  const scene = new Scene()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, VIEW_SCREEN.far)
  const weapon = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ alphaTest: VIEW_SCREEN.alphaCutoff }))
  weapon.position.z = -VIEW_SCREEN.depth
  weapon.visible = false
  scene.add(weapon)
  const textures = new Map<string, Texture>()

  const textureOf = (name: string) => {
    let texture = textures.get(name)
    if (!texture) {
      const frame = getSprite(name)
      texture = getSpriteAtlas().clone()
      texture.offset.set(frame.u, frame.v)
      texture.repeat.set(frame.uvWidth, frame.uvHeight)
      textures.set(name, texture)
    }
    return texture
  }

  return {
    set(frame: string, deltaX: number, deltaY: number, light: number): void {
      const sprite = getSprite(frame)
      weapon.visible = true
      const texture = textureOf(frame)
      if (weapon.material.map !== texture) {
        weapon.material.map = texture
        weapon.material.needsUpdate = true
      }
      const left = VIEW_SCREEN.originX - sprite.originX + deltaX
      const top = VIEW_SCREEN.originY - sprite.originY + deltaY
      weapon.scale.set(sprite.width / VIEW_SCREEN.unit, sprite.height / VIEW_SCREEN.unit, 1)
      weapon.position.x = (left + sprite.width / 2 - VIEW_SCREEN.halfWidth) / VIEW_SCREEN.unit
      weapon.position.y = (VIEW_SCREEN.halfHeight - top - sprite.height / 2) / VIEW_SCREEN.unit
      weapon.material.color.setScalar(light)
    },
    resize(aspect: number): void {
      camera.left = -aspect
      camera.right = aspect
      camera.updateProjectionMatrix()
    },
    render(renderer: WebGLRenderer): void {
      renderer.render(scene, camera)
    },
    dispose(): void {
      for (const texture of textures.values()) texture.dispose()
      textures.clear()
      weapon.geometry.dispose()
      weapon.material.dispose()
    },
  }
}
