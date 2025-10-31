<template>
  <div class="desktop" @click="clearSelection">
    <!-- Wallpaper Background -->
    <div class="wallpaper" />

    <!-- Menu Bar -->
    <MenuBar />

    <!-- Desktop Icons -->
    <div class="desktop-icons">
      <DesktopIcon 
        label="Finder" 
        icon="/icons/finder.svg"
        :initialX="20"
        :initialY="40"
        :isSelected="selectedIcon === 'Finder'"
        @click="selectIcon"
        @iconClick="openApp"
      />
      <DesktopIcon 
        label="Resume" 
        icon="/icons/resume.svg"
        :initialX="20"
        :initialY="120"
        :isSelected="selectedIcon === 'Resume'"
        @click="selectIcon"
        @iconClick="openApp"
      />
      <DesktopIcon 
        label="Trash" 
        icon="/icons/trash.svg"
        :initialX="20"
        :initialY="200"
        :isSelected="selectedIcon === 'Trash'"
        @click="selectIcon"
        @iconClick="openApp"
      />
    </div>

    <!-- Open Windows -->
    <WindowNew
      v-if="openWindow === 'Finder'"
      title="Finder"
      @close="openWindow = null"
      :style="{ width: '800px', height: '600px' }"
    >
      <DocumentViewer />
    </WindowNew>

    <WindowNew
      v-if="openWindow === 'Resume'"
      title="Resume"
      @close="openWindow = null"
      :style="{ width: '800px', height: '800px' }"
    >
      <PdfViewer />
    </WindowNew>

  </div>
</template>

<script>
import MenuBar from './components/MenuBar.vue'
import Dock from './components/Dock.vue'
import WindowNew from './components/WindowNew.vue'
import DesktopIcon from './components/DesktopIcon.vue'
import DocumentViewer from './components/DocumentViewer.vue'
import PdfViewer from './components/PdfViewer.vue'

export default {
  name: 'App',
  components: { MenuBar, Dock, WindowNew, DesktopIcon, DocumentViewer, PdfViewer },
  data() {
    return {
      openWindow: null,
      selectedIcon: null
    }
  },
  methods: {
    openApp(name) {
      this.openWindow = name
    },
    selectIcon(label, e) {
      if (e && e.stopPropagation) {
        e.stopPropagation()
      }
      this.selectedIcon = this.selectedIcon === label ? null : label
    },
    clearSelection() {
      this.selectedIcon = null
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
  z-index: 0;
}

.desktop-icons {
  position: relative;
  z-index: 1;
}
</style>
