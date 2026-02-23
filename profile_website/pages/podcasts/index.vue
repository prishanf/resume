<template>
    <div class="min-h-screen">
      <!-- Hero Section -->
      <section class="relative bg-gradient-to-br from-white via-inverse to-secondary/10 py-12 overflow-hidden">
        <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
  
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-3xl">
            <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8">
              <MicrophoneIcon class="w-4 h-4" />
              <span>Podcasts</span>
            </div>
  
            <h1 class="text-5xl md:text-7xl font-black text-primary mb-8 tracking-tighter leading-[0.9]">
              Listen & <br /><span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Learn.</span>
            </h1>
  
            <p class="text-xl text-gray-600 max-w-2xl font-medium leading-relaxed">
              Podcast episodes on AI, architecture, security, and leadership — listen in your browser or download to go.
            </p>
          </div>
        </div>
      </section>
  
      <!-- Main Content -->
      <section class="py-12 bg-white relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div v-if="pending" class="flex flex-col items-center justify-center py-24">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p class="text-gray-500 font-medium">Loading podcasts...</p>
          </div>
  
          <div v-else-if="podcasts && podcasts.length > 0">
            <div class="mb-8 text-sm text-gray-500">
              Showing {{ podcasts.length }} episode{{ podcasts.length !== 1 ? 's' : '' }}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <PostCard
                v-for="podcast in podcasts"
                :key="podcast._path || podcast._id"
                :post="podcast"
              />
            </div>
          </div>
  
          <div v-else class="text-center py-24 bg-inverse/30 rounded-3xl border border-dashed border-gray-200">
            <MicrophoneIcon class="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 class="text-xl font-bold text-primary mb-2">No episodes yet</h3>
            <p class="text-gray-500 mb-4">New podcast episodes will appear here. Check back soon!</p>
            <div v-if="error" class="text-xs text-red-500 mt-4">
              Error: {{ error.message }}
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import { MicrophoneIcon } from '@heroicons/vue/24/outline'
  import PostCard from '~/components/Blog/PostCard.vue'
  
  const { data: podcasts, pending, error } = await useAsyncData('podcasts', async () => {
    try {
      let result = await queryContent('podcasts')
        .where({ published: { $ne: false } })
        .sort({ date: -1 })
        .find()
  
      if (!result || result.length === 0) {
        result = await queryContent('/podcasts')
          .where({ published: { $ne: false } })
          .sort({ date: -1 })
          .find()
      }
  
      if (!result || result.length === 0) {
        result = await queryContent('podcasts').sort({ date: -1 }).find()
      }
  
      return result || []
    } catch (err) {
      console.error('Error fetching podcasts:', err)
      return []
    }
  })
  
  if (error.value) {
    console.error('Error in useAsyncData podcasts:', error.value)
  }
  
  useHead({
    title: 'Podcasts - Prishan Fernando',
    meta: [
      { name: 'description', content: 'Podcast episodes on AI, architecture, security, and leadership' }
    ]
  })
  </script>