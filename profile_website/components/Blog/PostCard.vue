<template>
  <div class="group h-full flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
    <NuxtLink :to="post._path" class="flex flex-col h-full">
      <!-- Image Wrapper -->
      <div v-if="post.image" class="relative h-56 overflow-hidden">
        <img
          :src="post.image"
          :alt="post.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      <!-- Content -->
      <div class="p-8 flex-1 flex flex-col">
        <div class="flex items-center text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-4">
          <CalendarIcon class="w-3.5 h-3.5 mr-2 opacity-70" />
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
        </div>
        
        <h3 class="text-xl font-bold text-primary mb-3 leading-tight group-hover:text-accent transition-colors duration-300">
          {{ post.title }}
        </h3>
        
        <p class="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
          {{ post.excerpt || post.description }}
        </p>
        
        <!-- Footer -->
        <div class="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
          <div v-if="post.tags" class="flex flex-wrap gap-2">
            <span
              v-for="tag in post.tags.slice(0, 2)"
              :key="tag"
              class="text-[10px] bg-inverse text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
            >
              {{ tag }}
            </span>
          </div>
          
          <span class="text-primary group-hover:translate-x-1 transition-transform duration-300">
            <ArrowRightIcon class="w-5 h-5" />
          </span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
import { CalendarIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
