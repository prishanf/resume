<template>
  <div class="py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <NuxtLink to="/experience" class="inline-flex items-center text-primary hover:text-primary/80 mb-6">
        <ArrowLeftIcon class="w-5 h-5 mr-2" />
        Back to Experience
      </NuxtLink>
      <ContentDoc />
    </div>
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const year = route.params.year

const { data: evidence } = await useAsyncData(`evidence-${year}`, () => 
  queryContent(`/evidence/${year}`).findOne()
)

useHead({
  title: `${year} Evidence - Prishan Fernando`,
  meta: [
    { name: 'description', content: `Performance highlights and achievements for ${year}` }
  ]
})
</script>

<style scoped>
:deep(h1) {
  @apply text-4xl font-bold text-primary mb-6;
}

:deep(h2) {
  @apply text-2xl font-bold text-primary mt-8 mb-4;
}

:deep(h3) {
  @apply text-xl font-bold text-primary mt-6 mb-3;
}

:deep(p) {
  @apply text-gray-700 mb-4 leading-relaxed;
}

:deep(ul) {
  @apply list-disc list-inside mb-4 space-y-2;
}

:deep(li) {
  @apply text-gray-700;
}

:deep(strong) {
  @apply font-semibold text-gray-900;
}
</style>
