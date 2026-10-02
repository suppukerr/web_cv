<script setup>
import { computed } from 'vue'
import { allFiles, desktop, children, open, select } from '../composables/useDesktop'
import DesktopIcon from './DesktopIcon.vue'
import MacIcon from './MacIcon.vue'
import ScrollArea from './ScrollArea.vue'
const props = defineProps({ win:Object })
const contents = computed(() => {
  const list = props.win.kind === 'trash' ? allFiles.value.filter(f => desktop.trash.includes(f.id)) : children(props.win.fileId)
  if (!props.win.sort) return list
  return [...list].sort((a,b) => (props.win.sort === 'kind' ? a.kind.localeCompare(b.kind) : 0) || a.name.localeCompare(b.name))
})
function choose(file,e) { select(file.id,props.win.id,e.metaKey || e.ctrlKey || e.shiftKey) }
function clear(e) { if(e.target === e.currentTarget) {desktop.selected = []; desktop.selectionOwner = props.win.id} }
</script>
<template>
  <div class="finder-window">
    <div class="finder-info"><span>{{ contents.length }} {{ contents.length === 1 ? 'item' : 'items' }}</span><span>{{ win.kind === 'trash' ? 'Drag custom folders here to discard them' : 'Portfolio' }}</span></div>
    <ScrollArea>
      <div v-if="win.view === 'icons'" class="finder-icons" @click="clear"><DesktopIcon v-for="file in contents" :key="file.id" :file="file" :selected="desktop.selectionOwner === win.id && desktop.selected.includes(file.id)" @select="choose(file,$event)" @open="open(file)" /><p v-if="!contents.length" class="empty-folder">{{ win.kind === 'trash' ? 'The Trash is empty.' : 'This folder is empty.' }}</p></div>
      <div v-else class="finder-list" @click.self="clear">
        <div class="list-heading"><button @click="win.sort = true">Name <span>▴</span></button><button @click="win.sort = 'kind'">Kind</button></div>
        <button v-for="file in contents" :key="file.id" :class="['finder-row',{selected: desktop.selectionOwner === win.id && desktop.selected.includes(file.id)}]" :aria-label="file.name" @click.stop="choose(file,$event)" @dblclick="open(file)" @keydown.enter="open(file)"><span><MacIcon :file="file" small />{{ file.name }}</span><span>{{ file.kind }}</span></button>
      </div>
    </ScrollArea>
  </div>
</template>
