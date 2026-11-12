import { loadSprites } from './sprites'
import { loadTextures } from './textures'
import { loadUiImages } from './uiImages'

export { getSprite, getSpriteAtlas, hasSprite } from './sprites'
export { getTexture } from './textures'
export { coinUrl, getIconImage, heroUrl, iconUrl, keyUrl } from './uiImages'

export async function loadAssets(): Promise<void> {
  await Promise.all([loadSprites(), loadTextures(), loadUiImages()])
}
