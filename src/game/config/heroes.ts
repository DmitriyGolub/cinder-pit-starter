import type { StatName } from './stats'

interface HeroPerk {
  name: string
  description: string
  stat: StatName
  amount: number
}

interface HeroConfig {
  name: string
  title: string
  portraitImage: string
  bustImage: string
  perk: HeroPerk
}

type HeroId = 'hunter'

export const HEROES: Record<HeroId, HeroConfig> = {
  hunter: {
    name: 'Охотник',
    title: 'Багровый капюшон',
    portraitImage: 'hunter_portrait',
    bustImage: 'hunter_bust',
    perk: { name: 'Чутьё', description: '15% шанс получить +1 навык при новом уровне', stat: 'extraSkillChance', amount: 0.15 },
  },
}

export const HERO_IDS = Object.keys(HEROES) as HeroId[]

export const DEFAULT_HERO: HeroId = 'hunter'

export const LOCKED_HEROES = 2

export function heroById(id: string): HeroConfig {
  return HEROES[id as HeroId] ?? HEROES[DEFAULT_HERO]
}
