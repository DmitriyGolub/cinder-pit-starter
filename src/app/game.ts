import { deleteWorld } from 'bitecs'
import { DELTA_MAX } from '../game/config/engine'
import { runSystems, runView } from '../game/ecs/systems'
import { beginFrame, type RunMode } from '../game/ecs/world'
import { isMobile } from '../platform/device'
import type { InputDevice } from '../platform/input/InputDevice'
import { createKeyboardMouseInput } from '../platform/input/keyboardMouseInput'
import { createTouchInput } from '../platform/input/touchInput'
import { createRenderContext } from '../platform/render/RenderContext'
import { loadSave } from '../platform/storage/saveStorage'
import { createHudPort, createHudStore, type HudStore, type Phase } from './hudStore'
import { createRun, type SessionPorts } from './session'

export interface GameCommands {
  start(mode: RunMode): void
  menu(): void
  resume(): void
}

export interface Game {
  readonly store: HudStore
  readonly commands: GameCommands
  dispose(): void
}

export function createGame(container: HTMLElement): Game {
  const store = createHudStore()
  const render = createRenderContext(container)
  const input: InputDevice = isMobile() ? createTouchInput(render.canvas) : createKeyboardMouseInput(render.canvas)
  const ports: SessionPorts = { input, render, hud: createHudPort(store) }
  const save = loadSave()
  let world = createRun(ports, save)
  let phase: Phase = 'menu'

  const setPhase = (next: Phase) => {
    phase = next
    store.set({ phase })
  }

  const commands: GameCommands = {
    start(mode) {
      deleteWorld(world)
      world = createRun(ports, save, mode)
      store.set({ mode })
      setPhase('playing')
      input.requestLock()
    },
    menu() {
      setPhase('menu')
      input.exitLock()
    },
    resume() {
      if (phase === 'paused') input.requestLock()
    },
  }

  const frame = (frameTime: number) => {
    const delta = Math.min(DELTA_MAX, frameTime)
    if (phase === 'playing') {
      beginFrame(world, delta)
      runSystems(world)
    } else {
      beginFrame(world, 0)
      runView(world)
    }
    input.endFrame()
    render.render()
  }

  const onClick = () => {
    if (phase === 'paused') input.requestLock()
  }

  input.onLockChange = (locked) => {
    if (locked && phase === 'paused') setPhase('playing')
    if (!locked && phase === 'playing') setPhase('paused')
  }
  container.addEventListener('click', onClick)
  render.setLoop(frame)

  return {
    store,
    commands,
    dispose() {
      container.removeEventListener('click', onClick)
      deleteWorld(world)
      input.dispose()
      render.dispose()
    },
  }
}
