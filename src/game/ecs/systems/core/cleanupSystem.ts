import { removeEntity } from 'bitecs'
import { Destroyed, Faction, Health, Side } from '../../components'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const destroyedQuery = defineQuery([Destroyed])

export function cleanupSystem(world: GameWorld): void {
  for (const entity of [...destroyedQuery(world)]) {
    Health.hp[entity] = 0
    Faction.side[entity] = Side.None
    removeEntity(world, entity)
  }
}
