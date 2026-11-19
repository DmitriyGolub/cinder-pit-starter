const CHANNEL_MAX = 255
const RED_SHIFT = 16
const GREEN_SHIFT = 8

export const red = (color: number) => ((color >> RED_SHIFT) & CHANNEL_MAX) / CHANNEL_MAX
export const green = (color: number) => ((color >> GREEN_SHIFT) & CHANNEL_MAX) / CHANNEL_MAX
export const blue = (color: number) => (color & CHANNEL_MAX) / CHANNEL_MAX
