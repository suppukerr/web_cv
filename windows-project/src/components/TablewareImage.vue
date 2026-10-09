<script setup>
import { ref, watch, computed } from 'vue'
import { asset } from '../data/files.js'
const props = defineProps({ path: String, alt: { type: String, default: '' }, thumbnail: Boolean, small: Boolean })
const failed = ref(false)
const source = computed(() => props.path ? asset(props.path) : null)
watch(source, () => { failed.value = false })
</script>
<template>
  <span :class="['tableware-photo', { thumbnail, small }]">
    <img v-if="source && !failed" :src="source" :alt="alt" :loading="thumbnail ? 'lazy' : 'eager'" draggable="false" @error="failed = true" />
    <span v-else class="tableware-photo-missing" role="img" :aria-label="alt ? `Photograph unavailable: ${alt}` : 'Photograph unavailable'"><img :src="asset('mac/document.svg')" alt="" /><span v-if="!small">No photograph</span></span>
  </span>
</template>
