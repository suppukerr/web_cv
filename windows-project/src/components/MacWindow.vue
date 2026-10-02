<script setup>
import { desktop, focus, close, zoom } from '../composables/useDesktop'
import { resizeRect } from '../composables/geometry'
import { usePointer } from '../composables/usePointer'
const props = defineProps({ win: Object, index: Number })
const pointer = usePointer()
function drag(e) {
  if (e.target.closest('button')) return
  const start = { ...props.win.rect }
  pointer(e, (dx, dy) => {
    props.win.rect.x = Math.round(Math.max(0, Math.min(desktop.viewport.width - start.width, start.x + dx)))
    props.win.rect.y = Math.round(Math.max(20, Math.min(desktop.viewport.height - 19, start.y + dy)))
  })
}
function resize(e) { const start = { ...props.win.rect }; pointer(e, (dx, dy) => { props.win.rect = resizeRect(start, dx, dy, desktop.viewport) }) }
</script>
<template>
  <section :class="['mac-window', { inactive: desktop.activeId !== win.id, collapsed: win.collapsed }]" role="region" :aria-label="win.title" :data-window="win.fileId"
    :style="{ left: win.rect.x + 'px', top: win.rect.y + 'px', width: win.rect.width + 'px', height: win.collapsed ? '23px' : win.rect.height + 'px', zIndex: 10 + index }"
    @pointerdown.capture="focus(win.id)" @focusin="desktop.activeId !== win.id && focus(win.id)">
    <header class="title-bar" @pointerdown="drag" @dblclick="win.collapsed = !win.collapsed">
      <button class="window-button close-button" :aria-label="'Close ' + win.title" @dblclick.stop @click.stop="close(win.id)" />
      <div class="title-lines" /><span class="window-title">{{ win.title }}</span><div class="title-lines" />
      <button class="window-button zoom-button" :aria-label="'Zoom ' + win.title" @dblclick.stop @click.stop="zoom(win)" />
      <button class="window-button collapse-button" :aria-label="(win.collapsed ? 'Expand ' : 'Collapse ') + win.title" @dblclick.stop @click.stop="win.collapsed = !win.collapsed" />
    </header>
    <div v-show="!win.collapsed" class="window-body"><slot /></div>
    <button v-if="!win.collapsed" class="resize-corner" :aria-label="'Resize ' + win.title" @pointerdown="resize" @keydown.right.prevent="win.rect = resizeRect(win.rect, 10, 0, desktop.viewport)" @keydown.left.prevent="win.rect = resizeRect(win.rect, -10, 0, desktop.viewport)" @keydown.down.prevent="win.rect = resizeRect(win.rect, 0, 10, desktop.viewport)" @keydown.up.prevent="win.rect = resizeRect(win.rect, 0, -10, desktop.viewport)" />
  </section>
</template>
