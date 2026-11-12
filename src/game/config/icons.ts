import type { SkillConfig } from './skills'

export const GOLD_ICON = 'gold'
export const KILLS_ICON = 'kills'
export const TIME_ICON = 'time'

export const skillIcon = (skill: SkillConfig) => `${skill.behavior}${skill.evolved ? '_evo' : ''}`
