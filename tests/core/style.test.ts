import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = join(import.meta.dirname, '..', '..', 'src')

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.tsx?$/.test(name) ? [path] : []
  })
}

const files = sourceFiles(ROOT).map((path) => ({ path: relative(ROOT, path), text: readFileSync(path, 'utf8') }))
const offenders = (test: (text: string, path: string) => boolean) => files.filter((file) => test(file.text, file.path)).map((file) => file.path)

describe('Flat ECS style', () => {
  it('has no classes and no this', () => {
    expect(offenders((text) => /^\s*(export )?(abstract )?class \w+/m.test(text) || /\bthis\./.test(text))).toEqual([])
  })

  it('has no default exports', () => {
    expect(offenders((text) => /^export default /m.test(text))).toEqual([])
  })

  it('keeps one system per file, named after the file', () => {
    const systems = files.filter((file) => /ecs\/systems\/\w+\/\w+System\.ts$/.test(file.path))
    expect(systems.length).toBeGreaterThan(0)
    for (const system of systems) {
      const name = system.path.split('/').pop()!.replace('.ts', '')
      const exported = [...system.text.matchAll(/^export function (\w+)\(/gm)].map((match) => match[1])
      expect(exported, system.path).toEqual([name])
      expect(system.text, system.path).toContain(`export function ${name}(world: GameWorld): void`)
    }
  })

  it('declares queries at the top of the module, never inside functions', () => {
    expect(offenders((text) => /^[ \t]+.*\bdefineQuery\(/m.test(text.replace(/^(const|export const) .*$/gm, '')))).toEqual([])
  })

  it('keeps the game free of the browser, three.js and React', () => {
    const game = files.filter((file) => file.path.startsWith('game/'))
    expect(game.filter((file) => /from '(three|react)'|\bdocument\.|\bwindow\./.test(file.text)).map((file) => file.path)).toEqual([])
  })
})
