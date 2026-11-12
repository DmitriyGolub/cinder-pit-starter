import { heroUrl } from '../../platform/assets'
import { heroById } from '../../game/config/heroes'
import { HUD_VIEW } from '../../game/config/hud'
import { useHud } from '../gameBridge'
import { Icon } from '../Icon'

function Bar({ resource, value, max, segment }: { resource: 'hp' | 'shield'; value: number; max: number; segment: number }) {
  const width = `${(value / Math.max(1, max)) * 100}%`
  const low = resource === 'hp' && value / max <= HUD_VIEW.lowHp
  return (
    <div className={`bar ${resource} ${low ? 'low' : ''}`} style={{ backgroundSize: `${(segment / Math.max(1, max)) * 100}% 100%` }}>
      <div className="trail" style={{ width }} />
      <div className="fill" style={{ width }} />
      <span>{value} / {max}</span>
    </div>
  )
}

export function TopLeft() {
  const hp = useHud((state) => state.hp)
  const max = useHud((state) => state.healthMax)
  const shield = useHud((state) => state.shield)
  const shieldMax = useHud((state) => state.shieldMax)
  const level = useHud((state) => state.level)
  const buffs = useHud((state) => state.buffs)
  const hero = heroById(useHud((state) => state.hero))
  return (
    <div className="hud-top-left">
      <div className="portrait">
        <div className="face"><img src={heroUrl(hero.portraitImage)} alt={hero.name} /></div>
        <b>{level}</b>
      </div>
      <div className="bars">
        <Bar resource="hp" value={hp} max={max} segment={HUD_VIEW.hpSegment} />
        {shieldMax > 0 && <Bar resource="shield" value={shield} max={shieldMax} segment={1} />}
      </div>
      <div className="buffs">
        {buffs.map((buff) => <span key={buff.icon}><Icon name={buff.icon} />{buff.text}</span>)}
      </div>
    </div>
  )
}
