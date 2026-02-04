<template>
  <div>
    <div class="columns-1 md:columns-2 gap-6 lg:gap-8">
      <UICard
        v-for="(rec, index) in recommendations"
        :key="index"
        variant="bordered"
        class="relative group hover:shadow-xl transition-shadow duration-300 break-inside-avoid inline-block w-full mb-6 lg:mb-8"
      >
        <div class="absolute top-6 left-6 text-accent/30 text-6xl font-serif leading-none">"</div>
        <blockquote class="pl-12 pr-6 py-6 relative z-10">
          <p class="text-gray-700 mb-6 italic text-lg leading-relaxed">{{ rec.quote }}</p>
          <footer class="flex items-center pt-4 border-t border-gray-200">
            <div>
              <p class="font-bold text-primary text-lg">{{ rec.author }}</p>
              <p v-if="rec.title" class="text-sm text-gray-500 mt-1">{{ rec.title }}</p>
            </div>
          </footer>
        </blockquote>
      </UICard>
    </div>
    <div v-if="showViewMore" class="mt-12 text-center">
      <NuxtLink
        to="/endorsements"
        class="inline-flex items-center px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
      >
        View All Endorsements
        <ArrowRightIcon class="w-5 h-5 ml-2" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ArrowRightIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  recommendations: {
    type: Array,
    required: true
  },
  showViewMore: {
    type: Boolean,
    default: false
  }
})
</script>
