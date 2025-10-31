<template>
  <div class="document-viewer">
    <div class="toolbar">
      <button @click="zoomOut" :disabled="zoom <= 0.5">-</button>
      <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
      <button @click="zoomIn" :disabled="zoom >= 2">+</button>
      <button @click="rotateDocument">↻</button>
      <button @click="fitToWindow">Fit</button>
    </div>
    
    <div class="document-container" ref="container">
      <div 
        class="document-content"
        :style="{
          transform: `scale(${zoom}) rotate(${rotation}deg)`,
          transformOrigin: 'center center'
        }"
      >
        <div class="resume-page">
          <div class="resume-header">
            <h1>{{ resumeData.name }}</h1>
            <p class="contact">{{ resumeData.email }} | {{ resumeData.phone }}</p>
            <p class="location">{{ resumeData.location }}</p>
          </div>
          
          <div class="resume-section">
            <h2>Experience</h2>
            <div v-for="job in resumeData.experience" :key="job.id" class="job">
              <h3>{{ job.title }} - {{ job.company }}</h3>
              <p class="dates">{{ job.dates }}</p>
              <ul>
                <li v-for="duty in job.duties" :key="duty">{{ duty }}</li>
              </ul>
            </div>
          </div>
          
          <div class="resume-section">
            <h2>Skills</h2>
            <div class="skills-list">
              <span v-for="skill in resumeData.skills" :key="skill" class="skill-tag">
                {{ skill }}
              </span>
            </div>
          </div>
          
          <div class="resume-section">
            <h2>Education</h2>
            <div v-for="edu in resumeData.education" :key="edu.id" class="education">
              <h3>{{ edu.degree }}</h3>
              <p>{{ edu.school }} - {{ edu.year }}</p>
            </div>
          </div>
        </div>
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
      resumeData: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        experience: [
          {
            id: 1,
            title: 'Senior Developer',
            company: 'Tech Corp',
            dates: '2020 - Present',
            duties: [
              'Developed web applications using Vue.js and Node.js',
              'Led team of 5 developers',
              'Improved application performance by 40%'
            ]
          },
          {
            id: 2,
            title: 'Frontend Developer',
            company: 'Digital Agency',
            dates: '2018 - 2020',
            duties: [
              'Built responsive websites',
              'Collaborated with design team',
              'Implemented modern CSS frameworks'
            ]
          }
        ],
        skills: ['JavaScript', 'Vue.js', 'React', 'Node.js', 'CSS', 'HTML', 'Git', 'Docker'],
        education: [
          {
            id: 1,
            degree: 'Computer Science, BS',
            school: 'University of California',
            year: '2018'
          }
        ]
      }
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
  color: black;
  border: 1px solid #999;
  background: #f0f0f0;
  cursor: pointer;
  font-size: 11px;
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
  color: black;
  text-align: center;
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
}

.resume-page {
  width: 8.5in;
  min-height: 11in;
  background: white;
  padding: 1in;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  font-family: 'Times New Roman', serif;
  font-size: 12px;
  line-height: 1.4;
}

.resume-header {
  text-align: center;
  border-bottom: 2px solid #333;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.resume-header h1 {
  font-size: 24px;
  margin: 0 0 10px 0;
  color: #333;
}

.contact {
  margin: 5px 0;
  font-size: 14px;
}

.location {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.resume-section {
  margin-bottom: 25px;
}

.resume-section h2 {
  font-size: 16px;
  color: #333;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
  margin-bottom: 15px;
}

.job {
  margin-bottom: 20px;
}

.job h3 {
  font-size: 14px;
  margin: 0 0 5px 0;
  color: #333;
}

.dates {
  font-style: italic;
  color: #666;
  margin: 0 0 10px 0;
}

.job ul {
  margin: 0;
  padding-left: 20px;
}

.job li {
  margin-bottom: 5px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  border: 1px solid #ccc;
}

.education {
  margin-bottom: 15px;
}

.education h3 {
  font-size: 14px;
  margin: 0 0 5px 0;
  color: #333;
}

.education p {
  margin: 0;
  color: #666;
}
</style>