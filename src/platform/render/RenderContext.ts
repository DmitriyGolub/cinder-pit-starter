import { Color, Fog, PerspectiveCamera, Scene, Timer, WebGLRenderer } from 'three'
import { RENDER } from '../../game/config/view'
import type { CameraView, RenderPort } from '../../game/ecs/ports'
import { createOverlay } from './overlay/overlay'
import { createSpriteBatch } from './scene/spriteBatch'

interface RenderContext extends RenderPort {
  readonly canvas: HTMLCanvasElement
  setLoop(frame: ((delta: number) => void) | null): void
  render(): void
  dispose(): void
}

const DEGREES_TO_RADIANS = Math.PI / 180
const CAMERA_YAW_OFFSET = Math.PI / 2

export function createRenderContext(container: HTMLElement): RenderContext {
  const renderer = new WebGLRenderer({ antialias: false })
  renderer.setPixelRatio(1)
  renderer.autoClear = false
  renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;image-rendering:pixelated'
  container.appendChild(renderer.domElement)
  const overlayCanvas = document.createElement('canvas')
  overlayCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none'
  container.appendChild(overlayCanvas)

  const sky = new Color(RENDER.sky)
  renderer.setClearColor(sky)
  const scene = new Scene()
  scene.fog = new Fog(sky, RENDER.fogNear, RENDER.fogFar)
  const camera = new PerspectiveCamera(RENDER.fov, 1, RENDER.near, RENDER.far)
  const view: CameraView = { x: 0, y: 0, rightX: 1, rightY: 0, halfHorizontalFov: 0 }
  const overlay = createOverlay(overlayCanvas, camera)
  const sprites = createSpriteBatch(sky, camera)
  const timer = new Timer()
  timer.connect(document)
  scene.add(sprites.mesh)

  const resize = () => {
    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight
    renderer.setSize(Math.ceil(width / RENDER.pixelScale), Math.ceil(height / RENDER.pixelScale), false)
    overlayCanvas.width = width
    overlayCanvas.height = height
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    view.halfHorizontalFov = Math.atan(Math.tan((RENDER.fov / 2) * DEGREES_TO_RADIANS) * camera.aspect)
  }
  resize()
  window.addEventListener('resize', resize)

  return {
    canvas: renderer.domElement,
    view,
    sprites,
    overlay,
    setCamera(x, y, height, yaw) {
      const rotation = -yaw - CAMERA_YAW_OFFSET
      camera.position.set(x, height, y)
      camera.rotation.set(0, rotation, 0)
      camera.updateMatrixWorld()
      view.x = x
      view.y = y
      view.rightX = Math.cos(rotation)
      view.rightY = -Math.sin(rotation)
    },
    setLoop(frame) {
      renderer.setAnimationLoop(frame && ((timestamp) => {
        timer.update(timestamp)
        frame(timer.getDelta())
      }))
    },
    render() {
      renderer.clear()
      renderer.render(scene, camera)
    },
    dispose() {
      renderer.setAnimationLoop(null)
      window.removeEventListener('resize', resize)
      timer.dispose()
      overlay.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
