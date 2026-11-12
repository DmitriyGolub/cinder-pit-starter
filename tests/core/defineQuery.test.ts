import { addComponent, addEntity, createWorld, removeComponent } from 'bitecs'
import { describe, expect, it } from 'vitest'
import { defineQuery } from '../../src/game/ecs/defineQuery'
import type { GameWorld } from '../../src/game/ecs/world'

const Marked = {}
const markedQuery = defineQuery([Marked])
const createTestWorld = () => createWorld() as GameWorld

describe('defineQuery', () => {
  it('follows added and removed components with the same result array', () => {
    const world = createTestWorld()
    const entity = addEntity(world)
    addComponent(world, entity, Marked)
    const first = markedQuery(world)
    expect([...first]).toEqual([entity])
    removeComponent(world, entity, Marked)
    expect(markedQuery(world)).toBe(first)
    expect(first.length).toBe(0)
  })

  it('keeps worlds apart', () => {
    const one = createTestWorld()
    const two = createTestWorld()
    addComponent(one, addEntity(one), Marked)
    expect(markedQuery(one).length).toBe(1)
    expect(markedQuery(two).length).toBe(0)
  })
})
