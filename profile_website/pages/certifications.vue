<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-white via-inverse to-secondary/10 py-24 lg:py-12 overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -left-24 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8">
            <TrophyIcon class="w-4 h-4" />
            <span>{{ certifications?.badge || 'Professional Credentials' }}</span>
          </div>
          
          <h1 class="text-5xl md:text-7xl font-black text-primary mb-8 tracking-tighter leading-[0.9]">
            {{ certifications?.heroTitlePart1 || 'Licenses &' }} <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{{ certifications?.heroTitlePart2 || 'Certifications.' }}</span>
          </h1>
          
          <p class="text-xl text-gray-600 max-w-2xl font-medium leading-relaxed mb-12">
            {{ certifications?.heroDescription || 'A comprehensive overview of my technical expertise and professional certifications in the Salesforce and Cloud ecosystem.' }}
          </p>

          <!-- Quick Stats -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
            <div class="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/50">
              <div class="text-3xl font-black text-primary mb-1">{{ certifications?.certifications?.length || 0 }}</div>
              <div class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total Credentials</div>
            </div>
            <div class="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/50">
              <div class="text-3xl font-black text-accent mb-1">{{ salesforceCount }}</div>
              <div class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Salesforce Certs</div>
            </div>
            <div class="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/50">
              <div class="text-3xl font-black text-primary mb-1">10+</div>
              <div class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Years Experience</div>
            </div>
            <div class="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/50">
              <div class="text-3xl font-black text-accent mb-1">200+</div>
              <div class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Trailhead Badges</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-24 bg-white relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Featured Certifications -->
        <div v-if="featuredCertifications.length" class="mb-32">
          <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-gray-50 pb-8">
            <div>
              <h2 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-4">Selected Expertise</h2>
              <h3 class="text-4xl md:text-5xl font-black text-primary tracking-tight">
                {{ certifications?.featuredTitle || 'Strategic Credentials' }}
              </h3>
            </div>
            <p class="text-gray-500 max-w-md text-base leading-relaxed">
              {{ certifications?.featuredDescription || 'Key certifications that define my current focus on AI and enterprise architecture.' }}
            </p>
          </div>
          <SectionsCertificationsGrid :certifications="featuredCertifications" />
        </div>

        <!-- All Certifications -->
        <div v-if="otherCertifications.length">
          <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-gray-50 pb-8">
            <div>
              <h2 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-4">The Portfolio</h2>
              <h3 class="text-4xl md:text-5xl font-black text-primary tracking-tight">
                {{ certifications?.listTitle || 'Complete Portfolio' }}
              </h3>
            </div>
            <p class="text-gray-500 max-w-md text-base leading-relaxed">
              {{ certifications?.listDescription || 'A complete list of professional milestones and technical certifications.' }}
            </p>
          </div>
          <SectionsCertificationsGrid :certifications="otherCertifications" />
        </div>

        <!-- Content from Markdown -->
        <div class="mt-32 pt-24 border-t border-gray-100">
          <div class="max-w-4xl">
            <div class="prose prose-lg prose-primary max-w-none">
              <ContentDoc />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { TrophyIcon } from '@heroicons/vue/24/outline'

const { data: certifications } = await useAsyncData('certifications', () => queryContent('/certifications').findOne())

const allCerts = computed(() => certifications.value?.certifications || [])
const featuredCertifications = computed(() => allCerts.value.filter(c => c.badge === 'Featured' || c.badge === 'New'))
const otherCertifications = computed(() => allCerts.value.filter(c => c.badge !== 'Featured' && c.badge !== 'New'))

const salesforceCount = computed(() => {
  return allCerts.value.filter(c => c.issuer?.toLowerCase().includes('salesforce')).length
})

useHead({
  title: certifications.value?.title ? `${certifications.value.title} - Prishan Fernando` : 'Certifications - Prishan Fernando',
  meta: [
    { name: 'description', content: certifications.value?.description || 'Professional certifications and credentials' }
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
</style>

