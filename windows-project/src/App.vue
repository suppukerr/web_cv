<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import MenuBar from './components/MenuBar.vue'
import DesktopIcon from './components/DesktopIcon.vue'
import MacWindow from './components/MacWindow.vue'
import FinderWindow from './components/FinderWindow.vue'
import TablewarePreview from './components/TablewarePreview.vue'
import { isFinderWindow } from './data/files.js'
import PortfolioDocument from './components/PortfolioDocument.vue'
import MacDialog from './components/MacDialog.vue'
import { usePointer } from './composables/usePointer'
import { desktop, allFiles, activeWindow, selectedFiles, open, select, close, showDialog, updateViewport, visibleChildren, moveToTrash } from './composables/useDesktop'
const pointer = usePointer(), marquee = ref(null)
const desktopFiles = computed(() => allFiles.value.filter(f => ['disk','resume','links','trash','tableware'].includes(f.id) || (f.custom && f.parent === null && !desktop.trash.includes(f.id))))
function position(file) {
  const fallback = file.id === 'tableware' ? {x:24,y:330} : file.id === 'trash' ? {x:desktop.viewport.width-92,y:desktop.viewport.height-76} : file.custom ? {x:24+(desktopFiles.value.filter(f => f.custom).indexOf(file))*88,y:40} : {x:desktop.viewport.width-92,y:40+['disk','resume','links'].indexOf(file.id)*76}
  const stored = desktop.iconPositions[file.id] || fallback
  return {x:Math.max(0,Math.min(desktop.viewport.width-80,stored.x)),y:Math.max(24,Math.min(desktop.viewport.height-60,stored.y))}
}
function move(file,p) { desktop.iconPositions[file.id] = {x:Math.max(0,Math.min(desktop.viewport.width-80,p.x)),y:Math.max(24,Math.min(desktop.viewport.height-60,p.y))} }
function drop(file,e) {
  if (!file.custom) return
  const trash = position(allFiles.value.find(f => f.id === 'trash'))
  if(e.clientX >= trash.x && e.clientX <= trash.x+80 && e.clientY >= trash.y && e.clientY <= trash.y+60) {desktop.selected=[file.id]; moveToTrash()}
}
function background(e) {
  if(e.target !== e.currentTarget || e.button !== 0) return
  desktop.menu = null
  desktop.activeId = null
  desktop.selectionOwner = 'desktop'
  const initial = e.shiftKey ? [...desktop.selected] : []
  desktop.selected = initial
  const x=e.clientX,y=e.clientY
  pointer(e,(dx,dy) => {
    const box = {left:Math.min(x,x+dx),top:Math.min(y,y+dy),width:Math.abs(dx),height:Math.abs(dy)}
    marquee.value = box
    desktop.selected = [...new Set([...initial,...desktopFiles.value.filter(f => {const p=position(f); return p.x+80 > box.left && p.x < box.left+box.width && p.y+60 > box.top && p.y < box.top+box.height}).map(f => f.id)])]
  },() => {marquee.value = null})
}
function key(e) {
  if (desktop.dialog || ['INPUT','TEXTAREA','SELECT','IFRAME'].includes(e.target.tagName)) return
  if(e.key === 'Escape') {desktop.menu=null; desktop.selected=[]; return}
  if(e.metaKey || e.ctrlKey) {
    const k=e.key.toLowerCase()
    if(!['o','w','i','a','n','backspace'].includes(k)) return
    e.preventDefault()
    if(k === 'o') selectedFiles.value.forEach(open)
    if(k === 'w') close()
    if(k === 'i' && selectedFiles.value.length) showDialog('info',selectedFiles.value[0])
    if(k === 'n' && (!activeWindow.value || ['folder','disk'].includes(activeWindow.value.kind))) showDialog('new-folder')
    if(k === 'backspace') moveToTrash()
    if(k === 'a') {
      const win = activeWindow.value
      if(win && !isFinderWindow(win)) return
      desktop.selectionOwner = win ? win.id : 'desktop'
      desktop.selected = (win ? win.kind === 'trash' ? allFiles.value.filter(f => desktop.trash.includes(f.id)) : visibleChildren(win) : desktopFiles.value).map(f => f.id)
    }
  } else if(e.key === 'Enter' && e.target === document.body) selectedFiles.value.forEach(open)
}
function dismissMenu(e) { if(!e.target.closest('.menu-bar')) desktop.menu = null }
function navigateHash() {
  let id
  try { id = decodeURIComponent(window.location.hash.slice(1)) } catch { id = '' }
  if (id === 'desktop') {desktop.activeId = null; return}
  open(allFiles.value.find(f => f.id === id && f.kind !== 'alias') || allFiles.value[0])
}
watch(() => desktop.activeId, () => {
  const url = new URL(window.location.href)
  url.hash = activeWindow.value?.fileId || 'desktop'
  window.history.replaceState(null, '', url)
})
onMounted(() => {
  updateViewport()
  navigateHash()
  const win=activeWindow.value
  if (win?.fileId === 'disk') win.rect={x:Math.max(0,Math.min(24,desktop.viewport.width-386)),y:52,width:Math.min(386,desktop.viewport.width),height:Math.min(246,desktop.viewport.height-52)}
  window.addEventListener('hashchange',navigateHash)
  window.addEventListener('resize',updateViewport)
  window.addEventListener('keydown',key)
  window.addEventListener('pointerdown',dismissMenu)
})
onBeforeUnmount(() => {window.removeEventListener('hashchange',navigateHash);window.removeEventListener('resize',updateViewport);window.removeEventListener('keydown',key);window.removeEventListener('pointerdown',dismissMenu)})
</script>
<template>
  <main :class="['desktop',desktop.wallpaper]" aria-label="Mac OS 9 portfolio desktop" @pointerdown="background">
    <MenuBar />
    <DesktopIcon v-for="file in desktopFiles" :key="file.id" :file="file" :position="position(file)" draggable :selected="desktop.selectionOwner === 'desktop' && desktop.selected.includes(file.id)" @select="desktop.activeId=null;select(file.id,'desktop',$event.metaKey || $event.ctrlKey || $event.shiftKey)" @open="open(file)" @move="move(file,$event)" @drop="drop(file,$event)" />
    <aside class="welcome-note"><strong>Welcome to my Macintosh!</strong><p>Саша Шахнова<br />Web-разработчик</p><p>Open Macintosh HD to explore my experience, projects, skills, and contacts.</p><button @click="showDialog('help')">Need a hand? Mac Help ↗</button></aside>
    <MacWindow v-for="(win,index) in desktop.windows" :key="win.id" :win="win" :index="index"><FinderWindow v-if="isFinderWindow(win)" :win="win" /><TablewarePreview v-else-if="win.kind === 'tableware-item'" :win="win" /><PortfolioDocument v-else :win="win" /></MacWindow>
    <div v-if="marquee" class="selection-marquee" :style="{left:marquee.left+'px',top:marquee.top+'px',width:marquee.width+'px',height:marquee.height+'px'}" />
    <MacDialog v-if="desktop.dialog" />
    <span class="sr-only" aria-live="polite">{{ desktop.selected.length }} selected. {{ desktop.windows.length }} windows open.</span>
  </main>
</template>
