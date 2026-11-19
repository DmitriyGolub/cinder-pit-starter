import { useHud } from '../gameBridge'

export function Feedback() {
  const hurtTick = useHud((state) => state.hurtTick)
  const message = useHud((state) => state.message)
  const messageId = useHud((state) => state.messageId)
  return (
    <>
      {hurtTick > 0 && <div key={`hurt${hurtTick}`} className="flash hurt" />}
      {messageId > 0 && <div key={`message${messageId}`} className="message">{message}</div>}
    </>
  )
}
