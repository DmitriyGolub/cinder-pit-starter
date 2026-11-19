import { describe, expect, it } from 'vitest'
import { query } from 'bitecs'
import { Health, Player } from '../../src/game/ecs/components'
import { PLAYER } from '../../src/game/config/player'
import { createTestHud, createTestInput, createTestRun, simulate } from '../support/game'

describe('hud', () => {
  it('shows the hero health', () => {
    const hud = createTestHud()
    const world = createTestRun('run', createTestInput(), hud)
    simulate(world, 0.2)
    expect(hud.player?.hp).toBe(PLAYER.healthMax)
    expect(hud.player?.healthMax).toBe(PLAYER.healthMax)
  })

  it('follows health changes', () => {
    const hud = createTestHud()
    const world = createTestRun('run', createTestInput(), hud)
    Health.hp[query(world, [Player])[0]] = 42.5
    simulate(world, 0.2)
    expect(hud.player?.hp).toBe(43)
  })
})
