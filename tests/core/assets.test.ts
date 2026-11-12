import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { BIOME_TILES, BIOMES, biomeTexture } from '../../src/game/config/biomes'
import { EFFECTS } from '../../src/game/config/effects'
import { ELEMENTS } from '../../src/game/config/elements'
import { ENEMIES } from '../../src/game/config/enemies'
import { HEROES } from '../../src/game/config/heroes'
import { GOLD_ICON, KILLS_ICON, TIME_ICON, skillIcon } from '../../src/game/config/icons'
import { META } from '../../src/game/config/meta'
import { PASSIVES } from '../../src/game/config/passives'
import { SKILLS } from '../../src/game/config/skills'
import { PICKUP_VIEW } from '../../src/game/config/loot'
import { SKILL_TUNING } from '../../src/game/config/skills'
import { FROZEN_ICON, STATUS } from '../../src/game/config/status'
import { WEAPONS } from '../../src/game/config/weapons'

const PUBLIC = join(import.meta.dirname, '..', '..', 'public')
const ENEMY_POSES = ['walk0', 'walk1', 'walk2', 'walk3', 'aim', 'fire', 'pain', 'dead']

const UI_KEYS = ['w', 'a', 's', 'd', 'mouse', 'mouse_left', 'shift_left', 'shift_right', 'esc', 'r', '1', '2', '3', '4']

function sheetFrames(manifestPath: string): Set<string> {
  const manifest = JSON.parse(readFileSync(join(PUBLIC, manifestPath), 'utf8'))
  expect(existsSync(join(PUBLIC, manifestPath, '..', manifest.image))).toBe(true)
  return new Set(Object.keys(manifest.frames))
}

const missingFrom = (frames: Set<string>, wanted: string[]) => wanted.filter((name) => !frames.has(name))

function spriteFrames(): Set<string> {
  const index: string[] = JSON.parse(readFileSync(join(PUBLIC, 'sprites', 'index.json'), 'utf8'))
  const frames = new Set<string>()
  for (const manifestPath of index) {
    const manifest = JSON.parse(readFileSync(join(PUBLIC, 'sprites', manifestPath), 'utf8'))
    expect(existsSync(join(PUBLIC, 'sprites', manifestPath, '..', manifest.image))).toBe(true)
    for (const name of Object.keys(manifest.frames)) frames.add(name)
  }
  return frames
}

function elementFrames(sprite: string, directional: boolean, frames: number): string[] {
  const indices = frames > 1 ? Array.from({ length: frames }, (_, i) => String(i)) : ['']
  const views = directional ? ['_front', '_side'] : ['']
  return views.flatMap((view) => indices.map((index) => `${sprite}${view}${index}`))
}

describe('assets referenced by config', () => {
  const frames = spriteFrames()

  it('has every sprite frame the game asks for', () => {
    const wanted = [
      ...Object.values(ENEMIES).flatMap((enemy) => ENEMY_POSES.map((pose) => `${enemy.sprite}_${pose}`)),
      ...Object.values(WEAPONS).flatMap((weapon) => [`${weapon.view}_idle`, weapon.pickup]),
      ...Object.values(EFFECTS).flatMap((effect) => Array.from({ length: effect.frames }, (_, i) => `${effect.sprite}${i}`)),
      ...Object.values(ELEMENTS).flatMap((element) => elementFrames(element.sprite, element.directional, element.frames)),
      ...Object.values(PICKUP_VIEW).map((view) => view.frame).filter(Boolean),
      SKILL_TUNING.orbiterSprite,
    ]
    expect(wanted.filter((frame) => !frames.has(frame))).toEqual([])
  })

  it('has every UI image in its sheet', () => {
    const icons = [
      GOLD_ICON, KILLS_ICON, TIME_ICON, FROZEN_ICON,
      ...Object.values(SKILLS).map(skillIcon),
      ...Object.values(PASSIVES).map((passive) => passive.stat),
      ...Object.values(META).map((upgrade) => upgrade.stat),
      ...Object.values(WEAPONS).map((weapon) => weapon.view),
      ...Object.values(STATUS).map((status) => status.icon),
    ]
    expect(missingFrom(sheetFrames('ui/icons.json'), icons)).toEqual([])
    expect(missingFrom(sheetFrames('ui/keys.json'), UI_KEYS)).toEqual([])
    expect(missingFrom(sheetFrames('ui/heroes.json'), Object.values(HEROES).flatMap((hero) => [hero.portraitImage, hero.bustImage]))).toEqual([])
    expect(missingFrom(sheetFrames('sprites/items/items.json'), ['coin'])).toEqual([])
  })

  it('has every biome tile in its biome sheet', () => {
    for (const [biome, config] of BIOMES.entries()) {
      expect(missingFrom(sheetFrames(`textures/biomes/${config.sheet}.json`), BIOME_TILES.map((tile) => biomeTexture(biome, tile)))).toEqual([])
    }
  })
})
