import { useEffect, useRef, useState } from 'react'
import { createGame, type Game } from '../app/game'
import { loadAssets } from '../platform/assets'
import { GameBridgeProvider } from './gameBridge'
import { Hud } from './Hud'

export function App() {
  const viewport = useRef<HTMLDivElement>(null)
  const [game, setGame] = useState<Game | null>(null)

  useEffect(() => {
    let created: Game | null = null
    let cancelled = false
    loadAssets().then(() => {
      if (cancelled) return
      created = createGame(viewport.current!)
      setGame(created)
    })
    return () => {
      cancelled = true
      created?.dispose()
    }
  }, [])

  return (
    <div className="root">
      <div ref={viewport} className="viewport" />
      {game && (
        <GameBridgeProvider game={game}>
          <Hud />
        </GameBridgeProvider>
      )}
    </div>
  )
}
