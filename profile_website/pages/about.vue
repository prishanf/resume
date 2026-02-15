<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-white via-inverse to-secondary/10 py-12 overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -left-24 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8">
            <UserIcon class="w-4 h-4" />
            <span>{{ about?.badge || 'Executive Profile' }}</span>
          </div>
          
          <h1 class="text-5xl md:text-7xl font-black text-primary mb-8 tracking-tighter leading-[0.9]">
            {{ about?.heroTitlePart1 || 'The Person' }} <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{{ about?.heroTitlePart2 || 'Behind the Work.' }}</span>
          </h1>
          
          <p class="text-xl text-gray-600 max-w-2xl font-medium leading-relaxed mb-12">
            {{ about?.heroDescription || 'Technology leader, hands-on architect, and mentor with over 20 years of experience building scalable enterprise solutions.' }}
          </p>

          <!-- Quick Stats -->
          <div v-if="about?.stats" class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
            <div v-for="stat in about.stats" :key="stat.label" class="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/50">
              <div class="text-3xl font-black text-primary mb-1">{{ stat.value }}</div>
              <div class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-24 bg-white relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <!-- Left Column: Biography -->
          <div class="lg:col-span-8">
            <div class="prose prose-lg prose-primary max-w-none">
              <ContentDoc />
            </div>
          </div>

          <!-- Right Column: Sidebar info -->
          <div class="lg:col-span-4 space-y-12">
            <!-- Stack / Recognition Sidebar Cards could go here if extracted from MD -->
            <div class="sticky top-24 space-y-8">
              <div class="bg-inverse/30 p-8 rounded-3xl border border-gray-100">
                <h3 class="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-6">Quick Links</h3>
                <div class="space-y-4">
                  <a href="https://github.com/prishanf" target="_blank" class="flex items-center group">
                    <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 mr-4">
                      <GithubIcon class="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div class="text-sm font-bold text-primary group-hover:text-accent transition-colors">GitHub</div>
                      <div class="text-[10px] text-gray-400 uppercase tracking-widest">70+ Repositories</div>
                    </div>
                  </a>
                  <a href="https://linkedin.com/in/prishanf" target="_blank" class="flex items-center group">
                    <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 mr-4">
                      <LinkedinIcon class="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div class="text-sm font-bold text-primary group-hover:text-accent transition-colors">LinkedIn</div>
                      <div class="text-[10px] text-gray-400 uppercase tracking-widest">Recent Activity</div>
                    </div>
                  </a>
                  <a href="/resume.pdf" download class="flex items-center group">
                    <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 mr-4">
                      <ArrowDownTrayIcon class="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div class="text-sm font-bold text-primary group-hover:text-accent transition-colors">Resume</div>
                    </div>
                  </a>
                </div>
              </div>

              <!-- Recognition Section (Simplified Sidebar Version) -->
              <div v-if="about?.recognition" class="p-8">
                <h3 class="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-6">Recognition</h3>
                <ul class="space-y-4">
                  <li v-for="award in about.recognition" :key="award" class="flex items-start">
                    <TrophyIcon class="w-4 h-4 text-accent mt-0.5 mr-3 flex-shrink-0" />
                    <span class="text-sm font-medium text-gray-600">{{ award }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { UserIcon, TrophyIcon } from '@heroicons/vue/24/outline'
import GithubIcon from '~/components/Icons/GithubIcon.vue'
import LinkedinIcon from '~/components/Icons/LinkedinIcon.vue'

const { data: about } = await useAsyncData('about', () => queryContent('/about').findOne())

useHead({
  title: about.value?.title ? `${about.value.title} - Prishan Fernando` : 'About - Prishan Fernando',
  meta: [
    { name: 'description', content: about.value?.description || 'Learn more about Prishan Fernando' }
  ]
})
</script>

<style scoped>
:deep(.prose h1) {
  @apply hidden;
}

:deep(.prose h2) {
  @apply text-xs font-bold text-accent uppercase tracking-[0.3em] mt-16 mb-4;
}

:deep(.prose h3) {
  @apply text-3xl font-black text-primary mt-12 mb-6 tracking-tight;
}

:deep(.prose p) {
  @apply text-gray-600 mb-6 leading-relaxed;
}

:deep(.prose ul) {
  @apply space-y-4 mb-8 list-none p-0;
}

:deep(.prose li) {
  @apply relative pl-8 text-gray-600 font-medium;
}

:deep(.prose li::before) {
  content: "";
  @apply absolute left-0 top-3 w-4 h-0.5 bg-accent/50;
}

:deep(.prose strong) {
  @apply text-primary font-bold;
}

:deep(.prose blockquote) {
  @apply border-l-4 border-accent bg-inverse/50 p-8 rounded-r-2xl italic text-gray-700 my-12 relative;
}

:deep(.prose blockquote::before) {
  content: '"';
  @apply absolute -top-4 -left-2 text-6xl text-accent/20 font-serif;
}
</style>

