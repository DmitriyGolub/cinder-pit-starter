import { RUN } from '../../game/config/run'
import { BOSSES, WAVES } from '../../game/config/waves'
import { clock } from '../clock'
import { useHud } from '../gameBridge'

const BOSS_TIMES = new Set(BOSSES.map((bossMark) => bossMark.at))
const MARKS = [
  ...WAVES.slice(1).filter((wave) => !BOSS_TIMES.has(wave.from)).map((wave) => ({ at: wave.from, boss: false })),
  ...BOSSES.map((bossMark) => ({ at: bossMark.at, boss: true })),
]
const percent = (seconds: number) => `${Math.min(100, (seconds / RUN.duration) * 100)}%`

export function TopCenter() {
  const time = useHud((state) => state.time)
  const wave = useHud((state) => state.wave)
  const mode = useHud((state) => state.mode)
  const run = mode === 'run'
  return (
    <div className="hud-top-center">
      <div className="plaque">
        <small>{run ? `ВОЛНА ${wave}` : 'ТРЕНИРОВКА'}</small>
        <strong>{clock(time)}</strong>
      </div>
      {run && (
        <div className="timeline">
          <div className="timeline-fill" style={{ width: percent(time) }} />
          {MARKS.map((mark) => (
            <i key={`${mark.at}${mark.boss}`} className={`${mark.boss ? 'boss' : 'mark'} ${time >= mark.at ? 'past' : ''}`} style={{ left: percent(mark.at) }}>
              {mark.boss ? '☠' : ''}
            </i>
          ))}
        </div>
      )}
    </div>
  )
}
