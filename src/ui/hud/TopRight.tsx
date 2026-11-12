import { useHud } from '../gameBridge'
import { KILLS_ICON } from '../../game/config/icons'
import { CoinAmount, IconAmount } from '../Icon'

export function TopRight() {
  const coins = useHud((state) => state.coins)
  const kills = useHud((state) => state.kills)
  return (
    <div className="hud-top-right">
      <span className="resource"><CoinAmount amount={coins} /></span>
      <span className="resource kills"><IconAmount name={KILLS_ICON} amount={kills} /></span>
    </div>
  )
}
