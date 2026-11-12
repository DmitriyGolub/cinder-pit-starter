import { NearestFilter, SRGBColorSpace, type Texture } from 'three'

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`image not loaded: ${url}`))
    image.src = url
  })
}

export async function loadJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`json not loaded: ${url}`)
  return response.json()
}

export function pixelated<T extends Texture>(texture: T): T {
  texture.magFilter = NearestFilter
  texture.minFilter = NearestFilter
  texture.generateMipmaps = false
  texture.colorSpace = SRGBColorSpace
  return texture
}
