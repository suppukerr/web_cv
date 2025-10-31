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
            <div class="contact-info">
              <p class="contact">Почта: {{ resumeData.email }}</p>
              <p class="contact">Телефон: {{ resumeData.phone }}</p>
              <div class="social-links">
                <a :href="resumeData.github" target="_blank" class="social-link">
                  github: @suppukerr
                </a>
                <a :href="resumeData.telegram" target="_blank" class="social-link">
                  tg: @tchepuxa
                </a>
              </div>
            </div>
          </div>
          
          <div class="resume-section">
            <h2>Личные проекты</h2>
            <div v-for="project in resumeData.projects" :key="project.id" class="project">
              <div class="project-header">
                <h3>{{ project.title }}</h3>
                <span class="project-year">{{ project.year }}</span>
              </div>
              <p class="project-description">{{ project.description }}</p>
              <div class="project-links" v-if="project.githubLink">
                <a :href="project.githubLink" target="_blank" class="project-github">
                  github
                </a>
              </div>
            </div>
          </div>
          
          <div class="resume-section">
            <h2>Опыт работы</h2>
            <div v-for="job in resumeData.experience" :key="job.id" class="job">
              <div class="job-header">
                <h3>{{ job.title }}</h3>
                <span class="job-dates">{{ job.dates }}</span>
              </div>
              <h4 class="company">{{ job.company }}</h4>
              <p class="job-position">{{ job.position }}</p>
              <div class="job-duties">
                <strong>Обязанности:</strong>
                <ul>
                  <li v-for="duty in job.duties" :key="duty">{{ duty }}</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="resume-section">
            <h2>Навыки</h2>
            <div class="skills-list">
              <span v-for="skill in resumeData.skills" :key="skill" class="skill-tag">
                {{ skill }}
              </span>
            </div>
          </div>
          
          <div class="resume-section">
            <h2>Образование</h2>
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
      zoom: 0.8,
      rotation: 0,
      resumeData: {
        name: 'Саша Шахнова',
        email: 'avhshakhnova@gmail.com',
        phone: '+7 910 089-08-57',
        github: 'https://github.com/suppukerr',
        telegram: 'https://t.me/tchepuxa',
        projects: [
            {
            id: 1,
            year: 2025,
            title: 'Сайт-портфолио, стилизованный под macOS 9.1',
            description: 'Сайт-портфолио, выполненный в стиле macOS 9.1 с использованием Vue.js',
            githubLink: 'https://github.com/suppukerr/web_cv'
          },
          {
            id: 2,
            year: 2025,
            title: 'Биллинг-сервис',
            description: 'Создание системы биллинга с интеграцией платежных систем',
            githubLink: 'https://github.com/suppukerr/graduate_work'
          },
          {
            id: 3,
            year: 2023,
            title: 'Проект Neo4j по представлению текста в графовом виде',
            description: 'Система визуализации и анализа текстовых данных с использованием графовых баз данных',
            githubLink: 'https://github.com/suppukerr/neo4j_project'
          },
          {
            id: 4,
            year: 2023,
            title: 'CondBERT for style transfer tasks',
            description: 'Проект по нейтрализации текста и переносу стилей в различных доменах',
            githubLink: 'https://github.com/suppukerr/CondBERT-project'
          },
          {
            id: 5,
            year: 2022,
            title: 'Поисковик с метриками BM-25 и BERT',
            description: 'Разработка поисковой системы в рамках курса по информационному поиску',
            githubLink: 'https://github.com/suppukerr/HW_infosearch'
          },
          {
            id: 6,
            year: 2022,
            title: 'Учебный чат-бот',
            description: 'Образовательный чат-бот для определения погоды',
            githubLink: 'https://github.com/suppukerr/weather_bot'
          }
        ],
        experience: [
          {
            id: 1,
            dates: 'сентябрь 2023 - настоящее время',
            company: 'ООО ИТМ',
            title: 'Web-разработчик',
            position: 'Web-разработчик в отделе развития ИС управления ассортиментом',
            duties: [
              'Переписывала сервис на FastAPI',
              'Оптимизировала запросы к БД для высоконагруженной обработки документов из разных систем',    
              'Организовала потоковую передачу данных',
              'Создавала сервис авторизации и настраивала аутентификацию, включая oauth2.0',
              'Перенесла очереди из redis в rabbitmq',
              'Увеличила процента покрытия тестами до 80%',
              'Настраивала CI/CD проектов',
              'Разворачивала новый микросервис, настраивала его взаимодействие с остальными сервисами',
              'Совместно с аналитиками продумывала способы по оптимизации сервесов и улучшению пользовательского опыта'
            ]
          },
          {
            id: 2,
            dates: 'июль - август 2023',
            company: 'ООО ИТМ',
            title: 'Стажёр-разработчик',
            position: 'Стажёр-разработчик в отделе развития ИС управления ассортиментом',
            duties: [
              'Создание таблиц и витрин в Oracle и PostgreSQL',
              'Написание скриптов для миграции данных на PostgreSQL',
              'Разработка чат-бота на Python'
            ]
          }
        ],
        skills: ['Python', 'FastAPI', 'JavaScript', 'Vue.js', 'PostgreSQL', 'Oracle', 'OAuth2.0', 'CI/CD', 'Unit Testing', 'Git', 'Docker'],
        education: [
          {
            id: 1,
            degree: 'Компьютерная лингвистика',
            school: 'НИУ ВШЭ',
            year: '2019-2023'
          }
        ]
      }
    }
  },
  methods: {
    zoomIn() {
      this.zoom = Math.min(1.5, this.zoom + 0.1)
    },
    zoomOut() {
      this.zoom = Math.max(0.4, this.zoom - 0.1)
    },
    rotateDocument() {
      this.rotation = (this.rotation + 90) % 360
    },
    fitToWindow() {
      this.zoom = 0.8
      this.rotation = 0
    }
  }
}
</script>

