import { ARENA } from '../game/config/arena'
import { createGameWorld, type GameWorld, type RunMode } from '../game/ecs/world'
import type { HudPort, InputPort, RenderPort } from '../game/ecs/ports'
import { mulberry32 } from '../game/math/random'
import { createSpatialHash } from '../game/physics/spatialHash'
import type { SaveData } from '../game/progression/save'

export interface SessionPorts {
  input: InputPort
  render: RenderPort
  hud: HudPort
}

const SEED = { range: 1e9, mix: 0x5bd1e995 }

export function createRun(ports: SessionPorts, save: SaveData, mode: RunMode = 'run', seed = Math.floor(Math.random() * SEED.range)): GameWorld {
  const world = createGameWorld({
    time: { delta: 0, elapsed: 0 },
    ...ports,
    random: mulberry32(seed ^ SEED.mix),
    hash: createSpatialHash(ARENA.size, ARENA.size),
    save,
  })
  world.run.mode = mode
  return world
}
