import { isMobile } from '../platform/device'
import { keyUrl } from '../platform/assets'


const TOUCH: [string, string][] = [
  ['правый палец', 'ходьба'],
  ['левый палец', 'обзор'],
  ['авто', 'огонь'],
  ['II', 'пауза'],
]

const CONTROLS: [string[], string][] = [
  [['w', 'a', 's', 'd'], 'ходьба'],
  [['mouse'], 'обзор'],
  [['mouse_left'], 'огонь'],
  [['shift'], 'шаг'],
  [['esc'], 'пауза'],
]

export function Key({ name: keyName }: { name: string }) {
  if (keyName === 'shift') {
    return (
      <span className="keycap wide">
        <img src={keyUrl('shift_left')} alt="Shift" />
        <img src={keyUrl('shift_right')} alt="" />
      </span>
    )
  }
  return <img className="keycap" src={keyUrl(keyName)} alt={keyName.toUpperCase()} />
}

export function Controls() {
  if (isMobile()) {
    return (
      <div className="controls">
        {TOUCH.map(([gesture, label]) => <span key={label} className="control"><b>{gesture}</b><em>{label}</em></span>)}
      </div>
    )
  }
  return (
    <div className="controls">
      {CONTROLS.map(([keys, label]) => (
        <span key={label} className="control">
          {keys.map((keyName) => <Key key={keyName} name={keyName} />)}
          <em>{label}</em>
        </span>
      ))}
    </div>
  )
}
