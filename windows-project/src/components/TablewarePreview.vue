<script setup>
import { computed, ref } from 'vue'
import { allFiles, open, select, activeWindow } from '../composables/useDesktop.js'
import { categoryName, imagePaths, purchaseLink, statusName } from '../data/tableware.js'
import TablewareImage from './TablewareImage.vue'
import ScrollArea from './ScrollArea.vue'
const props = defineProps({ win: Object })
const file = computed(() => allFiles.value.find(file => file.id === props.win.fileId))
const item = computed(() => file.value?.item || {})
const images = computed(() => imagePaths(item.value))
const photo = ref(0)
const buy = computed(() => purchaseLink(item.value))
function showFolder() {
  const folder = allFiles.value.find(folder => folder.id === file.value?.parent)
  if (!folder) return
  open(folder)
  select(file.value.id, activeWindow.value.id)
}
</script>
<template>
  <div class="tableware-preview">
    <div class="document-toolbar tableware-viewer-toolbar"><span>PictureViewer</span><span v-if="item.demo">· Demonstration</span><span class="toolbar-spacer" /><template v-if="images.length > 1"><button class="platinum-button" aria-label="Previous photograph" :disabled="photo === 0" @click="photo--">◂</button><span aria-live="polite">{{ photo + 1 }} of {{ images.length }}</span><button class="platinum-button" aria-label="Next photograph" :disabled="photo >= images.length - 1" @click="photo++">▸</button></template><button class="platinum-button" @click="showFolder">Show in Finder</button></div>
    <ScrollArea><article class="tableware-preview-page">
      <div class="tableware-large-photo"><TablewareImage :path="images[photo]" :alt="`${item.name || 'Untitled'} — photograph ${photo + 1}`" /></div>
      <div class="tableware-details"><h1>{{ item.name || 'Untitled' }}</h1><dl>
        <dt>Manufacturer</dt><dd>{{ item.manufacturer || 'Unspecified' }}</dd>
        <dt>Country</dt><dd>{{ item.country || 'Unspecified' }}</dd>
        <dt>Period</dt><dd>{{ item.year || 'Unspecified' }}</dd>
        <dt>Category</dt><dd>{{ categoryName(item.category) }}</dd>
        <dt>Status</dt><dd>{{ statusName(item.status) }}</dd>
      </dl><p>{{ item.description || 'No description recorded.' }}</p>
      <a v-if="buy" class="platinum-button" :href="buy" target="_blank" rel="noopener noreferrer">Find / Buy ↗</a>
      <p v-if="item.demo" class="tableware-demo-note">Demonstration item · collection status is illustrative.<br />Photograph: The Metropolitan Museum of Art, CC0. <a :href="item.sourceUrl" target="_blank" rel="noopener noreferrer">Museum record ↗</a></p></div>
    </article></ScrollArea>
  </div>
</template>
