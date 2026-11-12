interface BiomeConfig {
  name: string
  sheet: string
  fog: number
}

export const BIOMES: BiomeConfig[] = [
  { name: 'Склеп', sheet: 'biome_crypt', fog: 0x140b18 },
  { name: 'Заросшие руины', sheet: 'biome_ruins', fog: 0x0b140c },
  { name: 'Лавовые пещеры', sheet: 'biome_lava', fog: 0x1e0806 },
  { name: 'Ледяные залы', sheet: 'biome_ice', fog: 0x0a1420 },
]

export const BIOME_TILES = ['wall0', 'wall1', 'ledge', 'floor0', 'floor1', 'floor2'] as const

export const BIOME_NOISE = { scale: 0.012, offsetA: 311.37, offsetB: -173.61, fogLerp: 1.5 }

export const biomeTexture = (biome: number, tile: (typeof BIOME_TILES)[number]) => `${BIOMES[biome].sheet}_${tile}`
