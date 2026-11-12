import { Body, Position, Shootable } from '../../components'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const shootableQuery = defineQuery([Position, Body, Shootable])

export function spatialSystem(world: GameWorld): void {
  world.hash.clear()
  for (const entity of shootableQuery(world)) world.hash.insert(entity, Position.x[entity], Position.y[entity])
}
