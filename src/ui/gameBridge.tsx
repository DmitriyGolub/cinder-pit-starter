import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react'
import type { Game, GameCommands } from '../app/game'
import type { HudState } from '../app/hudStore'

const GameBridge = createContext<Game | null>(null)

export function GameBridgeProvider({ game, children }: { game: Game; children: ReactNode }) {
  return <GameBridge.Provider value={game}>{children}</GameBridge.Provider>
}

function useGame(): Game {
  const game = useContext(GameBridge)
  if (!game) throw new Error('game is not ready')
  return game
}

export function useHud<T>(select: (state: HudState) => T): T {
  const { store } = useGame()
  return useSyncExternalStore(store.subscribe, () => select(store.get()))
}

export function useCommands(): GameCommands {
  return useGame().commands
}
