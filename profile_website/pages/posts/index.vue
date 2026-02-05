<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-white via-inverse to-secondary/10 py-12 overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8">
            <PencilSquareIcon class="w-4 h-4" />
            <span>Insights & Articles</span>
          </div>
          
          <h1 class="text-5xl md:text-7xl font-black text-primary mb-8 tracking-tighter leading-[0.9]">
            Thoughts & <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Innovations.</span>
          </h1>
          
          <p class="text-xl text-gray-600 max-w-2xl font-medium leading-relaxed">
            Exploring the intersection of enterprise architecture, artificial intelligence, and strategic leadership.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-12 bg-white relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="pending" class="flex flex-col items-center justify-center py-24">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p class="text-gray-500 font-medium">Loading insights...</p>
        </div>
        
        <div v-else-if="posts && posts.length > 0">
          <div class="mb-8 text-sm text-gray-500">
            Showing {{ posts.length }} post{{ posts.length !== 1 ? 's' : '' }}
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PostCard
              v-for="post in posts"
              :key="post._path || post._id"
              :post="post"
            />
          </div>
        </div>
        
        <div v-else class="text-center py-24 bg-inverse/30 rounded-3xl border border-dashed border-gray-200">
          <SparklesIcon class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-primary mb-2">No posts found</h3>
          <p class="text-gray-500 mb-4">I'm currently drafting new insights. Check back soon!</p>
          <div v-if="error" class="text-xs text-red-500 mt-4">
            Error: {{ error.message }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { PencilSquareIcon, SparklesIcon } from '@heroicons/vue/24/outline'
import PostCard from '~/components/Blog/PostCard.vue'

const { data: posts, pending, error } = await useAsyncData('posts', async () => {
  try {
    // Try the standard pattern first
    let result = await queryContent('posts')
      .where({ published: { $ne: false } })
      .sort({ date: -1 })
      .find()
    
    // If that doesn't work, try with leading slash
    if (!result || result.length === 0) {
      result = await queryContent('/posts')
        .where({ published: { $ne: false } })
        .sort({ date: -1 })
        .find()
    }
    
    // If still empty, try without the published filter
    if (!result || result.length === 0) {
      result = await queryContent('posts')
        .sort({ date: -1 })
        .find()
    }
    
    return result || []
  } catch (err) {
    console.error('Error fetching posts:', err)
    // Return empty array instead of throwing to prevent page crash
    return []
  }
})

if (error.value) {
  console.error('Error in useAsyncData:', error.value)
}

useHead({
  title: 'Blog Posts - Prishan Fernando',
  meta: [
    { name: 'description', content: 'Blog posts and articles on technology, leadership, and innovation' }
  ]
})
</script>
