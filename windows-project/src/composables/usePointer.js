import { onBeforeUnmount } from 'vue'
export function usePointer() {
  let stop = () => {}
  onBeforeUnmount(() => stop())
  return (event, move, done = () => {}) => {
    if (event.button !== 0) return
    stop()
    event.preventDefault()
    const origin = { x: event.clientX, y: event.clientY }
    const target = event.currentTarget
    target.setPointerCapture(event.pointerId)
    const onMove = e => move(e.clientX - origin.x, e.clientY - origin.y, e)
    const onEnd = e => { stop(); done(e) }
    stop = () => {
      target.removeEventListener('pointermove', onMove)
      target.removeEventListener('pointerup', onEnd)
      target.removeEventListener('pointercancel', onEnd)
      if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId)
      stop = () => {}
    }
    target.addEventListener('pointermove', onMove)
    target.addEventListener('pointerup', onEnd)
    target.addEventListener('pointercancel', onEnd)
  }
}
