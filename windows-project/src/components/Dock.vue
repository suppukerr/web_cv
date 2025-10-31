<template>
  <div class="dock">
    <div class="dock-icon" @click="$emit('launch', 'Finder')">
      <img src="./icons/finder.svg" alt="Finder" />
    </div>
    <div class="dock-icon" @click="$emit('launch', 'Trash')">
      <img src="./icons/trash.svg" alt="Trash" />
    </div>
  </div>
</template>

<style scoped>
.dock {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}
.dock-icon {
  width: 48px;
  height: 48px;
  margin: 0 8px;
  cursor: pointer;
  transition: transform 0.2s;
}
.dock-icon:hover {
  transform: scale(1.2);
}
.dock-icon img {
  width: 100%;
  height: 100%;
}
</style>
