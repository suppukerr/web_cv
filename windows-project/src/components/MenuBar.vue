<template>
  <div class="menu-bar">
    <span class="apple"></span>
    <span class="menu">Finder</span>
    <div class="time">{{ time }}</div>
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
  position: absolute;
  top: 0;
  left: 0;
  height: 24px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}
.apple {
  font-weight: bold;
}
.menu {
  margin-left: 10px;
}
.time {
  margin-right: 10px;
}
</style>
