import { createApp } from 'vue'
import './style.css'

const base = import.meta.env.BASE_URL
const screen = document.getElementById('startup-screen')
const progress = document.getElementById('startup-progress')
const fill = document.getElementById('startup-fill')
const appRoot = document.getElementById('app')
const started = performance.now()
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function advance(value) {
  progress.setAttribute('aria-valuenow', String(value))
  fill.style.width = `${value}%`
}

function preloadImage(path) {
  return new Promise(resolve => {
    const image = new Image()
    const done = () => {
      clearTimeout(timeout)
      image.onload = null
      image.onerror = null
      resolve()
    }
    const timeout = setTimeout(done, 7000)
    image.onload = done
    image.onerror = done
    image.src = `${base}${path}`
  })
}

async function prepareFonts() {
  if (!document.fonts) return
  let timeout
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load('12px BootCharcoal'),
        document.fonts.load('12px Charcoal'),
        document.fonts.load('12px Geneva'),
      ]),
      new Promise(resolve => { timeout = setTimeout(resolve, 7000) }),
    ])
  } catch { /* A missing font must not prevent access to the CV. */ }
  finally { clearTimeout(timeout) }
}

async function start() {
  advance(8)
  const { default: App } = await import('./App.vue')
  advance(28)
  const tasks = [
    prepareFonts(),
    ...['mac/startup-reference.png', 'icons/apple.svg', 'icons/finder.svg', 'icons/trash.svg',
      'mac/folder.png', 'mac/document.svg', 'mac/computer.svg', 'mac/disk.svg',
      'mac/close.png', 'mac/zoom.png', 'mac/collapse.png'].map(preloadImage),
  ]
  let completed = 0
  await Promise.all(tasks.map(task => task.then(() => {
    completed += 1
    advance(28 + Math.round(62 * completed / tasks.length))
  })))
  // Keep the requested boot presentation readable even when assets are cached.
  // Its resource progress is real; only the minimum presentation time is staged.
  const remaining = Math.max(0, (reducedMotion ? 0 : 1800) - (performance.now() - started))
  if (remaining) await new Promise(resolve => setTimeout(resolve, remaining))
  advance(100)
  if (!reducedMotion) await new Promise(resolve => setTimeout(resolve, 200))
  createApp(App).mount(appRoot)
  appRoot.removeAttribute('aria-busy')
}

start().catch(error => {
  console.error('Portfolio startup failed:', error)
  screen.classList.add('failed')
  document.getElementById('startup-status').textContent = 'Could not start up. Please reload.'
  progress.hidden = true
  const retry = document.getElementById('startup-retry')
  retry.hidden = false
  retry.addEventListener('click', () => window.location.reload())
  appRoot.removeAttribute('aria-busy')
})
