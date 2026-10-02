<script setup>
import { computed, ref } from 'vue'
import { cv } from '../data/cv'
import { asset } from '../data/files'
import { allFiles, open, desktop, focus } from '../composables/useDesktop'
import ScrollArea from './ScrollArea.vue'
const props = defineProps({ win:Object })
const file = computed(() => allFiles.value.find(f => f.id === props.win.fileId))
const zoom = ref(100)
</script>
<template>
  <div class="portfolio-document">
    <div v-if="file.id === 'resume'" class="document-toolbar"><a class="platinum-button" :href="asset('documents/my_resume_1.pdf')" download="Sasha-Shakhnova-Resume.pdf">Download PDF</a><a :href="asset('documents/my_resume_1.pdf')" target="_blank" rel="noopener">Open in browser</a></div>
    <template v-if="file.id === 'resume'"><div class="pdf-container"><iframe class="pdf-viewer" :src="asset('documents/my_resume_1.pdf')" title="Sasha Shakhnova — Resume PDF" /><button v-if="desktop.activeId !== win.id" class="pdf-focus-shield" aria-label="Activate Resume PDF" @click="focus(win.id)" /></div><p class="pdf-fallback">If your browser cannot display PDFs, use Download PDF above.</p></template>
    <template v-else>
      <div class="document-toolbar"><span>{{ file.id === 'skills' ? 'System Profiler' : 'SimpleText' }}</span><span class="toolbar-spacer" /><button class="platinum-button" aria-label="Decrease text size" :disabled="zoom <= 80" @click="zoom -= 10">A−</button><span>{{ zoom }}%</span><button class="platinum-button" aria-label="Increase text size" :disabled="zoom >= 160" @click="zoom += 10">A+</button></div>
      <ScrollArea><article class="document-page" :style="{fontSize: (12*zoom/100)+'px'}">
        <template v-if="file.id === 'about'"><h1>{{ cv.name }}</h1><p class="document-subtitle">Web-разработчик · Python / FastAPI / Vue.js</p><hr /><p>{{ cv.experience[0].position }} — {{ cv.experience[0].company }}.</p><p>Мой опыт, проекты и навыки собраны в папках этого компьютера.</p><h2>Образование</h2><div v-for="edu in cv.education" :key="edu.id"><h3>{{ edu.degree }}</h3><p>{{ edu.school }} · {{ edu.year }}</p></div><div class="document-actions"><button class="platinum-button" @click="open(allFiles.find(f => f.id === 'experience'))">Experience</button><button class="platinum-button" @click="open(allFiles.find(f => f.id === 'projects'))">Projects</button><button class="platinum-button" @click="open(allFiles.find(f => f.id === 'resume'))">Resume.pdf</button></div></template>
        <template v-else-if="file.id === 'contacts'"><h1>{{ cv.name }}</h1><p class="document-subtitle">Contacts</p><dl class="contact-list"><dt>Email</dt><dd><a :href="'mailto:'+cv.email">{{ cv.email }}</a></dd><dt>Phone</dt><dd><a :href="'tel:'+cv.phone.replace(/[^+0-9]/g,'')">{{ cv.phone }}</a></dd><dt>GitHub</dt><dd><a :href="cv.github" target="_blank" rel="noopener noreferrer">@suppukerr</a></dd><dt>Telegram</dt><dd><a :href="cv.telegram" target="_blank" rel="noopener noreferrer">@tchepuxa</a></dd></dl></template>
        <template v-else-if="file.id === 'skills'"><h1>Skills</h1><p class="document-subtitle">{{ cv.name }} — System Profiler</p><table class="skills-table"><tbody><tr v-for="(skill,i) in cv.skills" :key="skill"><th>{{ i+1 }}</th><td>{{ skill }}</td><td>Installed</td></tr></tbody></table></template>
        <template v-else-if="file.project"><h1>{{ file.project.title }}</h1><p class="document-subtitle">Личный проект · {{ file.project.year }}</p><hr /><p>{{ file.project.description }}</p><p><a :href="file.project.githubLink" target="_blank" rel="noopener noreferrer">View project on GitHub ↗</a></p></template>
        <template v-else-if="file.job"><h1>{{ file.job.title }}</h1><p class="document-subtitle">{{ file.job.company }} · {{ file.job.dates }}</p><hr /><p>{{ file.job.position }}</p><h2>Обязанности</h2><ul><li v-for="duty in file.job.duties" :key="duty">{{ duty }}</li></ul></template>
      </article></ScrollArea>
    </template>
  </div>
</template>
