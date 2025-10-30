<template>
  <div class="control-strip">
    <img src="/control-strip.svg" alt="Control Strip" />
  </div>
  </template>

<style scoped>
.control-strip {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  pointer-events: none; /* let clicks pass to desktop/dock */
}
.control-strip img {
  height: 90px;
  max-width: 100vw;
}
</style>
