<template>
  <div class="document-viewer">
    <div class="toolbar">
      <button @click="zoomOut" :disabled="zoom <= 0.5">-</button>
      <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
      <button @click="zoomIn" :disabled="zoom >= 2">+</button>
      <button @click="rotateDocument">↻</button>
      <button @click="fitToWindow">Fit</button>
      <button @click="downloadPdf">Download</button>
    </div>
    
    <div class="document-container" ref="container">
      <div 
        class="document-content"
        :style="{
          transform: `scale(${zoom}) rotate(${rotation}deg)`,
          transformOrigin: 'center center'
        }"
      >
        <iframe
          :src="pdfUrl"
          class="pdf-viewer"
          frameborder="0"
          @load="onPdfLoad"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DocumentViewer',
  data() {
    return {
      zoom: 1,
      rotation: 0,
      pdfUrl: '/documents/my_resume.pdf',
      pdfLoaded: false
    }
  },
  methods: {
    zoomIn() {
      this.zoom = Math.min(2, this.zoom + 0.1)
    },
    zoomOut() {
      this.zoom = Math.max(0.5, this.zoom - 0.1)
    },
    rotateDocument() {
      this.rotation = (this.rotation + 90) % 360
    },
    fitToWindow() {
      this.zoom = 1
      this.rotation = 0
    },
    downloadPdf() {
      const link = document.createElement('a')
      link.href = this.pdfUrl
      link.download = 'resume.pdf'
      link.click()
    },
    onPdfLoad() {
      this.pdfLoaded = true
    }
  }
}
</script>

<style scoped>
.document-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f0f0f0;
}

.toolbar {
  background: #e0e0e0;
  border-bottom: 1px solid #ccc;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
}

.toolbar button {
  padding: 4px 8px;
  border: 1px solid #999;
  background: #f0f0f0;
  color: black;
  cursor: pointer;
  font-size: 11px;
  border-radius: 2px;
}

.toolbar button:hover {
  background: #e0e0e0;
}

.toolbar button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zoom-level {
  font-weight: bold;
  min-width: 40px;
  text-align: center;
  color: black;
}

.document-container {
  flex: 1;
  overflow: auto;
  background: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.document-content {
  transition: transform 0.3s ease;
  width: 100%;
  height: 100%;
  max-width: 800px;
  max-height: 1000px;
}

.pdf-viewer {
  width: 100%;
  height: 100%;
  min-height: 600px;
  background: white;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  border: 1px solid #999;
}
</style>