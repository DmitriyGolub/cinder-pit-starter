import { CanvasTexture, RepeatWrapping, type Texture } from 'three'
import { BIOME_TILES, BIOMES, biomeTexture } from '../../game/config/biomes'
import { pixelated } from './loaders'
import { cropFrame, loadSheet } from './sheets'

const TEXTURES_URL = '/textures/biomes/'

const textures = new Map<string, Texture>()

export function getTexture(name: string): Texture {
  const texture = textures.get(name)
  if (!texture) throw new Error(`texture not found: ${name}`)
  return texture
}

async function loadBiome(biome: number): Promise<void> {
  const sheet = await loadSheet(`${TEXTURES_URL}${BIOMES[biome].sheet}.json`)
  for (const tile of BIOME_TILES) {
    const name = biomeTexture(biome, tile)
    const texture = pixelated(new CanvasTexture(cropFrame(sheet, name)))
    texture.wrapS = texture.wrapT = RepeatWrapping
    textures.set(name, texture)
  }
}

export async function loadTextures(): Promise<void> {
  await Promise.all(BIOMES.map((_, biome) => loadBiome(biome)))
}
