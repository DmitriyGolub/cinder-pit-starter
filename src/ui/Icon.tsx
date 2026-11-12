import { coinUrl, iconUrl } from '../platform/assets'

export function Icon({ name, level, evolved }: { name: string; level?: number; evolved?: boolean }) {
  return (
    <span className={`icon ${evolved ? 'evolved' : ''}`}>
      <img src={iconUrl(name)} alt="" />
      {level !== undefined && <b>{evolved ? '★' : level}</b>}
    </span>
  )
}

export const CoinAmount = ({ amount: amount }: { amount: number }) => (
  <span className="coin-amount"><img src={coinUrl()} alt="" />{amount}</span>
)

export function IconAmount({ name, amount }: { name: string; amount: string | number }) {
  return <span className="icon-amount"><img src={iconUrl(name)} alt="" />{amount}</span>
}

export function Pips({ level, max }: { level: number; max: number }) {
  return <span className="pips">{Array.from({ length: max }, (_, i) => <i key={i} className={i < level ? 'on' : ''} />)}</span>
}
