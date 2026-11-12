import { CanvasTexture, type Texture } from 'three'
import { loadJson, pixelated } from './loaders'
import { loadSheet } from './sheets'

interface SpriteFrame {
  u: number
  v: number
  uvWidth: number
  uvHeight: number
  width: number
  height: number
  originX: number
  originY: number
}

const SPRITES_URL = '/sprites/'
const ATLAS = { size: 1024, padding: 2 }
const MISSING = { name: 'missing', size: 8, color: '#ff00ff' }

const frames = new Map<string, SpriteFrame>()
let atlas: Texture | null = null

export const hasSprite = (name: string): boolean => frames.has(name)
export const getSprite = (name: string): SpriteFrame => frames.get(name) ?? frames.get(MISSING.name)!

export function getSpriteAtlas(): Texture {
  if (!atlas) throw new Error('sprites not loaded')
  return atlas
}

function addFrame(name: string, x: number, y: number, width: number, height: number, originX: number, originY: number): void {
  const size = ATLAS.size
  frames.set(name, {
    u: x / size,
    v: 1 - (y + height) / size,
    uvWidth: width / size,
    uvHeight: height / size,
    width,
    height,
    originX,
    originY,
  })
}

export async function loadSprites(): Promise<void> {
  const manifestPaths = await loadJson<string[]>(`${SPRITES_URL}index.json`)
  const sheets = await Promise.all(manifestPaths.map((manifestPath) => loadSheet(SPRITES_URL + manifestPath)))

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = ATLAS.size
  const context = canvas.getContext('2d')!
  context.fillStyle = MISSING.color
  context.fillRect(0, 0, MISSING.size, MISSING.size)
  addFrame(MISSING.name, 0, 0, MISSING.size, MISSING.size, MISSING.size / 2, MISSING.size)

  let columnX = 0
  let columnWidth = 0
  let y = MISSING.size + ATLAS.padding
  for (const { frames: sheetFrames, image } of sheets) {
    if (y + image.height > ATLAS.size) {
      columnX += columnWidth + ATLAS.padding
      columnWidth = 0
      y = 0
    }
    if (columnX + image.width > ATLAS.size || y + image.height > ATLAS.size) throw new Error('sprite atlas overflow')
    context.drawImage(image, columnX, y)
    for (const [name, frame] of Object.entries(sheetFrames)) {
      addFrame(name, columnX + frame.x, y + frame.y, frame.width, frame.height, frame.originX ?? frame.width / 2, frame.originY ?? frame.height)
    }
    y += image.height + ATLAS.padding
    columnWidth = Math.max(columnWidth, image.width)
  }
  atlas = pixelated(new CanvasTexture(canvas))
}
