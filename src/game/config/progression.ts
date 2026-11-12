
const XP_CURVE = { first: 5, perLevel: 10, growth: 0.6 }

export const xpForLevel = (level: number) =>
  XP_CURVE.first + (level - 1) * XP_CURVE.perLevel + Math.floor((level - 1) ** 2 * XP_CURVE.growth)

export const CHOICES = { cards: 3, luckyCards: 4, chestPicks: 1, luckyChestPicks: 2 }
