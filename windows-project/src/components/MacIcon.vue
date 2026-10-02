<script setup>
import { computed } from 'vue'
import { iconFor } from '../data/files'
const props = defineProps({ file: Object, small: Boolean })
const source = computed(() => iconFor(props.file))
</script>
<template><img :src="source" :class="['mac-icon', { small }]" alt="" draggable="false" /></template>
