import { WEAPON_LEVEL_MAX } from '../game/config/weapons'
import { Icon, Pips } from './Icon'
import { useHud } from './gameBridge'
import type { SlotView } from '../app/hudStore'

function Row({ slot }: { slot: SlotView }) {
  return (
    <li className={slot.evolved ? 'evolved' : ''}>
      <Icon name={slot.icon} evolved={slot.evolved} />
      <span>{slot.name}</span>
      {slot.evolved ? <em>эволюция</em> : <Pips level={slot.level} max={slot.max} />}
    </li>
  )
}

export function Build() {
  const weapon = useHud((state) => state.weapon)
  const weaponIcon = useHud((state) => state.weaponIcon)
  const weaponLevel = useHud((state) => state.weaponLevel)
  const skills = useHud((state) => state.skills)
  const passives = useHud((state) => state.passives)
  return (
    <div className="build">
      <section>
        <h3>Оружие</h3>
        <ul><Row slot={{ name: weapon, icon: weaponIcon, level: weaponLevel, max: WEAPON_LEVEL_MAX, evolved: false }} /></ul>
        <h3>Умения</h3>
        <ul>{skills.length ? skills.map((slot) => <Row key={slot.name} slot={slot} />) : <li className="none">пусто</li>}</ul>
      </section>
      <section>
        <h3>Пассивки</h3>
        <ul>{passives.length ? passives.map((slot) => <Row key={slot.name} slot={slot} />) : <li className="none">пусто</li>}</ul>
      </section>
    </div>
  )
}
