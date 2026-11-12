import { cropFrame, loadSheet, type Sheet } from './sheets'

const UI_SHEETS = {
  icons: '/ui/icons.json',
  keys: '/ui/keys.json',
  heroes: '/ui/heroes.json',
  items: '/sprites/items/items.json',
}

type UiSheetName = keyof typeof UI_SHEETS

const COIN_FRAME = 'coin'

const sheets = new Map<UiSheetName, Sheet>()
const canvases = new Map<string, HTMLCanvasElement>()
const urls = new Map<string, string>()

function frameCanvas(sheetName: UiSheetName, frame: string): HTMLCanvasElement | null {
  const key = `${sheetName}/${frame}`
  const cached = canvases.get(key)
  if (cached) return cached
  const sheet = sheets.get(sheetName)
  if (!sheet || !sheet.frames[frame]) return null
  const canvas = cropFrame(sheet, frame)
  canvases.set(key, canvas)
  return canvas
}

function frameUrl(sheetName: UiSheetName, frame: string): string {
  const key = `${sheetName}/${frame}`
  const cached = urls.get(key)
  if (cached !== undefined) return cached
  const url = frameCanvas(sheetName, frame)?.toDataURL() ?? ''
  urls.set(key, url)
  return url
}

export function iconUrl(name: string): string {
  return frameUrl('icons', name)
}

export function keyUrl(name: string): string {
  return frameUrl('keys', name)
}

export function heroUrl(name: string): string {
  return frameUrl('heroes', name)
}

export function coinUrl(): string {
  return frameUrl('items', COIN_FRAME)
}

export function getIconImage(name: string): HTMLCanvasElement | null {
  return frameCanvas('icons', name)
}

export async function loadUiImages(): Promise<void> {
  const entries = Object.entries(UI_SHEETS) as [UiSheetName, string][]
  await Promise.all(entries.map(async ([name, url]) => sheets.set(name, await loadSheet(url))))
}
