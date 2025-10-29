<template>
  <div class="desktop">
    <!-- Wallpaper Background -->
    <div class="wallpaper" />

    <!-- Menu Bar -->
    <MenuBar />

    <!-- Desktop Icons -->
    <div class="desktop-icons">
      <DesktopIcon label="Finder" icon="/icons/finder.png" />
      <DesktopIcon label="Trash" icon="/icons/trash.png" />
    </div>

    <!-- Open Windows -->
    <Window
      v-if="openWindow"
      title="Finder"
      @close="openWindow = false"
    >
      <p>This is a sample Finder window.</p>
    </Window>

    <!-- Dock -->
    <Dock @launch="openApp" />
  </div>
</template>

<script>
import MenuBar from './components/MenuBar.vue'
import Dock from './components/Dock.vue'
import Window from './components/Window.vue'
import DesktopIcon from './components/DesktopIcon.vue'

export default {
  name: 'App',
  components: { MenuBar, Dock, Window, DesktopIcon },
  data() {
    return {
      openWindow: false
    }
  },
  methods: {
    openApp(name) {
      if (name === 'Finder') this.openWindow = true
    }
  }
}
</script>

<style scoped>
.desktop {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.wallpaper {
  background: url('/wallpapers/wallpapers2.png') center/cover no-repeat;
  position: absolute;
  inset: 0;
  z-index: -1;
}

.desktop-icons {
  position: absolute;
  top: 60px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 1;
}
</style>
