import { Vector3, type Camera } from 'three'

const projectedPoint = new Vector3()

export function toScreen(point: Vector3, camera: Camera, width: number, height: number, margin = Infinity): [number, number] | null {
  projectedPoint.copy(point).project(camera)
  if (projectedPoint.z > 1 || Math.abs(projectedPoint.x) > margin || Math.abs(projectedPoint.y) > margin) return null
  return [(projectedPoint.x * 0.5 + 0.5) * width, (0.5 - projectedPoint.y * 0.5) * height]
}
