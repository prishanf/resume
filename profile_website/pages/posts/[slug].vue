<template>
  <div class="min-h-screen bg-white">
    <!-- Post Hero -->
    <section v-if="post" class="relative pt-12 pb-12 overflow-hidden bg-inverse/85">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/posts" class="inline-flex items-center text-xs font-bold text-accent uppercase tracking-[0.3em] mb-12 hover:text-primary transition-colors group">
          <ArrowLeftIcon class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Insights
        </NuxtLink>
        
        <div class="w-full">
          <div class="flex flex-wrap gap-4 mb-8">
            <span v-for="tag in post.tags" :key="tag" class="inline-flex items-center px-3 py-1 rounded-full bg-white border border-gray-100 text-[10px] font-bold text-primary uppercase tracking-widest">
              {{ tag }}
            </span>
          </div>
          
          <h1 class="text-5xl md:text-7xl font-black text-primary mb-8 tracking-tighter leading-[0.9]">
            {{ post.title }}
          </h1>
          
          <div class="flex flex-wrap items-center gap-8 text-sm font-medium text-gray-500">
            <div class="flex items-center">
              <CalendarIcon class="w-5 h-5 mr-2 text-accent" />
              {{ formatDate(post.date) }}
            </div>
            <div class="flex items-center">
              <UserIcon class="w-5 h-5 mr-2 text-accent" />
              Prishan Fernando
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Post Body -->
    <section v-if="post" class="py-16 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <!-- Sidebar -->
          <div class="lg:col-span-1 hidden lg:block">
            <div class="sticky top-32 flex flex-col items-center space-y-6">
              <div class="w-px h-24 bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
              <SocialShare :title="post.title" :url="post._path" orientation="vertical" />
              <div class="w-px h-24 bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
            </div>
          </div>

          <!-- Content -->
          <div class="lg:col-span-8">
            <div v-if="post.image" class="mb-16 -mx-4 sm:-mx-0">
              <img :src="post.image" :alt="post.title" class="w-full h-auto rounded-3xl shadow-2xl object-cover aspect-video" />
            </div>
            
            <div class="prose prose-lg prose-primary">
              <ContentRenderer :value="post" />
            </div>

            <div class="mt-24 pt-12 border-t border-gray-100">
              <SocialShare :title="post.title" :url="post._path" />
            </div>
          </div>

          <!-- Right Sidebar (Metadata) -->
          <div class="lg:col-span-3">
            <div class="sticky top-32 space-y-12">
              <div>
                <h4 class="text-[10px] font-bold text-accent uppercase tracking-[0.3em] mb-4">Summary</h4>
                <p class="text-sm text-gray-500 leading-relaxed">{{ post.description }}</p>
              </div>
              
              <!-- <div class="p-8 bg-inverse/50 rounded-2xl border border-gray-100">
                <h4 class="text-xs font-bold text-primary uppercase tracking-widest mb-4">Ready to Transform?</h4>
                <p class="text-xs text-gray-500 mb-6 leading-relaxed">Let's discuss how we can apply these insights to your organization.</p>
                <NuxtLink to="/about" class="text-xs font-bold text-accent uppercase tracking-widest hover:text-primary transition-colors">Contact Me →</NuxtLink>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Error State -->
    <section v-else class="py-48 text-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-primary mb-4">Post not found</h2>
        <NuxtLink to="/posts" class="text-accent font-bold uppercase tracking-widest">Back to Insights</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ArrowLeftIcon, CalendarIcon, UserIcon, TagIcon } from '@heroicons/vue/24/outline'
import SocialShare from '~/components/Blog/SocialShare.vue'

const route = useRoute()
const slug = route.params.slug

const { data: post, error } = await useAsyncData(`post-${slug}`, async () => {
  try {
    // Try with leading slash first
    let result = await queryContent(`/posts/${slug}`).findOne()
    if (!result) {
      // Fallback without leading slash
      result = await queryContent(`posts/${slug}`).findOne()
    }
    return result
  } catch (err) {
    console.error('Error fetching post:', err)
    return null
  }
})

if (error.value) {
  console.error('Error fetching post:', error.value)
}

useHead({
  title: post.value?.title || 'Post - Prishan Fernando',
  meta: [
    { name: 'description', content: post.value?.description || post.value?.excerpt || '' },
    { property: 'og:title', content: post.value?.title || '' },
    { property: 'og:description', content: post.value?.description || post.value?.excerpt || '' },
    { property: 'og:image', content: post.value?.image || '' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
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
  display: none; /* Hide H1 since we have it in custom header */
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

:deep(.prose iframe) {
  @apply w-full my-12 rounded-2xl shadow-xl;
  max-width: 504px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

:deep(.prose .linkedin-embed-wrapper) {
  @apply my-12 flex justify-center;
}

:deep(.prose .linkedin-embed-wrapper iframe) {
  @apply rounded-2xl shadow-xl;
  border: none;
}

:deep(.prose pre) {
  @apply bg-white border border-gray-200 rounded-lg p-4 my-6 overflow-x-auto;
}

:deep(.prose code) {
  @apply bg-white border border-gray-200 rounded px-2 py-1 text-sm;
}

:deep(.prose pre code) {
  @apply bg-transparent border-none p-0;
}
</style>
