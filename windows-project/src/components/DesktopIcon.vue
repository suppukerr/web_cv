<template>
  <div 
    class="desktop-icon" 
    :style="{ left: x + 'px', top: y + 'px' }"
    @mousedown="startDrag"
    @click="handleClick"
  >
    <img :src="icon" :alt="label" />
    <span>{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: 'DesktopIcon',
  props: ['icon', 'label', 'initialX', 'initialY'],
  data() {
    return {
      x: this.initialX || 0,
      y: this.initialY || 0,
      isDragging: false,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0
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
      
      // Ограничиваем перемещение границами экрана
      this.x = Math.max(0, Math.min(window.innerWidth - 64, this.x))
      this.y = Math.max(0, Math.min(window.innerHeight - 80, this.y))
    },
    
    stopDrag() {
      this.isDragging = false
      document.removeEventListener('mousemove', this.drag)
      document.removeEventListener('mouseup', this.stopDrag)
    },
    
    handleClick(e) {
      // Предотвращаем клик если была попытка перетаскивания
      const dragDistance = Math.sqrt(
        Math.pow(e.clientX - this.startX, 2) + Math.pow(e.clientY - this.startY, 2)
      )
      
      if (dragDistance < 5) { // Клик только если перемещение меньше 5px
        this.$emit('click', this.label)
      }
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
  font-family: 'Geneva', 'Lucida Grande', sans-serif;
}

.desktop-icon:active {
  cursor: grabbing;
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
  font-family: 'Geneva', 'Lucida Grande', sans-serif;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  pointer-events: none;
}
</style>
