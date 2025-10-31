<template>
  <div 
    class="mac9-window"
    :style="{ 
      width: windowWidth + 'px', 
      height: windowHeight + 'px',
      left: windowX + 'px',
      top: windowY + 'px'
    }"
  >
    <div class="title-bar" @mousedown="startDrag">
      <div class="close-button" @click="$emit('close')"></div>
      <div class="title-bar-pattern"></div>
      <div class="title">{{ title }}</div>
      <div class="title-bar-pattern"></div>
      <div class="empty-button" @click="handleEmptyButtonClick"></div>
    </div>
    <div class="window-content">
      <slot />
    </div>
    
    <!-- Resize handles -->
    <div class="resize-handle-right" @mousedown="startResize('right', $event)"></div>
    <div class="resize-handle-bottom" @mousedown="startResize('bottom', $event)"></div>
    <div class="resize-handle-corner" @mousedown="startResize('corner', $event)"></div>
  </div>
</template>

<script>
export default {
  name: 'Mac9Window',
  props: {
    title: {
      type: String,
      default: 'Mac OS 9 HD'
    },
    initialWidth: {
      type: Number,
      default: 400
    },
    initialHeight: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      windowWidth: this.initialWidth,
      windowHeight: this.initialHeight,
      windowX: 100,
      windowY: 100,
      isDragging: false,
      isResizing: false,
      resizeDirection: '',
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      startWindowX: 0,
      startWindowY: 0
    }
  },
  methods: {
    handleEmptyButtonClick() {
      console.log('Empty button clicked - no action')
    },
    
    startDrag(e) {
      if (e.target.classList.contains('close-button') || 
          e.target.classList.contains('empty-button')) {
        return
      }
      
      this.isDragging = true
      this.startX = e.clientX - this.windowX
      this.startY = e.clientY - this.windowY
      
      document.addEventListener('mousemove', this.drag)
      document.addEventListener('mouseup', this.stopDrag)
      e.preventDefault()
    },
    
    drag(e) {
      if (!this.isDragging) return
      
      this.windowX = e.clientX - this.startX
      this.windowY = e.clientY - this.startY
      
      // Ограничиваем перемещение границами экрана
      this.windowX = Math.max(0, Math.min(window.innerWidth - this.windowWidth, this.windowX))
      this.windowY = Math.max(25, Math.min(window.innerHeight - this.windowHeight, this.windowY))
    },
    
    stopDrag() {
      this.isDragging = false
      document.removeEventListener('mousemove', this.drag)
      document.removeEventListener('mouseup', this.stopDrag)
    },
    
    startResize(direction, e) {
      this.isResizing = true
      this.resizeDirection = direction
      this.startX = e.clientX
      this.startY = e.clientY
      this.startWidth = this.windowWidth
      this.startHeight = this.windowHeight
      this.startWindowX = this.windowX
      this.startWindowY = this.windowY
      
      document.addEventListener('mousemove', this.resize)
      document.addEventListener('mouseup', this.stopResize)
      e.preventDefault()
      e.stopPropagation()
    },
    
    resize(e) {
      if (!this.isResizing) return
      
      const deltaX = e.clientX - this.startX
      const deltaY = e.clientY - this.startY
      
      if (this.resizeDirection === 'right') {
        this.windowWidth = Math.max(200, this.startWidth + deltaX)
      } else if (this.resizeDirection === 'bottom') {
        this.windowHeight = Math.max(150, this.startHeight + deltaY)
      } else if (this.resizeDirection === 'corner') {
        this.windowWidth = Math.max(200, this.startWidth + deltaX)
        this.windowHeight = Math.max(150, this.startHeight + deltaY)
      }
      
      // Ограничиваем максимальный размер
      this.windowWidth = Math.min(window.innerWidth - this.windowX, this.windowWidth)
      this.windowHeight = Math.min(window.innerHeight - this.windowY, this.windowHeight)
    },
    
    stopResize() {
      this.isResizing = false
      this.resizeDirection = ''
      document.removeEventListener('mousemove', this.resize)
      document.removeEventListener('mouseup', this.stopResize)
    }
  }
}
</script>

<style scoped>
.mac9-window {
  position: absolute;
  background: white;
  font-family: 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  font-size: 9px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  z-index: 100;
  min-width: 200px;
  min-height: 150px;

  /* 3D frame effect */
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #000;
  border-right: 2px solid #000;

  box-shadow:
    inset -1px -1px 0 #808080,
    inset 1px 1px 0 #c0c0c0;
}

.title-bar {
  background: #dcdcdc;
  border-bottom: 1px solid #808080;
  padding: 2px 6px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;
  box-shadow: inset 1px 1px 0 #fff, inset -1px -1px 0 #000;
  position: relative;
  cursor: move;
}

.close-button {
  width: 14px;
  height: 14px;
  background: url('/icons/close-button.svg');
  border: 1px solid #808080;
  cursor: pointer;
  flex-shrink: 0;
  
  /* 3D button effect */
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;
}

.close-button:active {
  /* Pressed state */
  border-top: 1px solid #000;
  border-left: 1px solid #000;
  border-bottom: 1px solid #fff;
  border-right: 1px solid #fff;
}

.empty-button {
  width: 14px;
  height: 14px;
  background: url('/icons/empty-button.svg');
  background-size: contain;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
}

.empty-button:active {
  transform: translateY(1px);
}

.title-bar-pattern {
  flex: 1;
  height: 13px;
  background-image: url('/icons/window-bar.svg');
  background-repeat: repeat-x;
  background-size: auto 13px;
  margin: 0 4px;
}

.title {
  flex-shrink: 0;
  font-weight: bold;
  font-size: 14px;
  padding: 0 8px;
  background: transparent;
  z-index: 1;
  color: black;
}

.window-content {
  flex: 1;
  overflow: auto;
  background: white;
}

/* Resize handles */
.resize-handle-right {
  position: absolute;
  top: 24px;
  right: 0;
  width: 4px;
  height: calc(100% - 24px - 16px);
  cursor: ew-resize;
  background: transparent;
}

.resize-handle-bottom {
  position: absolute;
  bottom: 0;
  left: 4px;
  width: calc(100% - 4px - 16px);
  height: 4px;
  cursor: ns-resize;
  background: transparent;
}

.resize-handle-corner {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  cursor: nw-resize;
  background-image: url('/icons/resize-corner.png');
  background-size: contain;
  background-repeat: no-repeat;
}

.resize-handle-right:hover,
.resize-handle-bottom:hover {
  background: rgba(0, 0, 255, 0.1);
}
</style>
