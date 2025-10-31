<template>
  <div 
    class="desktop-icon" 
    :class="{ selected: isSelected }"
    :style="{ left: x + 'px', top: y + 'px' }"
    @mousedown="startDrag"
    @click="handleClick"
    @dblclick="handleDoubleClick"
  >
    <img :src="icon" :alt="label" />
    <span>{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: 'DesktopIcon',
  props: ['icon', 'label', 'initialX', 'initialY', 'isSelected'],
  data() {
    return {
      x: this.initialX || 0,
      y: this.initialY || 0,
      isDragging: false,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0,
      clickTimeout: null
    }
  },
  methods: {
    startDrag(e) {
      this.isDragging = true
      this.startX = e.clientX
      this.startY = e.clientY
      this.offsetX = e.clientX - this.x
      this.offsetY = e.clientY - this.y
      
      document.addEventListener('mousemove', this.drag)
      document.addEventListener('mouseup', this.stopDrag)
      e.preventDefault()
    },
    
    drag(e) {
      if (!this.isDragging) return
      
      this.x = e.clientX - this.offsetX
      this.y = e.clientY - this.offsetY
      
      this.x = Math.max(0, Math.min(window.innerWidth - 64, this.x))
      this.y = Math.max(25, Math.min(window.innerHeight - 80, this.y))
    },
    
    stopDrag() {
      this.isDragging = false
      document.removeEventListener('mousemove', this.drag)
      document.removeEventListener('mouseup', this.stopDrag)
    },
    
    handleClick(e) {
      const dragDistance = Math.sqrt(
        Math.pow(e.clientX - this.startX, 2) + Math.pow(e.clientY - this.startY, 2)
      )
      
      if (dragDistance < 5) {
        this.$emit('click', this.label, e)
      }
    },
    
    handleDoubleClick(e) {
      e.preventDefault()
      this.$emit('iconClick', this.label)
    }
  }
}
</script>

<style scoped>
.desktop-icon {
  position: absolute;
  width: 64px;
  text-align: center;
  color: white;
  cursor: grab;
  user-select: none;
  font-family: 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  padding: 2px;
  z-index: 10;
}

.desktop-icon:active {
  cursor: grabbing;
}

.desktop-icon.selected {
  background-color: rgba(0, 0, 255, 0.3);
  border: 1px dotted white;
}

.desktop-icon img {
  width: 32px;
  height: 32px;
  pointer-events: none;
}

.desktop-icon span {
  font-size: 11px;
  margin-top: 4px;
  display: block;
  font-family: 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  pointer-events: none;
  background-color: #090933;
  padding: 1px 3px;
  border-radius: 0px;
  color: #D3D3FF;
}

.desktop-icon.selected span {
  background-color: #1D5DEC;
  color: #090933;
}
</style>
