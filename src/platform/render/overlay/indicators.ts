import type { Indicator } from '../../../game/ecs/ports'
const INDICATOR_STYLE = {
  margin: 28,
  epsilon: 1e-6,
  size: 9,
  eliteSize: 13,
  color: '#e03a2a',
  eliteColor: '#ffb040',
  halfBase: 0.8,
  baseDrop: 0.6,
}

export function drawIndicators(context: CanvasRenderingContext2D, width: number, height: number, indicators: Indicator[]): void {
  context.clearRect(0, 0, width, height)
  const centerX = width / 2
  const centerY = height / 2
  const radiusX = width / 2 - INDICATOR_STYLE.margin
  const radiusY = height / 2 - INDICATOR_STYLE.margin
  for (const indicator of indicators) {
    const deltaX = Math.sin(indicator.angle)
    const deltaY = -Math.cos(indicator.angle)
    const scale = Math.min(radiusX / Math.abs(deltaX || INDICATOR_STYLE.epsilon), radiusY / Math.abs(deltaY || INDICATOR_STYLE.epsilon))
    const size = indicator.elite ? INDICATOR_STYLE.eliteSize : INDICATOR_STYLE.size
    context.save()
    context.translate(centerX + deltaX * scale, centerY + deltaY * scale)
    context.rotate(indicator.angle)
    context.globalAlpha = indicator.alpha
    context.fillStyle = indicator.elite ? INDICATOR_STYLE.eliteColor : INDICATOR_STYLE.color
    context.beginPath()
    context.moveTo(0, -size)
    context.lineTo(size * INDICATOR_STYLE.halfBase, size * INDICATOR_STYLE.baseDrop)
    context.lineTo(-size * INDICATOR_STYLE.halfBase, size * INDICATOR_STYLE.baseDrop)
    context.closePath()
    context.fill()
    context.restore()
  }
}
