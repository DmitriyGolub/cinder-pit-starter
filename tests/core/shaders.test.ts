import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { AURA_SHADER, GLOW_SHADER, HAZE_SHADER, SHADOW_SHADER, SPRITE_SHADER } from '../../src/game/config/view'

const SHADERS = join(import.meta.dirname, '..', '..', 'src', 'platform', 'render', 'shaders')
const source = (shader: string) => ['vertex', 'fragment'].map((stage) => readFileSync(join(SHADERS, shader, `${stage}.glsl`), 'utf8')).join('\n')
const declaredUniforms = (shader: string) => new Set([...source(shader).matchAll(/uniform \w+ (\w+);/g)].map((match) => match[1]))

describe('shaders', () => {
  it.each([
    ['aura', AURA_SHADER],
    ['glow', GLOW_SHADER],
    ['haze', HAZE_SHADER],
    ['sprite', SPRITE_SHADER],
    ['shadow', SHADOW_SHADER],
  ])('%s declares every tunable from the config', (shader, tunables) => {
    const declared = declaredUniforms(shader)
    expect(Object.keys(tunables).filter((key) => !declared.has(key))).toEqual([])
  })
})
