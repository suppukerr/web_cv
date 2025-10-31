<template>
  <div class="vintage-window">
    <div class="window-header">
      <div class="header-title">Mac OS 9 HD</div>
      <div class="header-controls">
        <div class="control-button" />
        <div class="control-button" />
        <div class="control-button" />
      </div>
    </div>
    <div class="window-subtitle">
      7 items, 12.44 GB available
    </div>
    <div class="window-body">
      <slot />
    </div>
    <div class="window-footer"></div>
  </div>
</template>

<style scoped>
.vintage-window {
  width: 600px;
  border: 2px solid #999;
  background: #efefef;
  box-shadow: inset -1px -1px 0 #000, inset 1px 1px 0 #fff;
  font-family: 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  color: black;
}

.window-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ccc;
  padding: 4px;
  border-bottom: 1px solid #666;
}

.header-title {
  font-family: 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  font-weight: bold;
  font-size: 12pt;
  text-align: center;
  flex-grow: 1;
}

.header-controls {
  display: flex;
  gap: 4px;
}

.control-button {
  width: 12px;
  height: 12px;
  border: 1px solid #000;
  background: #ddd;
}

.window-subtitle {
  font-size: 9pt;
  text-align: center;
  padding: 2px 0;
  border-bottom: 1px solid #aaa;
}

.window-body {
  padding: 16px;
  background: white;
  min-height: 300px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.window-footer {
  height: 20px;
  background: #ccc;
  border-top: 1px solid #aaa;
}
</style>
