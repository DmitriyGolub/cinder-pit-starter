import type { OverlayFrame } from '../../../game/ecs/ports'

export interface OverlayLayer<Item> {
  add(item: Item): void
  draw(context: CanvasRenderingContext2D, width: number, height: number, frame: OverlayFrame): void
  clear(): void
}
