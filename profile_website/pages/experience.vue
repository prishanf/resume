<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-white via-inverse to-secondary/10 py-12 overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8">
            <BriefcaseIcon class="w-4 h-4" />
            <span>Professional Journey</span>
          </div>
          
          <h1 class="text-5xl md:text-7xl font-black text-primary mb-8 tracking-tighter leading-[0.9]">
            Experience & <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Career Impact.</span>
          </h1>
          
          <p class="text-xl text-gray-600 max-w-2xl font-medium leading-relaxed">
            Over two decades of expertise in software engineering and enterprise architecture, with a focus on Salesforce ecosystems and AI innovation.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-16 bg-white relative">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="prose prose-lg max-w-none mb-12">
          <ContentDoc />
        </div>
        
        <!-- Performance Evidence Section -->
        <div v-if="evidenceYears.length > 0" class="mt-16 pt-16 border-t border-gray-100">
          <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-4">The Proof</h2>
              <h3 class="text-4xl font-bold text-primary">Performance Evidence</h3>
            </div>
            <p class="text-gray-500 max-w-md text-sm leading-relaxed">
              Detailed annual reviews and performance summaries from my career at Slalom and beyond.
            </p>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <NuxtLink
              v-for="year in evidenceYears"
              :key="year"
              :to="`/evidence/${year}`"
              class="group relative p-8 bg-inverse/30 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center overflow-hidden"
            >
              <div class="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-accent/20 transition-colors"></div>
              <span class="text-3xl font-black text-primary group-hover:text-accent transition-colors">{{ year }}</span>
              <div class="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Yearly Review</div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { BriefcaseIcon } from '@heroicons/vue/24/outline'

const { data: experience } = await useAsyncData('experience', () => queryContent('/experience').findOne())
const { data: evidenceFiles } = await useAsyncData('evidence-files', () => 
  queryContent('/evidence').only(['_path', 'title', 'date']).find()
)

const evidenceYears = computed(() => {
  if (!evidenceFiles.value) return []
  return evidenceFiles.value
    .map(file => {
      const match = file._path?.match(/\/evidence\/(\d+)/)
      return match ? parseInt(match[1]) : null
    })
    .filter(year => year !== null)
    .sort((a, b) => b - a) // Sort descending (newest first)
})

useHead({
  title: 'Experience - Prishan Fernando',
  meta: [
    { name: 'description', content: 'Professional experience and employment history spanning 20+ years' }
  ]
})
</script>

<style scoped>
:deep(.prose h1) {
  @apply text-4xl font-black text-primary mb-8 tracking-tight;
  display: none; /* Hide H1 since we have it in hero */
}

:deep(.prose h2) {
  @apply text-xs font-bold text-accent uppercase tracking-[0.3em] mt-4 mb-6;
}

:deep(.prose h3) {
  @apply text-3xl font-bold text-primary mt-8 mb-4 tracking-tight;
}

:deep(.prose h4) {
  @apply text-lg font-bold text-primary mt-4 mb-2;
}

:deep(.prose p) {
  @apply text-gray-600 mb-6 leading-relaxed;
}

:deep(.prose ul) {
  @apply space-y-3 mb-8 list-none p-0;
}

:deep(.prose li) {
  @apply relative pl-8 text-gray-600 text-base;
}

:deep(.prose li::before) {
  content: "→";
  @apply absolute left-0 top-0 text-accent font-bold;
}

:deep(.prose strong) {
  @apply text-primary font-bold;
}

:deep(.prose blockquote) {
  @apply border-l-4 border-accent bg-inverse/50 p-8 rounded-r-2xl italic text-gray-700 my-12;
}
</style>
