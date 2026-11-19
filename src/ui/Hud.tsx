import { useHud } from './gameBridge'
import { Feedback } from './hud/Feedback'
import { TopLeft } from './hud/TopLeft'
import { TopRight } from './hud/TopRight'
import { PhaseScreen } from './PhaseScreens'
import './hud/hud.css'

export function Hud() {
  const phase = useHud((state) => state.phase)
  return (
    <div className="hud">
      {phase !== 'menu' && <Feedback />}
      {phase !== 'menu' && <TopLeft />}
      {phase !== 'menu' && <TopRight />}
      <PhaseScreen />
    </div>
  )
}
