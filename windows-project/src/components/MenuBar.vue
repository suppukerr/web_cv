<template>
  <div class="menu-bar">
    <div class="left-section">
      <span class="apple-icon">
        <img src="./icons/apple.svg" alt="Apple" />
      </span>
      <span class="menu-item">File</span>
      <span class="menu-item">Edit</span>
      <span class="menu-item">View</span>
      <span class="menu-item">Special</span>
      <span class="menu-item">Help</span>
    </div>
    <div class="right-section">
      <span class="time">{{ time }}</span>
      <span class="placeholder-icon">
        <img src="./icons/placeholder.svg" alt="Placeholder" />
      </span>
      <span class="finder-icon">
        <img src="./icons/finder.svg" alt="Finder" />
      </span>
      <span class="finder-text">Finder</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuBar',
  data() {
    return {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  },
  mounted() {
    setInterval(() => {
      this.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }, 60000)
  }
}
</script>

<style scoped>

.menu-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: #c0c0c0;
  border-bottom: 1px solid #808080;
  border-radius: 0 0 0 0;
  color: black;
  font-size: 11px;
  font-family: 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  z-index: 1000;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 6px;
}

.apple-icon img {
  display: flex;
  align-items: center;
  height: 16px;
}

.menu-item {
  cursor: pointer;
  padding: 1px 2px;
  font-size: 11px;
}

.menu-item:hover {
  background-color: #2F2F99;
}

.time {
  font-size: 11px;
  min-width: 35px;
  text-align: right;
}

.finder-icon {
  display: flex;
  align-items: center;
  height: 16px;
}

.finder-icon img {
  height: 16px;
  width: auto;
  max-width: 16px;
}

.finder-text {
  font-size: 11px;
}
</style>
