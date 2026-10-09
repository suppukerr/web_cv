<script setup>
import { computed } from 'vue'
import { allFiles, desktop, children, visibleChildren, open, select } from '../composables/useDesktop'
import { categoryName, imagePaths, statusName } from '../data/tableware.js'
import DesktopIcon from './DesktopIcon.vue'
import MacIcon from './MacIcon.vue'
import TablewareImage from './TablewareImage.vue'
import ScrollArea from './ScrollArea.vue'
const props = defineProps({ win:Object })
const folder = computed(() => allFiles.value.find(file => file.id === props.win.fileId))
const parent = computed(() => allFiles.value.find(file => file.id === folder.value?.parent))
const isIndex = computed(() => props.win.kind === 'collection-index')
const contents = computed(() => {
  const list = props.win.kind === 'trash' ? allFiles.value.filter(f => desktop.trash.includes(f.id)) : visibleChildren(props.win)
  if (isIndex.value || !props.win.sort) return list
  return [...list].sort((a,b) => (props.win.sort === 'kind' ? a.kind.localeCompare(b.kind) : 0) || a.name.localeCompare(b.name))
})
const fields = ['category', 'manufacturer', 'country', 'status']
const filterOptions = computed(() => Object.fromEntries(fields.map(field => [field, [...new Set(children('tableware-index').map(file => file.item[field] || 'Unspecified'))].sort()])))
const demoCount = computed(() => contents.value.filter(file => file.item?.demo).length)
function choose(file,e) { select(file.id,props.win.id,e.metaKey || e.ctrlKey || e.shiftKey) }
function clear(e) { if(e.target === e.currentTarget) {desktop.selected = []; desktop.selectionOwner = props.win.id} }
function filterChanged() { if (desktop.selectionOwner === props.win.id) desktop.selected = [] }
function sortBy(field) {
  props.win.descending = props.win.sort === field ? !props.win.descending : false
  props.win.sort = field
}
function resetFilters() { props.win.collectionFilters = { category: '', manufacturer: '', country: '', status: '' }; filterChanged() }
function label(field, value) { return field === 'category' ? categoryName(value) : field === 'status' ? statusName(value) : value }
</script>
<template>
  <div class="finder-window">
    <div class="finder-info"><span>{{ contents.length }} {{ contents.length === 1 ? 'item' : 'items' }}</span><span>{{ win.kind === 'trash' ? 'Drag custom folders here to discard them' : folder?.tableware ? demoCount ? `${demoCount} demonstration ${demoCount === 1 ? 'item' : 'items'}` : 'Vintage Tableware' : 'Portfolio' }}</span></div>
    <div v-if="folder?.tableware" class="document-toolbar collection-path"><button v-if="parent" class="platinum-button" :aria-label="`Open parent folder: ${parent.name}`" @click="open(parent)">◂ {{ parent.name }}</button><span class="collection-location">{{ folder.name }}</span></div>
    <div v-if="isIndex" class="collection-controls">
      <label v-for="field in fields" :key="field">{{ field === 'status' ? 'Collection status' : field.charAt(0).toUpperCase() + field.slice(1) }}<select v-model="win.collectionFilters[field]" class="platinum-select" @change="filterChanged"><option value="">All</option><option v-for="value in filterOptions[field]" :key="value" :value="value">{{ label(field, value) }}</option></select></label>
      <div class="collection-sort"><label>Sort by<select v-model="win.sort" class="platinum-select"><option value="name">Name</option><option value="kind">Kind</option><option v-for="field in fields" :key="field" :value="field">{{ field.charAt(0).toUpperCase() + field.slice(1) }}</option></select></label><button class="platinum-button" :aria-label="win.descending ? 'Sort ascending' : 'Sort descending'" @click="win.descending = !win.descending">{{ win.descending ? '▾' : '▴' }}</button><button class="platinum-button" @click="resetFilters">Show All</button></div>
    </div>
    <ScrollArea>
      <div v-if="win.view === 'icons'" :class="['finder-icons', { 'tableware-icons': folder?.tableware }]" @click="clear"><DesktopIcon v-for="file in contents" :key="file.id" :file="file" :selected="desktop.selectionOwner === win.id && desktop.selected.includes(file.id)" @select="choose(file,$event)" @open="open(file)" /><p v-if="!contents.length" class="empty-folder">{{ isIndex ? 'No items match these filters.' : win.kind === 'trash' ? 'The Trash is empty.' : 'This folder is empty.' }}</p></div>
      <div v-else :class="['finder-list', { 'collection-list': isIndex }]" @click.self="clear">
        <div class="list-heading"><button @click="isIndex ? sortBy('name') : win.sort = 'name'">Name <span v-if="!isIndex || win.sort === 'name'">{{ win.descending ? '▾' : '▴' }}</span></button><template v-if="isIndex"><button v-for="field in fields" :key="field" @click="sortBy(field)">{{ field.charAt(0).toUpperCase() + field.slice(1) }}<span v-if="win.sort === field">{{ win.descending ? '▾' : '▴' }}</span></button></template><button v-else @click="win.sort = 'kind'">Kind</button></div>
        <button v-for="file in contents" :key="file.id" :class="['finder-row',{selected: desktop.selectionOwner === win.id && desktop.selected.includes(file.id)}]" :aria-label="file.name" @click.stop="choose(file,$event)" @dblclick="open(file)" @keydown.enter="open(file)"><span><TablewareImage v-if="file.item" :path="imagePaths(file.item)[0]" thumbnail small /><MacIcon v-else :file="file" small />{{ file.name }}</span><template v-if="isIndex"><span v-for="field in fields" :key="field">{{ label(field, file.item[field] || 'Unspecified') }}</span></template><span v-else>{{ file.item ? 'JPEG image' : file.kind }}</span></button>
        <p v-if="!contents.length" class="empty-folder">{{ isIndex ? 'No items match these filters.' : 'This folder is empty.' }}</p>
      </div>
    </ScrollArea>
  </div>
</template>
