<template>
  <div class="desktop">
    <div
      v-for="icon in icons"
      :key="icon.id"
      class="desktop-icon"
      :style="{ top: icon.top + 'px', left: icon.left + 'px' }"
      @dblclick="openWindow(icon.windowId)"
    >
      <img :src="icon.img" />
      <div>{{ icon.name }}</div>
    </div>

    <!-- Окна -->
    <div
      v-for="win in windows"
      :key="win.id"
      v-show="win.visible"
      class="window"
      :style="{ top: win.y + 'px', left: win.x + 'px', zIndex: win.z }"
    >
      <div class="window-header" @mousedown="startDrag($event, win)">
        {{ win.title }}
        <button @click="closeWindow(win.id)">X</button>
      </div>
      <div class="window-content">{{ win.content }}</div>
    </div>

    <!-- Панель задач -->
    <div class="taskbar">
      <div class="start-button" @click="toggleStartMenu">
        <img src="https://win98icons.alexmeub.com/icons/png/windows-0.png" width="20" />
        Пуск
      </div>
      <div class="clock">{{ time }}</div>
    </div>

    <!-- Меню Пуск -->
    <div v-show="startMenuVisible" class="start-menu">
      <div class="start-menu-item" @click="openWindow('about')">О программе</div>
      <div class="start-menu-item" @click="alert('Выключение...')">Завершение работы</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const startMenuVisible = ref(false)
const zIndex = ref(100)
const time = ref("")
const dragging = ref(null)

const icons = ref([
  {
    id: "computer",
    name: "Мой компьютер",
    img: "https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png",
    top: 20,
    left: 20,
    windowId: "computer",
  },
  {
    id: "trash",
    name: "Корзина",
    img: "https://win98icons.alexmeub.com/icons/png/recycle_bin_full-4.png",
    top: 140,
    left: 20,
    windowId: "trash",
  },
  {
    id: "",
    img: "https://win98icons.alexmeub.com/icons/png/msn3-3.png",
  }
])

const windows = ref([
  {
    id: "computer",
    title: "Мой компьютер",
    content: "Окно \"Мой компьютер\"",
    x: 100,
    y: 100,
    z: 100,
    visible: false,
  },
  {
    id: "trash",
    title: "Корзина",
    content: "Корзина пуста",
    x: 200,
    y: 120,
    z: 100,
    visible: false,
  },
  {
    id: "about",
    title: "О программе",
    content: "Это Vue-десктоп в стиле Windows 95",
    x: 150,
    y: 150,
    z: 100,
    visible: false,
  },
])

const toggleStartMenu = () => {
  startMenuVisible.value = !startMenuVisible.value
}

const openWindow = (id) => {
  const w = windows.value.find((w) => w.id === id)
  if (w) {
    w.visible = true
    w.z = ++zIndex.value
  }
  startMenuVisible.value = false
}

const closeWindow = (id) => {
  const w = windows.value.find((w) => w.id === id)
  if (w) w.visible = false
}

const updateTime = () => {
  const now = new Date()
  time.value = now.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

const startDrag = (e, win) => {
  dragging.value = {
    win,
    offsetX: e.clientX - win.x,
    offsetY: e.clientY - win.y,
  }
  document.addEventListener("mousemove", onDrag)
  document.addEventListener("mouseup", stopDrag)
}

const onDrag = (e) => {
  if (dragging.value) {
    dragging.value.win.x = e.clientX - dragging.value.offsetX
    dragging.value.win.y = e.clientY - dragging.value.offsetY
  }
}

const stopDrag = () => {
  dragging.value = null
  document.removeEventListener("mousemove", onDrag)
  document.removeEventListener("mouseup", stopDrag)
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 60000)
})
</script>

<style scoped>
.desktop {
  background: black; /* Темный фон для контраста */
  width: 100vw;
  height: 100vh;
  font-family: "MS Sans Serif", sans-serif;
  position: relative;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.desktop::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150vw; /* Увеличенный размер чтобы не было видно границ */
  height: 150vh;
  background: url('./assets/dash.png') center center no-repeat;
  background-size: cover;
  transform-origin: center center; /* Ось вращения по центру */
  transform: translate(-50%, -50%);
  animation: rotateLeftToRight 10s linear infinite; /* Вращение слева направо */
  z-index: 0;
  opacity: 0.6; /* Прозрачность */
}

@keyframes rotateLeftToRight {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.desktop-icon {
  position: absolute;
  width: 80px;
  text-align: center;
  color: white;
  cursor: pointer;
  z-index: 1; /* Поверх фонового изображения */
}

.desktop-icon img {
  width: 40px;
  height: 40px;
}

.window {
  position: absolute;
  background: #c0c0c0;
  border: 2px solid black;
  box-shadow: 2px 2px 0 #808080;
  min-width: 200px;
  min-height: 150px;
  z-index: 2;
}

.window-header {
  background: navy;
  color: white;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
}

.window-content {
  padding: 10px;
  background: white;
}

.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: #c0c0c0;
  border-top: 2px solid #fff;
  border-bottom: 2px solid #808080;
  display: flex;
  align-items: center;
  padding: 0 5px;
  z-index: 9999;
  box-sizing: border-box;
}

.start-button {
  background: #c0c0c0;
  border: 2px solid #fff;
  border-right-color: #808080;
  border-bottom-color: #808080;
  padding: 5px 10px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.clock {
  margin-left: auto;
  padding: 0 10px;
  border-left: 2px solid #808080;
}

.start-menu {
  position: fixed;
  bottom: 40px;
  left: 0;
  width: 200px;
  background: #c0c0c0;
  border: 2px solid black;
  z-index: 10000;
  display: flex;
  flex-direction: column;
}

.start-menu-item {
  padding: 5px;
  cursor: pointer;
}

.start-menu-item:hover {
  background: navy;
  color: white;
}
</style>
