import { useHud } from './gameBridge'
import { TopLeft } from './hud/TopLeft'
import { PhaseScreen } from './PhaseScreens'
import './hud/hud.css'

export function Hud() {
  const phase = useHud((state) => state.phase)
  return (
    <div className="hud">
      {phase !== 'menu' && <TopLeft />}
      <PhaseScreen />
    </div>
  )
}
