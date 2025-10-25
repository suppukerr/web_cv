<template>
  <div class="tile" @click="$emit('select')">
    <img :src="icon" class="tile-icon" />
    <span class="tile-label">{{ label }}</span>
  </div>
</template>

<script>
export default {
  props: ['icon', 'label']
}
</script>

<style scoped>
.tile {
  width: 150px;
  height: 150px;
  background: rgba(0, 255, 0, 0.1);
  border: 2px solid #00ff00;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  cursor: pointer;
}
.tile:hover {
  transform: scale(1.1);
  background: rgba(0, 255, 0, 0.2);
}
.tile-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 10px;
}
.tile-label {
  font-size: 16px;
  color: #00ff00;
}
</style>
