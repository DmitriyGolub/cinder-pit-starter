import { SLOTS_MAX } from '../../game/config/skills'
import { WEAPON_LEVEL_MAX } from '../../game/config/weapons'
import { useHud } from '../gameBridge'
import type { SlotView } from '../../app/hudStore'
import { Icon, Pips } from '../Icon'

function Slot({ slot }: { slot: SlotView }) {
  return (
    <div className={`slot ${slot.evolved ? 'evolved' : ''}`} title={slot.name}>
      <Icon name={slot.icon} evolved={slot.evolved} />
      <Pips level={slot.level} max={slot.max} />
    </div>
  )
}

function WeaponSlot() {
  const weapon = useHud((state) => state.weapon)
  const icon = useHud((state) => state.weaponIcon)
  const level = useHud((state) => state.weaponLevel)
  return (
    <div className="hud-bottom-left">
      <div className="slot weapon">
        <Icon name={icon} />
        <Pips level={level} max={WEAPON_LEVEL_MAX} />
      </div>
      <em>{weapon}</em>
    </div>
  )
}

function Xp() {
  const level = useHud((state) => state.level)
  const xp = useHud((state) => state.xp)
  const now = useHud((state) => state.xpNow)
  const next = useHud((state) => state.xpNext)
  return (
    <div className="hud-xp">
      <b>Ур. {level}</b>
      <div className="xp-track">
        <div style={{ width: `${xp * 100}%` }} />
        <span>{now} / {next}</span>
      </div>
    </div>
  )
}

function Skills() {
  const skills = useHud((state) => state.skills)
  return (
    <div className="hud-bottom-right">
      {skills.map((slot) => <Slot key={slot.name} slot={slot} />)}
      {skills.length < SLOTS_MAX && <div className="slot locked" title="Свободный слот навыка" />}
    </div>
  )
}

export function Bottom() {
  return (
    <>
      <WeaponSlot />
      <Xp />
      <Skills />
    </>
  )
}
