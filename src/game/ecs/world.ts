import { addComponent, createWorld, type World } from 'bitecs'
import { Destroyed } from './components'
import { clearFrameEvents, createFrameEvents, type FrameEvents } from './events'
import type { HudPort, InputPort, RenderPort } from './ports'
import type { RandomGenerator } from '../math/random'
import type { SaveData } from '../progression/save'
import type { SpatialHash } from '../physics/spatialHash'

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
  run: RunState
  status: RunStatus
  events: FrameEvents
}

type Provided = 'time' | 'input' | 'render' | 'hud' | 'random' | 'save' | 'hash'

export function createGameWorld(context: Pick<GameContext, Provided>): GameWorld {
  return createWorld<GameContext>({
    ...context,
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
