<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-white via-inverse to-secondary/10 py-12 overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -left-24 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-16">
          <div class="max-w-3xl flex-1">
            <h2 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-4">Endorsements</h2>
            <h1 class="text-5xl md:text-7xl font-black text-primary mb-6 tracking-tighter leading-[0.9]">
              What People <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Actually Say.</span>
            </h1>
            <p class="text-xl text-gray-600 max-w-2xl font-medium leading-relaxed">
              Reviews and feedback from colleagues, peers, and team members.
            </p>
          </div>

          <div v-if="recommendations.length > 0" class="relative group flex-shrink-0">
            <div class="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div class="relative bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100 text-center min-w-[200px] transform group-hover:-translate-y-1 transition-transform duration-300">
              <span class="block text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2">
                {{ recommendations.length }}+
              </span>
              <span class="text-sm font-bold text-gray-500 uppercase tracking-widest">Endorsements</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- All Recommendations -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Recommendations
          v-if="recommendations && recommendations.length > 0"
          :recommendations="recommendations"
          :show-view-more="false"
        />
        <p v-else class="text-gray-500 text-center py-12">No endorsements to display.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Recommendations from '~/components/Sections/Recommendations.vue'

const { data: recommendationsContent } = await useAsyncData('recommendations-page', () =>
  queryContent('/recommendations').findOne()
)

const recommendations = computed(() => {
  return recommendationsContent.value?.recommendations || []
})

useHead({
  title: 'Endorsements - Prishan Fernando',
  meta: [
    { name: 'description', content: 'Reviews and endorsements from colleagues, peers, and team members' }
  ]
})
</script>
