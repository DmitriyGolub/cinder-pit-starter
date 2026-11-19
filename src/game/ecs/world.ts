import { addComponent, createWorld, type World } from 'bitecs'
import { Destroyed } from './components'
import { clearFrameEvents, createFrameEvents, type FrameEvents } from './events'
import { biomeAt, createLevel, type Level } from '../arena/Level'
import { generateLevel } from '../arena/generate'
import { ARENA } from '../config/arena'
import { BIOMES } from '../config/biomes'
import { blue, green, red } from '../math/color'
import type { HudPort, InputPort, RenderPort } from './ports'
import type { RandomGenerator } from '../math/random'
import type { SaveData } from '../progression/save'
import type { SpatialHash } from '../physics/spatialHash'

interface Atmosphere {
  red: number
  green: number
  blue: number
}

const SEED_RANGE = 2 ** 31

interface RunState {
  time: number
  mode: RunMode
}

export type RunMode = 'run' | 'training'

type RunStatus = 'playing' | 'dead' | 'won'

export interface GameContext {
  time: { delta: number; elapsed: number }
  input: InputPort
  render: RenderPort
  hud: HudPort
  random: RandomGenerator
  save: SaveData
  timers: Map<System, number>
  hash: SpatialHash
  level: Level
  atmosphere: Atmosphere
  run: RunState
  status: RunStatus
  events: FrameEvents
}

type Provided = 'time' | 'input' | 'render' | 'hud' | 'random' | 'save' | 'hash'

function createArena(random: RandomGenerator): Level {
  const level = createLevel(Math.floor(random() * SEED_RANGE))
  generateLevel(level, -ARENA.size / 2, -ARENA.size / 2)
  return level
}

function createAtmosphere(level: Level): Atmosphere {
  const fog = BIOMES[biomeAt(level, ARENA.size / 2, ARENA.size / 2)].fog
  return { red: red(fog), green: green(fog), blue: blue(fog) }
}

export function createGameWorld(context: Pick<GameContext, Provided>): GameWorld {
  const level = createArena(context.random)
  return createWorld<GameContext>({
    ...context,
    level,
    atmosphere: createAtmosphere(level),
    timers: new Map(),
    run: { time: 0, mode: 'run' },
    status: 'playing',
    events: createFrameEvents(),
  })
}

export type GameWorld = World<GameContext>

export type System = (world: GameWorld) => void

export function beginFrame(world: GameWorld, delta: number): void {
  world.time.delta = delta
  world.time.elapsed += delta
  clearFrameEvents(world.events)
}

export function destroyEntity(world: GameWorld, entity: number): void {
  addComponent(world, entity, Destroyed)
}
