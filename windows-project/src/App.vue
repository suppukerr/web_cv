<template>
  <div class="desktop">
    <!-- Wallpaper Background -->
    <div class="wallpaper" />

    <!-- Menu Bar -->
    <MenuBar />

    <!-- Desktop Icons -->
    <div class="desktop-icons">
      <DesktopIcon 
        label="Finder" 
        icon="/icons/finder.png"
        :initialX="750"
        :initialY="100"
        @click="openApp('Finder')"
      />
      <DesktopIcon 
        label="Trash" 
        icon="/icons/trash.png"
        :initialX="750"
        :initialY="180"
        @click="openApp('Trash')"
      />
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

    <!-- Bottom Control Strip -->
    <ControlStrip />
  </div>
</template>

<script>
import MenuBar from './components/MenuBar.vue'
import Dock from './components/Dock.vue'
import Window from './components/Window.vue'
import DesktopIcon from './components/DesktopIcon.vue'
import ControlStrip from './components/ControlStrip.vue'

export default {
  name: 'App',
  components: { MenuBar, Dock, Window, DesktopIcon, ControlStrip },
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
  position: relative;
  z-index: 1;
}

.desktop p {
  color: black;
  font-family: 'Geneva', 'Lucida Grande', sans-serif;
  font-size: 11px;
}
</style>
