<template>
  <div class="desktop-icon">
    <img :src="icon" :alt="label" />
    <span>{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: 'DesktopIcon',
  props: ['icon', 'label']
}
</script>

<style scoped>
.desktop-icon {
  width: 64px;
  text-align: center;
  color: white;
  cursor: pointer;
}
.desktop-icon img {
  width: 64px;
  height: 64px;
}
.desktop-icon span {
  font-size: 12px;
  margin-top: 4px;
  display: block;
}
</style>