<style scoped>
.document-viewer {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #f0f0f0;
  overflow: hidden;
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
  flex-shrink: 0;
}

.toolbar button {
  padding: 4px 8px;
  color: black;
  border: 1px solid #999;
  background: #f0f0f0;
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
  color: black;
  text-align: center;
}

.document-container {
  flex: 1;
  overflow: auto;
  background: #ccc;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  min-height: 0;
}

.document-content {
  transition: transform 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.resume-page {
  width: 21cm;
  min-height: 29.7cm;
  max-width: 21cm;
  background: white;
  padding: 2cm;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  font-family: 'Times New Roman', serif;
  font-size: 14px;
  line-height: 1.5;
  box-sizing: border-box;
}

.resume-header {
  text-align: center;
  border-bottom: 2px solid #333;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.resume-header h1 {
  font-size: 28px;
  margin: 0 0 15px 0;
  color: #333;
  font-weight: bold;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.contact {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 5px;
  flex-wrap: wrap;
}

.social-link {
  color: #0066cc;
  text-decoration: none;
  font-weight: bold;
  font-size: 14px;
}

.social-link:hover {
  text-decoration: underline;
}

.resume-section {
  margin-bottom: 30px;
  page-break-inside: avoid;
}

.resume-section h2 {
  font-size: 20px;
  color: #333;
  border-bottom: 2px solid #ccc;
  padding-bottom: 8px;
  margin-bottom: 20px;
  font-weight: bold;
}

.project {
  margin-bottom: 25px;
  border-left: 4px solid #0066cc;
  padding-left: 20px;
  page-break-inside: avoid;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 10px;
}

.project h3 {
  font-size: 16px;
  margin: 0;
  color: #333;
  font-weight: bold;
  flex: 1;
  text-align: left; /* Выравнивание по левому краю */
}

.project-description {
  margin: 8px 0 12px 0;
  color: #555;
  font-size: 14px;
  line-height: 1.4;
  text-align: left; /* Выравнивание по левому краю */
}

.project-links {
  margin-top: 10px;
  text-align: left; /* Выравнивание по левому краю */
}

.job {
  margin-bottom: 30px;
  border-left: 4px solid #28a745;
  padding-left: 20px;
  page-break-inside: avoid;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 10px;
}

.job h3 {
  font-size: 16px;
  margin: 0;
  color: #333;
  font-weight: bold;
  flex: 1;
  text-align: left; /* Выравнивание по левому краю */
}

.job-dates {
  font-weight: bold;
  color: #535bf2;
  font-size: 14px;
  flex-shrink: 0;
}

.company {
  font-size: 15px;
  margin: 5px 0;
  color: #0066cc;
  font-weight: bold;
  text-align: left; /* Выравнивание по левому краю */
}

.job-position {
  margin: 8px 0 15px 0;
  color: #555;
  font-style: italic;
  font-size: 14px;
  line-height: 1.4;
  text-align: left; /* Выравнивание по левому краю */
}

.job-duties {
  margin-top: 12px;
  color: #000;
  text-align: left; /* Выравнивание по левому краю */
}

.job-duties strong {
  color: #333;
  font-size: 14px;
  font-weight: bold;
}

.job-duties ul {
  margin: 8px 0 0 0;
  padding-left: 25px;
}

.job-duties li {
  margin-bottom: 6px;
  font-size: 13px;
  line-height: 1.4;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.skill-tag {
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  border: 1px solid #dee2e6;
  color: #495057;
  font-weight: 500;
}

.education {
  margin-bottom: 20px;
  page-break-inside: avoid;
}

.education h3 {
  font-size: 16px;
  margin: 0 0 8px 0;
  color: #333;
  font-weight: bold;
}

.education p {
  margin: 0;
  color: #666;
  font-size: 14px;
}
</style>