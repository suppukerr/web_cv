<script setup>
import { ref } from 'vue'
import MacIcon from './MacIcon.vue'
import { usePointer } from '../composables/usePointer'
const props = defineProps({ file: Object, selected: Boolean, position: Object, draggable: Boolean })
const emit = defineEmits(['select', 'open', 'move', 'drop'])
const pointer = usePointer()
const moved = ref(false)
function down(e) {
  if (!props.draggable || e.button !== 0) return
  moved.value = false
  const start = { ...props.position }
  pointer(e, (dx, dy) => {
    if (Math.abs(dx) + Math.abs(dy) < 4 && !moved.value) return
    moved.value = true
    emit('move', { x: start.x + dx, y: start.y + dy })
  }, e => { if (moved.value) emit('drop', e) })
}
function click(e) { if (!moved.value) emit('select', e); moved.value = false }
</script>
<template>
  <button :class="['desktop-icon', { selected, positioned: position }]" :style="position ? { left: position.x + 'px', top: position.y + 'px' } : {}"
    :aria-label="file.name" :aria-pressed="selected" @pointerdown.stop="down" @click.stop="click"
    @dblclick.stop="emit('open')" @keydown.enter.prevent="emit('open')" @keydown.space.prevent="emit('select', $event)">
    <MacIcon :file="file" /><span>{{ file.name }}</span>
  </button>
</template>
