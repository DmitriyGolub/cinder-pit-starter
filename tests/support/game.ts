import { createRun } from '../../src/app/session'
import { beginFrame, type GameWorld, type RunMode } from '../../src/game/ecs/world'
import type { HudPort, InputPort, LoadoutView, PlayerView, RenderPort } from '../../src/game/ecs/ports'
import { runSystems } from '../../src/game/ecs/systems'
import { createEmptySave, type SaveData } from '../../src/game/progression/save'

const FRAME_TIME = 1 / 60
const TEST_SEED = 7

type Mutable<T> = { -readonly [Key in keyof T]: T[Key] }

type TestInput = Mutable<InputPort>

interface TestHud extends HudPort {
  player: PlayerView | null
  loadout: LoadoutView | null
  messages: string[]
}

export function createTestInput(): TestInput {
  return { moveX: 0, moveY: 0, turn: 0, lookX: 0, fire: false, walk: false }
}

export function createTestHud(): TestHud {
  const hud: TestHud = {
    player: null,
    loadout: null,
    messages: [],
    showPlayer: (view) => { hud.player = view },
    showLoadout: (view) => { hud.loadout = view },
    message: (text) => { hud.messages.push(text) },
    flashHurt: () => {},
    flashPickup: () => {},
  }
  return hud
}

function createTestRender(): RenderPort {
  const nothing = () => {}
  const view = { x: 0, y: 0, rightX: 1, rightY: 0, halfHorizontalFov: 1 }
  return {
    view,
    sprites: { begin: nothing, add: nothing, end: nothing, has: () => false },
    overlay: { addNumber: nothing, addHurt: nothing, addLightning: nothing, addProc: nothing, addConfirm: nothing, draw: nothing },
    setCamera: (x, y, _height, yaw) => {
      view.x = x
      view.y = y
      view.rightX = -Math.sin(yaw)
      view.rightY = Math.cos(yaw)
    },
    setFog: nothing,
    showLevel: nothing,
    setViewModel: nothing,
  }
}

export const createTestSave = (): SaveData => createEmptySave()

export function createTestRun(mode: RunMode = 'run', input: InputPort = createTestInput(), hud: HudPort = createTestHud(), seed = TEST_SEED): GameWorld {
  return createRun({ input, render: createTestRender(), hud }, createTestSave(), mode, seed)
}

export function simulate(world: GameWorld, seconds: number, everyFrame?: (world: GameWorld) => void): void {
  for (let frame = 0; frame < seconds / FRAME_TIME && world.status === 'playing'; frame++) {
    everyFrame?.(world)
    beginFrame(world, FRAME_TIME)
    runSystems(world)
  }
}
