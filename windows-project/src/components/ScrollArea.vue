<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { usePointer } from '../composables/usePointer'
const viewport = ref(null), content = ref(null)
const m = reactive({ top: 0, left: 0, width: 1, height: 1, scrollWidth: 1, scrollHeight: 1 })
const pointer = usePointer()
let observer, timer
function measure() {
  const el = viewport.value
  if (el) Object.assign(m, { top: el.scrollTop, left: el.scrollLeft, width: el.clientWidth, height: el.clientHeight, scrollWidth: el.scrollWidth, scrollHeight: el.scrollHeight })
}
const maxY = computed(() => Math.max(0, m.scrollHeight - m.height))
const maxX = computed(() => Math.max(0, m.scrollWidth - m.width))
function thumb(axis) {
  const vertical = axis === 'y', track = Math.max(0, (vertical ? m.height : m.width) - 32)
  const max = vertical ? maxY.value : maxX.value
  const size = Math.min(track, Math.max(18, track * (vertical ? m.height / m.scrollHeight : m.width / m.scrollWidth)))
  const position = max ? (track - size) * (vertical ? m.top : m.left) / max : 0
  return { track, size, position, max }
}
function scroll(axis, amount) { viewport.value?.scrollBy({ [axis === 'y' ? 'top' : 'left']: amount }) }
function repeat(e, axis, direction) {
  scroll(axis, direction * 18)
  clearInterval(timer)
  timer = setInterval(() => scroll(axis, direction * 18), 85)
  pointer(e, () => {}, () => clearInterval(timer))
}
function drag(e, axis) {
  const t = thumb(axis), start = axis === 'y' ? m.top : m.left
  pointer(e, (dx, dy) => {
    const value = start + (axis === 'y' ? dy : dx) * t.max / Math.max(1, t.track - t.size)
    viewport.value?.scrollTo({ [axis === 'y' ? 'top' : 'left']: value })
  })
}
function page(e, axis) {
  if (e.target !== e.currentTarget) return
  const box = e.currentTarget.getBoundingClientRect(), t = thumb(axis)
  const position = axis === 'y' ? e.clientY - box.top : e.clientX - box.left
  scroll(axis, (position < t.position ? -1 : 1) * (axis === 'y' ? m.height : m.width) * 0.9)
}
function key(e, axis) {
  const keys = axis === 'y' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight']
  if (keys.includes(e.key)) { e.preventDefault(); scroll(axis, e.key === keys[0] ? -18 : 18) }
  else if (['Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) {
    e.preventDefault()
    if (e.key === 'Home' || e.key === 'End') viewport.value.scrollTo({ [axis === 'y' ? 'top' : 'left']: e.key === 'Home' ? 0 : thumb(axis).max })
    else scroll(axis, (e.key === 'PageUp' ? -1 : 1) * (axis === 'y' ? m.height : m.width))
  }
}
onMounted(() => { observer = new ResizeObserver(measure); observer.observe(viewport.value); observer.observe(content.value); measure() })
onBeforeUnmount(() => { observer?.disconnect(); clearInterval(timer) })
</script>
<template>
  <div class="scroll-area">
    <div ref="viewport" class="scroll-viewport" tabindex="0" @scroll="measure"><div ref="content" class="scroll-content"><slot /></div></div>
    <div class="scrollbar vertical" :class="{ empty: !maxY }">
      <button aria-label="Scroll up" :disabled="!maxY" @pointerdown="repeat($event, 'y', -1)" @click="!$event.detail && scroll('y', -18)">▴</button>
      <div class="scroll-track" @pointerdown="page($event, 'y')"><div v-if="maxY" class="scroll-thumb" role="scrollbar" tabindex="0" aria-label="Vertical scroll" aria-orientation="vertical" :aria-valuenow="Math.round(m.top)" aria-valuemin="0" :aria-valuemax="maxY" :style="{height: thumb('y').size + 'px', top: thumb('y').position + 'px'}" @pointerdown.stop="drag($event, 'y')" @keydown="key($event, 'y')" /></div>
      <button aria-label="Scroll down" :disabled="!maxY" @pointerdown="repeat($event, 'y', 1)" @click="!$event.detail && scroll('y', 18)">▾</button>
    </div>
    <div class="scrollbar horizontal" :class="{ empty: !maxX }">
      <button aria-label="Scroll left" :disabled="!maxX" @pointerdown="repeat($event, 'x', -1)" @click="!$event.detail && scroll('x', -18)">◂</button>
      <div class="scroll-track" @pointerdown="page($event, 'x')"><div v-if="maxX" class="scroll-thumb" role="scrollbar" tabindex="0" aria-label="Horizontal scroll" aria-orientation="horizontal" :aria-valuenow="Math.round(m.left)" aria-valuemin="0" :aria-valuemax="maxX" :style="{width: thumb('x').size + 'px', left: thumb('x').position + 'px'}" @pointerdown.stop="drag($event, 'x')" @keydown="key($event, 'x')" /></div>
      <button aria-label="Scroll right" :disabled="!maxX" @pointerdown="repeat($event, 'x', 1)" @click="!$event.detail && scroll('x', 18)">▸</button>
    </div><div class="scroll-corner" />
  </div>
</template>
