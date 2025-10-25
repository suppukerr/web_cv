<template>
  <div class="dashboard">
    <Tile icon=\"/icons/memory.png\" label=\"Memory\" @select=\"open('memory')\" />
    <Tile icon=\"/icons/music.png\" label=\"Music\" @select=\"open('music')\" />
    <Tile icon=\"/icons/settings.png\" label=\"Settings\" @select=\"open('settings')\" />
    <Tile icon=\"/icons/games.png\" label=\"Games\" @select=\"open('games')\" />
  </div>
</template>

<script>
import Tile from './Tile.vue'

export default {
  components: { Tile },
  methods: {
    open(section) {
      console.log('Open section:', section)
    }
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  height: 100vh;
  background: radial-gradient(#002800, black);
}
</style>
