<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-white via-inverse to-secondary/10 py-12 overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8">
            <AcademicCapIcon class="w-4 h-4" />
            <span>{{ education?.badge || 'Academic Foundation' }}</span>
          </div>
          
          <h1 class="text-5xl md:text-7xl font-black text-primary mb-8 tracking-tighter leading-[0.9]">
            {{ education?.heroTitlePart1 || 'Education &' }} <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{{ education?.heroTitlePart2 || 'Lifelong Learning.' }}</span>
          </h1>
          
          <p class="text-xl text-gray-600 max-w-2xl font-medium leading-relaxed">
            {{ education?.heroDescription || 'My academic background in Computer Science and continuous pursuit of technical excellence through specialized training.' }}
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-12 bg-white relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="prose prose-lg max-w-none">
          <ContentDoc />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { AcademicCapIcon } from '@heroicons/vue/24/outline'

const { data: education } = await useAsyncData('education', () => queryContent('/education').findOne())

useHead({
  title: education.value?.pageTitle || 'Education - Prishan Fernando',
  meta: [
    { name: 'description', content: education.value?.description || 'Educational background' }
  ]
})
</script>

<style scoped>
:deep(.prose h1) {
  @apply text-4xl font-black text-primary mb-8 tracking-tight;
  display: none; /* Hide H1 since we have it in hero */
}

:deep(.prose h2) {
  @apply text-xs font-bold text-accent uppercase tracking-[0.3em] mt-16 mb-4;
}

:deep(.prose h3) {
  @apply text-3xl font-bold text-primary mt-8 mb-6 tracking-tight;
}

:deep(.prose p) {
  @apply text-gray-600 mb-6 leading-relaxed;
}

:deep(.prose ul) {
  @apply space-y-4 mb-8 list-none p-0;
}

:deep(.prose li) {
  @apply relative pl-8 text-gray-600;
}

:deep(.prose li::before) {
  content: "";
  @apply absolute left-0 top-3 w-4 h-0.5 bg-accent/50;
}

:deep(.prose strong) {
  @apply text-primary font-bold;
}
</style>
