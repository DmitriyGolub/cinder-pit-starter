import { useCommands, useHud } from './gameBridge'
import { Controls } from './Keys'

function Menu() {
  const commands = useCommands()
  return (
    <div className="overlay">
      <h1>ПОДЗЕМЬЕ</h1>
      <div className="modes">
        <button className="start" onClick={() => commands.start('run')}>Играть</button>
      </div>
      <Controls />
    </div>
  )
}

export function PhaseScreen() {
  const commands = useCommands()
  const phase = useHud((state) => state.phase)
  if (phase === 'playing') return null
  if (phase === 'menu') return <Menu />
  return (
    <div className="overlay paused">
      <h1>Пауза</h1>
      <div className="modes">
        <button className="start" onClick={() => commands.resume()}>Продолжить</button>
        <button className="menu-button" onClick={() => commands.menu()}>В меню</button>
      </div>
      <Controls />
    </div>
  )
}
