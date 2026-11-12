import { commitRemovals, query, type QueryResult, type QueryTerm } from 'bitecs'
import type { GameWorld } from './world'

type WorldQuery = (world: GameWorld) => QueryResult

export function defineQuery(terms: QueryTerm[]): WorldQuery {
  const resolved = new WeakMap<GameWorld, QueryResult>()
  return (world) => {
    commitRemovals(world)
    let entities = resolved.get(world)
    if (!entities) {
      entities = query(world, terms)
      resolved.set(world, entities)
    }
    return entities
  }
}
