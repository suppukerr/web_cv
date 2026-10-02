import { computed, reactive, watch } from 'vue'
import { files } from '../data/files.js'
import { cv } from '../data/cv.js'
import { fitRect } from './geometry.js'
const storageKey = 'web-cv-mac9-v1'
function saved() { try { return JSON.parse(localStorage.getItem(storageKey)) || {} } catch { return {} } }
const preferences = saved()
export const desktop = reactive({
  windows: [], activeId: null, selected: [], selectionOwner: 'desktop', menu: null,
  dialog: null, viewport: { width: window.innerWidth, height: window.innerHeight },
  wallpaper: ['platinum', 'pattern'].includes(preferences.wallpaper) ? preferences.wallpaper : 'platinum',
  iconPositions: Object.fromEntries(Object.entries(preferences.iconPositions || {}).filter(([,p]) => p && Number.isFinite(p.x) && Number.isFinite(p.y))), customFiles: [], trash: [], nextId: 1,
})
export const allFiles = computed(() => [ ...files,
  ...cv.projects.map(p => ({ id: `project-${p.id}`, name: p.title, kind: 'document', parent: 'projects', project: p })),
  ...cv.experience.map(p => ({ id: `job-${p.id}`, name: `${p.title} — ${p.company}`, kind: 'document', parent: 'experience', job: p })),
  ...desktop.customFiles,
])
export const activeWindow = computed(() => desktop.windows.find(w => w.id === desktop.activeId))
export const selectedFiles = computed(() => allFiles.value.filter(f => desktop.selected.includes(f.id)))
export function children(id) { return allFiles.value.filter(f => f.parent === id && !desktop.trash.includes(f.id)) }
export function select(id, owner = 'desktop', additive = false) {
  if (desktop.selectionOwner !== owner || !additive) desktop.selected = []
  desktop.selectionOwner = owner
  desktop.selected = desktop.selected.includes(id) ? desktop.selected.filter(x => x !== id) : [...desktop.selected, id]
}
export function focus(id) {
  const index = desktop.windows.findIndex(w => w.id === id)
  if (index < 0) return
  const [win] = desktop.windows.splice(index, 1)
  desktop.windows.push(win)
  desktop.activeId = id
  desktop.menu = null
}
export function open(file) {
  desktop.menu = null
  if (!file) return
  if (file.kind === 'alias') { window.open(file.url, '_blank', 'noopener,noreferrer'); return }
  const existing = desktop.windows.find(w => w.fileId === file.id)
  if (existing) { existing.collapsed = false; focus(existing.id); return }
  const offset = desktop.windows.length * 22 % 160
  const rect = fitRect({ x: 30 + offset, y: 55 + offset, width: file.kind === 'pdf' ? 680 : file.kind === 'disk' ? 386 : 540, height: file.kind === 'pdf' ? 640 : file.kind === 'disk' ? 246 : 370 }, desktop.viewport)
  const win = { id: `window-${desktop.nextId++}`, fileId: file.id, title: file.name, kind: file.kind, rect, collapsed: false, zoomRect: null, view: 'icons', sort: false }
  desktop.windows.push(win)
  desktop.activeId = win.id
  desktop.selected = []
}
export function close(id = desktop.activeId) {
  desktop.windows = desktop.windows.filter(w => w.id !== id)
  desktop.activeId = desktop.windows.at(-1)?.id || null
  desktop.menu = null
}
export function zoom(win) {
  if (win.zoomRect) { win.rect = fitRect(win.zoomRect, desktop.viewport); win.zoomRect = null }
  else { win.zoomRect = { ...win.rect }; win.rect = { x: 0, y: 20, width: desktop.viewport.width, height: desktop.viewport.height - 20 }; win.collapsed = false }
}
export function showDialog(type, file = null) { desktop.menu = null; desktop.dialog = { type, file } }
export function updateViewport() {
  desktop.viewport = { width: window.innerWidth, height: window.innerHeight }
  desktop.windows.forEach(w => { w.rect = fitRect(w.rect, desktop.viewport) })
}
export function newFolder(name) {
  const owner = activeWindow.value
  const parent = owner && ['folder', 'disk'].includes(owner.kind) ? owner.fileId : null
  const folder = { id: `folder-${Date.now()}-${desktop.nextId++}`, name: name.trim() || 'untitled folder', kind: 'folder', parent, custom: true }
  desktop.customFiles.push(folder)
  select(folder.id, parent ? owner.id : 'desktop')
}
export function moveToTrash() {
  selectedFiles.value.filter(f => f.custom).forEach(f => {
    if (!desktop.trash.includes(f.id)) desktop.trash.push(f.id)
    desktop.windows.filter(w => w.fileId === f.id).forEach(w => close(w.id))
  })
  desktop.selected = []; desktop.menu = null
}
export function putAway() { desktop.trash = desktop.trash.filter(id => !desktop.selected.includes(id)); desktop.selected = [] }
watch(() => [desktop.wallpaper, desktop.iconPositions], () => {
  try { localStorage.setItem(storageKey, JSON.stringify({ wallpaper: desktop.wallpaper, iconPositions: desktop.iconPositions })) } catch { /* Storage is optional. */ }
}, { deep: true })

export function emptyTrash() {
  const removed = new Set(desktop.trash)
  let changed = true
  while (changed) {
    changed = false
    desktop.customFiles.forEach(f => {
      if (removed.has(f.parent) && !removed.has(f.id)) {removed.add(f.id); changed = true}
    })
  }
  desktop.windows.filter(w => removed.has(w.fileId)).forEach(w => close(w.id))
  desktop.customFiles = desktop.customFiles.filter(f => !removed.has(f.id))
  desktop.trash = []
  desktop.selected = []
}
