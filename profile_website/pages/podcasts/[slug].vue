<template>
  <div class="min-h-screen bg-white">
    <!-- Episode Hero -->
    <section v-if="podcast" class="relative pt-12 pb-12 overflow-hidden bg-inverse/85">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/podcasts" class="inline-flex items-center text-xs font-bold text-accent uppercase tracking-[0.3em] mb-12 hover:text-primary transition-colors group">
          <ArrowLeftIcon class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Podcasts
        </NuxtLink>

        <div class="w-full">
          <div class="flex flex-wrap gap-4 mb-8">
            <span v-for="tag in podcast.tags" :key="tag" class="inline-flex items-center px-3 py-1 rounded-full bg-white border border-gray-100 text-[10px] font-bold text-primary uppercase tracking-widest">
              {{ tag }}
            </span>
          </div>

          <h1 class="text-5xl md:text-7xl font-black text-primary mb-8 tracking-tighter leading-[0.9]">
            {{ podcast.title }}
          </h1>

          <div class="flex flex-wrap items-center gap-8 text-sm font-medium text-gray-500">
            <div class="flex items-center">
              <CalendarIcon class="w-5 h-5 mr-2 text-accent" />
              {{ formatDate(podcast.date) }}
            </div>
            <div class="flex items-center">
              <UserIcon class="w-5 h-5 mr-2 text-accent" />
              Prishan Fernando
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Episode Body -->
    <section v-if="podcast" class="py-16 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <!-- Sidebar -->
          <div class="lg:col-span-1 hidden lg:block">
            <div class="sticky top-32 flex flex-col items-center space-y-6">
              <div class="w-px h-24 bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
              <SocialShare :title="podcast.title" :url="podcast._path" orientation="vertical" />
              <div class="w-px h-24 bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
            </div>
          </div>

          <!-- Content -->
          <div class="lg:col-span-8">
            <div v-if="podcast.image" class="mb-16 -mx-4 sm:-mx-0">
              <img :src="podcast.image" :alt="podcast.title" class="w-full h-auto rounded-3xl shadow-2xl object-cover aspect-video" />
            </div>

            <div class="prose prose-lg prose-primary">
              <ContentRenderer :value="podcast" />
            </div>

            <div class="mt-24 pt-12 border-t border-gray-100">
              <SocialShare :title="podcast.title" :url="podcast._path" />
            </div>
          </div>

          <!-- Right Sidebar (Metadata) -->
          <div class="lg:col-span-3">
            <div class="sticky top-32 space-y-12 border-l border-primary-200 pl-8">
              <div>
                <h4 class="text-[10px] font-bold text-accent uppercase tracking-[0.3em] mb-4">Summary</h4>
                <p class="text-sm text-gray-500 leading-relaxed">{{ podcast.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Error State -->
    <section v-else class="py-48 text-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-primary mb-4">Episode not found</h2>
        <NuxtLink to="/podcasts" class="text-accent font-bold uppercase tracking-widest">Back to Podcasts</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ArrowLeftIcon, CalendarIcon, UserIcon } from '@heroicons/vue/24/outline'
import SocialShare from '~/components/Blog/SocialShare.vue'

const route = useRoute()
const slug = route.params.slug

const { data: podcast, error } = await useAsyncData(`podcast-${slug}`, async () => {
  try {
    let result = await queryContent(`/podcasts/${slug}`).findOne()
    if (!result) {
      result = await queryContent(`podcasts/${slug}`).findOne()
    }
    return result
  } catch (err) {
    console.error('Error fetching podcast:', err)
    return null
  }
})

if (error.value) {
  console.error('Error fetching podcast:', error.value)
}

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl?.replace(/\/$/, '') || 'https://prishanfernando.com'

const absoluteImageUrl = computed(() => {
  const img = podcast.value?.image
  if (!img) return ''
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  return img.startsWith('/') ? `${siteUrl}${img}` : `${siteUrl}/${img}`
})

const absolutePageUrl = computed(() => {
  const path = podcast.value?._path || route.path
  return path.startsWith('http') ? path : `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
})

useSeoMeta({
  title: () => podcast.value?.title || 'Podcast - Prishan Fernando',
  description: () => podcast.value?.description || podcast.value?.excerpt || '',
  ogTitle: () => podcast.value?.title || '',
  ogDescription: () => podcast.value?.description || podcast.value?.excerpt || '',
  ogImage: () => absoluteImageUrl.value,
  ogUrl: () => absolutePageUrl.value,
  ogType: 'article',
  articleAuthor: 'Prishan Fernando',
  articlePublishedTime: () => podcast.value?.date || '',
  twitterCard: 'summary_large_image',
  twitterTitle: () => podcast.value?.title || '',
  twitterDescription: () => podcast.value?.description || podcast.value?.excerpt || '',
  twitterImage: () => absoluteImageUrl.value
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
:deep(.prose) {
  @apply text-gray-600 max-w-none;
}

:deep(.prose h1) {
  @apply text-4xl font-black text-primary mb-8 tracking-tight;
  display: none;
}

:deep(.prose h2) {
  @apply text-2xl font-bold text-primary mt-12 mb-6 tracking-tight;
}

:deep(.prose h3) {
  @apply text-xl font-bold text-primary mt-8 mb-4 tracking-tight;
}

:deep(.prose p) {
  @apply mb-6 leading-relaxed;
}

:deep(.prose ul) {
  @apply space-y-3 mb-8 list-none p-0;
}

:deep(.prose li) {
  @apply relative pl-8;
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

:deep(.prose img) {
  @apply rounded-3xl shadow-2xl my-12;
}

:deep(.prose audio) {
  @apply w-full my-6 rounded-xl;
}
</style>
