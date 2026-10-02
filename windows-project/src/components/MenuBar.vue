<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { asset } from '../data/files'
import { desktop, activeWindow, allFiles, selectedFiles, open, close, focus, showDialog, moveToTrash, putAway, children } from '../composables/useDesktop'
const time = ref(''), submenu = ref(null), bar = ref(null), popupOffset = ref(0), childOffset = ref(0)
let timer, tracking = false, openedOnPress = false
const menus = ['Apple', 'File', 'Edit', 'View', 'Special', 'Help']
const finder = computed(() => activeWindow.value && ['folder', 'disk', 'trash'].includes(activeWindow.value.kind))
function setView(view) { if (activeWindow.value) activeWindow.value.view = view }
function cleanup() { desktop.iconPositions = {} }
const menuItems = computed(() => ({
  Apple: [ {label: 'About This Computer…', action: () => showDialog('about')}, {separator:true}, {label: 'Appearance…', action: () => showDialog('appearance')}, {label:'Contacts', action: () => open(allFiles.value.find(f => f.id === 'contacts'))} ],
  File: [ {label:'New Folder…', shortcut:'⌘N', action:() => showDialog('new-folder'), disabled: activeWindow.value && (!finder.value || activeWindow.value.kind === 'trash')}, {label:'Open', shortcut:'⌘O', disabled:!selectedFiles.value.length, action:() => selectedFiles.value.forEach(open)}, {label:'Close Window', shortcut:'⌘W', disabled:!activeWindow.value, action:() => close()}, {separator:true}, {label:'Get Info', shortcut:'⌘I', disabled:!selectedFiles.value.length, action:() => showDialog('info',selectedFiles.value[0])}, {separator:true}, {label:'Move to Trash', shortcut:'⌘⌫', disabled:!selectedFiles.value.some(f => f.custom) || activeWindow.value?.kind === 'trash', action:moveToTrash}, {label:'Put Away', shortcut:'⌘Y', disabled:activeWindow.value?.kind !== 'trash' || !selectedFiles.value.length, action:putAway} ],
  Edit: [ {label:'Select All', shortcut:'⌘A', disabled:activeWindow.value && !finder.value, action:() => {
    desktop.selectionOwner = finder.value ? activeWindow.value.id : 'desktop'
    desktop.selected = (finder.value ? (activeWindow.value.kind === 'trash' ? allFiles.value.filter(f => desktop.trash.includes(f.id)) : children(activeWindow.value.fileId)) : allFiles.value.filter(f => f.parent === null && !desktop.trash.includes(f.id))).map(f => f.id)
  }} ],
  View: [ {label:'as Icons', checked:activeWindow.value?.view === 'icons', disabled:!finder.value, action:() => setView('icons')}, {label:'as List', checked:activeWindow.value?.view === 'list', disabled:!finder.value, action:() => setView('list')}, {separator:true}, {label:'Clean Up Desktop', action:cleanup}, {label:'Arrange', children:[{label:'by Name', disabled:!finder.value, action:() => {activeWindow.value.sort = true}}, {label:'by Kind', disabled:!finder.value, action:() => {activeWindow.value.sort = 'kind'}}]} ],
  Special: [ {label:'Empty Trash…', disabled:!desktop.trash.length, action:() => showDialog('empty-trash')}, {separator:true}, {label:'Reset Desktop…', action:() => showDialog('reset')} ],
  Help: [ {label:'Mac Help', action:() => showDialog('help')}, {label:'Portfolio Source', action:() => window.open('https://github.com/suppukerr/web_cv','_blank','noopener,noreferrer')} ],
  Applications: [{label:'Finder', checked: !activeWindow.value || finder.value, action:() => { const win = [...desktop.windows].reverse().find(w => ['folder','disk','trash'].includes(w.kind)); if(win) focus(win.id); else open(allFiles.value[0]) }}, {separator:true}, ...desktop.windows.map(w => ({label:w.title, checked:desktop.activeId === w.id, action:() => focus(w.id)}))],
}))
function pressMenu(name) {
  tracking = true
  openedOnPress = desktop.menu !== name
  if (openedOnPress) { desktop.menu = name; submenu.value = null }
}
function releaseMenu(e) {
  if (!tracking) return
  tracking = false
  const button = e.target.closest?.('.menu-popup button')
  if (button) {
    const label = button.dataset.item
    const items = menuItems.value[desktop.menu] || []
    const item = items.flatMap(i => [i, ...(i.children || [])]).find(i => i.label === label)
    if (item) execute(item)
    openedOnPress = false
  } else if (!e.target.closest?.('.menu-bar')) {desktop.menu = null; openedOnPress = false}
}
function rootClick(name) {
  if (openedOnPress) {openedOnPress = false; return}
  toggle(name)
}
function toggle(name) { desktop.menu = desktop.menu === name ? null : name; submenu.value = null }
function execute(item) { if (item.disabled || item.separator) return; if (item.children) {submenu.value = item.label; return}; item.action(); desktop.menu = null; submenu.value = null }
function hover(name) { if (desktop.menu) { desktop.menu = name; submenu.value = null } }
function focusItem(delta = 0, last = false) {
  nextTick(() => {
    const panel = bar.value?.querySelector(submenu.value ? '.submenu' : '.menu-popup')
    const buttons = [...(panel?.querySelectorAll('button:not(:disabled)') || [])]
    if (!buttons.length) return
    const i = buttons.indexOf(document.activeElement)
    buttons[last ? buttons.length-1 : i < 0 ? 0 : (i+delta+buttons.length)%buttons.length]?.focus()
  })
}
function keyboard(e) {
  if (e.key === 'Escape') { desktop.menu = null; submenu.value = null; return }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault(); if (!desktop.menu) desktop.menu = e.target.dataset.menu || 'Apple'
    focusItem(e.key === 'ArrowDown' ? 1 : -1, e.key === 'ArrowUp' && e.target.dataset.menu)
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    e.preventDefault()
    const item = menuItems.value[desktop.menu]?.find(i => i.label === e.target.dataset.item)
    if (e.key === 'ArrowRight' && item?.children) { submenu.value = item.label; focusItem(); return }
    if (e.key === 'ArrowLeft' && submenu.value) { submenu.value = null; focusItem(); return }
    const i = menus.indexOf(desktop.menu)
    desktop.menu = menus[(i+(e.key === 'ArrowRight' ? 1 : -1)+menus.length)%menus.length]; submenu.value = null; focusItem()
  } else if (e.key === 'Home' || e.key === 'End') {e.preventDefault(); focusItem(0,e.key === 'End')}
}
watch([() => desktop.menu, () => desktop.viewport.width], async () => {
  popupOffset.value = 0
  await nextTick()
  const popup = bar.value?.querySelector('.menu-root > .menu-popup')
  if (popup) popupOffset.value = Math.min(0, desktop.viewport.width - popup.getBoundingClientRect().right - 2)
})
watch([submenu, popupOffset], async () => {
  childOffset.value = 0
  await nextTick()
  const popup = bar.value?.querySelector('.submenu')
  if (popup) childOffset.value = Math.min(0, desktop.viewport.width - popup.getBoundingClientRect().right - 2)
})
function tick() { time.value = new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}) }
onMounted(() => {tick(); timer = setInterval(tick,10000); window.addEventListener('pointerup',releaseMenu)})
onBeforeUnmount(() => {clearInterval(timer); window.removeEventListener('pointerup',releaseMenu)})
</script>
<template>
  <nav ref="bar" class="menu-bar" aria-label="Menu bar" @pointerdown.stop @click.stop @keydown="keyboard">
    <div class="menu-left" role="menubar">
      <div v-for="name in menus" :key="name" class="menu-root">
        <button role="menuitem" :data-menu="name" :class="{ 'menu-open':desktop.menu === name, 'apple-menu':name === 'Apple' }" :aria-label="name" aria-haspopup="menu" :aria-expanded="desktop.menu === name" @pointerdown="pressMenu(name)" @click="rootClick(name)" @pointerenter="hover(name)"><img v-if="name === 'Apple'" :src="asset('icons/apple.svg')" alt="" /><template v-else>{{ name }}</template></button>
        <div v-if="desktop.menu === name" class="menu-popup" :style="{transform:`translateX(${popupOffset}px)`}" role="menu" :aria-label="name">
          <template v-for="(item,i) in menuItems[name]" :key="i">
            <hr v-if="item.separator" role="separator" />
            <div v-else class="menu-row" @pointerenter="submenu = item.children ? item.label : null">
              <button role="menuitem" :data-item="item.label" :disabled="item.disabled" :aria-haspopup="item.children ? 'menu' : undefined" @click="execute(item)"><span class="menu-check">{{ item.checked ? '✓' : '' }}</span>{{ item.label }}<span class="menu-shortcut">{{ item.children ? '▶' : item.shortcut }}</span></button>
              <div v-if="item.children && submenu === item.label" class="menu-popup submenu" :style="{transform:`translateX(${childOffset}px)`}" role="menu"><button v-for="child in item.children" :key="child.label" role="menuitem" :data-item="child.label" :disabled="child.disabled" @click="execute(child)"><span class="menu-check" />{{ child.label }}</button></div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="menu-right"><time>{{ time }}</time><img class="menu-divider" :src="asset('icons/placeholder.svg')" alt="" />
      <div class="menu-root application-menu"><button role="menuitem" aria-label="Applications" aria-haspopup="menu" :aria-expanded="desktop.menu === 'Applications'" :class="{'menu-open':desktop.menu === 'Applications'}" @pointerdown="pressMenu('Applications')" @click="rootClick('Applications')" @pointerenter="hover('Applications')"><img :src="asset('icons/finder.svg')" alt="" /><span>{{ !activeWindow || finder ? 'Finder' : activeWindow.kind === 'pdf' ? 'Acrobat Reader' : 'SimpleText' }}</span></button>
      <div v-if="desktop.menu === 'Applications'" role="menu" class="menu-popup"><template v-for="(item,i) in menuItems.Applications" :key="i"><hr v-if="item.separator" /><button v-else role="menuitem" :data-item="item.label" @click="execute(item)"><span class="menu-check">{{ item.checked ? '✓' : '' }}</span>{{ item.label }}</button></template></div></div>
    </div>
  </nav>
</template>
