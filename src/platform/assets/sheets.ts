import { loadImage, loadJson } from './loaders'

interface SheetFrame {
  x: number
  y: number
  width: number
  height: number
  originX?: number
  originY?: number
}

interface SheetManifest {
  image: string
  frames: Record<string, SheetFrame>
}

export interface Sheet {
  readonly frames: Record<string, SheetFrame>
  readonly image: HTMLImageElement
}

export async function loadSheet(manifestUrl: string): Promise<Sheet> {
  const manifest = await loadJson<SheetManifest>(manifestUrl)
  const folder = manifestUrl.slice(0, manifestUrl.lastIndexOf('/') + 1)
  return { frames: manifest.frames, image: await loadImage(folder + manifest.image) }
}

export function cropFrame(sheet: Sheet, name: string): HTMLCanvasElement {
  const frame = sheet.frames[name]
  if (!frame) throw new Error(`frame not found: ${name}`)
  const canvas = document.createElement('canvas')
  canvas.width = frame.width
  canvas.height = frame.height
  canvas.getContext('2d')!.drawImage(sheet.image, frame.x, frame.y, frame.width, frame.height, 0, 0, frame.width, frame.height)
  return canvas
}
