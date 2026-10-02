<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount, computed } from 'vue'
import { desktop, newFolder, emptyTrash } from '../composables/useDesktop'
import { asset } from '../data/files'
const dialog = ref(null), name = ref('untitled folder')
const previous = document.activeElement
const titles = {about:'About This Computer',appearance:'Appearance',info:'Get Info',help:'Mac Help','new-folder':'New Folder','empty-trash':'Empty Trash',reset:'Reset Desktop'}
const confirmation = computed(() => ['new-folder','empty-trash','reset'].includes(desktop.dialog.type))
function dismiss() { desktop.dialog = null; previous?.focus?.() }
function done() {
  const type = desktop.dialog.type
  if(type === 'new-folder') newFolder(name.value)
  if(type === 'empty-trash') emptyTrash()
  if(type === 'reset') {desktop.iconPositions = {}; desktop.wallpaper = 'platinum'; desktop.windows = []; desktop.activeId = null; desktop.selected = []}
  dismiss()
}
function key(e) {
  if(e.key === 'Escape') {e.preventDefault(); dismiss()}
  if(e.key === 'Tab') {
    const elements = [...dialog.value.querySelectorAll('button:not(:disabled),input,select,a[href]')]
    if(e.shiftKey && document.activeElement === elements[0]) {e.preventDefault(); elements.at(-1).focus()}
    else if(!e.shiftKey && document.activeElement === elements.at(-1)) {e.preventDefault(); elements[0].focus()}
  }
}
onMounted(() => nextTick(() => { const el = dialog.value.querySelector('input,select,button'); el?.focus(); el?.select?.() }))
onBeforeUnmount(() => previous?.focus?.())
</script>
<template>
  <div class="dialog-backdrop" @pointerdown.stop @click.stop @keydown.stop="key">
    <form ref="dialog" class="mac-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" @submit.prevent="done">
      <h1 id="dialog-title">{{ titles[desktop.dialog.type] }}</h1>
      <div class="dialog-content">
        <template v-if="desktop.dialog.type === 'about'"><div class="about-computer"><img :src="asset('mac/computer.svg')" alt="" /><div><strong>Mac OS 9</strong><p>{{ 'Саша Шахнова' }}’s portfolio</p></div></div><p>A Vue desktop containing my CV, experience, projects, and contacts.</p><p class="dialog-description">Platinum controls and Charcoal adapted from Infinite Mac by Mihai Parparita. <a :href="asset('licenses/infinite-mac.txt')" target="_blank" rel="noopener">Apache 2.0 license</a></p></template>
        <template v-else-if="desktop.dialog.type === 'appearance'"><label for="wallpaper">Desktop pattern</label><select id="wallpaper" class="platinum-select" v-model="desktop.wallpaper"><option value="platinum">Mac OS 9 — Lavender</option><option value="pattern">Classic — Gray pattern</option></select><div :class="['pattern-preview',desktop.wallpaper]" /></template>
        <template v-else-if="desktop.dialog.type === 'new-folder'"><label for="folder-name">Name:</label><input id="folder-name" class="platinum-input" v-model="name" maxlength="63" required /></template>
        <template v-else-if="desktop.dialog.type === 'info'"><dl class="info-list"><dt>Name:</dt><dd>{{ desktop.dialog.file.name }}</dd><dt>Kind:</dt><dd>{{ desktop.dialog.file.kind }}</dd><dt>Where:</dt><dd>{{ desktop.dialog.file.parent || 'Desktop' }}</dd></dl></template>
        <template v-else-if="desktop.dialog.type === 'help'"><p>Double-click an icon, or select it and press Enter, to open it.</p><p>Drag a title bar to move a window. The upper-right buttons zoom and collapse it; drag the lower-right corner to resize.</p><p>Use the File and View menus to open items, create folders, switch views, or get information. Custom folders can be moved to Trash and restored with Put Away.</p><p>Use ⌘/Ctrl + O to open, W to close, I for information, A to select all, and N for a new folder. Escape dismisses a menu or dialog.</p><p>Drag on the desktop to select several icons. Shift-click adds to the selection.</p></template>
        <p v-else-if="desktop.dialog.type === 'empty-trash'">Permanently remove {{ desktop.trash.length }} custom folder(s) from this session?</p>
        <p v-else-if="desktop.dialog.type === 'reset'">Close all windows and restore the desktop’s original layout and pattern?</p>
      </div>
      <footer><button v-if="confirmation" type="button" class="platinum-button" @click="dismiss">Cancel</button><button type="submit" class="platinum-button default-button">{{ desktop.dialog.type === 'new-folder' ? 'Create' : confirmation ? 'OK' : 'Done' }}</button></footer>
    </form>
  </div>
</template>
