import { DEFAULT_HERO } from '../config/heroes'

export interface SaveData {
  coins: number
  meta: Record<string, number>
  best: number
  hero: string
}

export function createEmptySave(): SaveData {
  return { coins: 0, meta: {}, best: 0, hero: DEFAULT_HERO }
}
