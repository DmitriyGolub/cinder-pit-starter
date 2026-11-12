import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = join(import.meta.dirname, '..', '..')
const README = readFileSync(join(ROOT, 'README.md'), 'utf8')
const DESCRIBED_DEPTH = { 'src/platform': 1, 'src/ui': 1 }

function folders(directory: string, depth: number): string[] {
  const limit = Object.entries(DESCRIBED_DEPTH).find(([prefix]) => relative(ROOT, directory).startsWith(prefix))?.[1]
  if (limit !== undefined && depth > limit + 1) return []
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name)
    return statSync(path).isDirectory() ? [relative(ROOT, path), ...folders(path, depth + 1)] : []
  })
}

describe('README', () => {
  it('describes every source folder', () => {
    const missing = folders(join(ROOT, 'src'), 1).filter((path) => {
      const name = path.split('/').at(-1)
      return !new RegExp(`^\\s+${name}/\\s`, 'm').test(README)
    })
    expect(missing).toEqual([])
  })
})
