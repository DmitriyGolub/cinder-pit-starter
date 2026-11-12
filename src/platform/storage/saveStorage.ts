import { createEmptySave, type SaveData } from '../../game/progression/save'

const STORAGE_KEY = 'ashen-arena.save.v1'

export function loadSave(): SaveData {
  const empty = createEmptySave()
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...empty, ...JSON.parse(stored) } : empty
  } catch {
    return empty
  }
}

export function writeSave(save: SaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save))
  } catch {
    return
  }
}
