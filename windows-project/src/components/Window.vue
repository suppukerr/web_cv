<template>
  <div class="window">
    <div class="title-bar">
      <div class="buttons">
        <span class="close" @click="$emit('close')"></span>
        <span class="minimize"></span>
        <span class="maximize"></span>
      </div>
      <span class="title">{{ title }}</span>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Window',
  props: ['title']
}
</script>

<style scoped>
.window {
  position: absolute;
  top: 100px;
  left: 100px;
  width: 400px;
  height: 300px;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
}

.title-bar {
  height: 30px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  padding: 0 10px;
  justify-content: space-between;
  font-size: 14px;
  user-select: none;
}
 .title-bar .title {
  font-family: 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 700; /* use Geneva Bold */
 }

.buttons {
  display: flex;
  gap: 6px;
}
.buttons span {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 6px 0 0 0;
}
.close { background: url('./icons/close-button.svg'); }
.minimize { background: #ffbd2e; }
.maximize { background: #27c93f; }

.content {
  flex: 1;
  padding: 10px;
  background: white;
  overflow: auto;
}
</style>
