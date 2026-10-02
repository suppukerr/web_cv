export function fitRect(rect, viewport) {
  const width = Math.min(Math.max(260, rect.width), viewport.width)
  const height = Math.min(Math.max(160, rect.height), viewport.height - 20)
  return { width, height, x: Math.max(0, Math.min(rect.x, viewport.width - width)), y: Math.max(20, Math.min(rect.y, viewport.height - 19)) }
}
export function resizeRect(rect, dx, dy, viewport) {
  return { ...rect, width: Math.max(Math.min(260, viewport.width), Math.min(rect.width + dx, viewport.width - rect.x)), height: Math.max(Math.min(160, viewport.height - 20), Math.min(rect.height + dy, viewport.height - rect.y)) }
}
