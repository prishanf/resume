<template>
  <div class="group relative">
    <!-- Connection line for desktop -->
    <div v-if="alignment === 'top'" class="hidden lg:block absolute left-1/2 -translate-x-1/2 -bottom-8 w-0.5 h-8 bg-primary/30"></div>
    <div v-if="alignment === 'bottom'" class="hidden lg:block absolute left-1/2 -translate-x-1/2 -top-8 w-0.5 h-8 bg-primary/30"></div>

    <!-- Card -->
    <div 
      class="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg shadow-gray-900/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
      :class="{
        'lg:mb-0': alignment === 'top',
        'lg:mt-0': alignment === 'bottom'
      }"
    >
      <!-- Background gradient effect -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div class="relative">
        <!-- Year badge and Career Level -->
        <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div class="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <CalendarIcon class="w-3 h-3 mr-1" />
            {{ milestone.year || 'Present' }}
          </div>
          
          <!-- Career Level Badge -->
          <div 
            v-if="milestone.careerLevel"
            :class="[
              'px-2 py-1 rounded-full text-xs font-bold',
              milestone.careerLevel === 'Executive' ? 'bg-accent/20 text-accent' :
              milestone.careerLevel === 'Senior Management' ? 'bg-primary/20 text-primary' :
              'bg-gray-100 text-gray-600'
            ]"
          >
            {{ milestone.careerLevel }}
          </div>
        </div>

        <!-- Promotion Indicator -->
        <div v-if="milestone.isPromotion" class="mb-3 flex items-center space-x-2 px-2 py-1 bg-accent/10 rounded-lg border border-accent/20">
          <ArrowUpIcon class="w-4 h-4 text-accent" />
          <span class="text-xs font-bold text-accent uppercase">Promoted</span>
        </div>

        <!-- Title and role -->
        <h4 class="text-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">
          {{ milestone.title }}
        </h4>
        <p class="text-accent font-semibold text-sm mb-2">{{ milestone.role }}</p>
        <p class="text-gray-500 text-xs mb-4">{{ milestone.location }}</p>
        
        <!-- Duration -->
        <div v-if="milestone.duration && !milestone.current" class="mb-4">
          <span class="text-xs text-gray-500">{{ milestone.duration }}</span>
        </div>

        <!-- Key achievements with animation -->
        <div class="space-y-3">
          <div 
            v-for="(point, index) in milestone.keyPoints"
            :key="index"
            class="flex items-start space-x-3 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            :style="{ transitionDelay: `${index * 100}ms` }"
          >
            <div class="mt-1.5 w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
            <p class="text-sm text-gray-600 leading-relaxed" v-html="point"></p>
          </div>
        </div>

        <!-- Tags/Badges -->
        <div v-if="milestone.tags" class="flex flex-wrap gap-2 mt-4">
          <span 
            v-for="tag in milestone.tags.slice(0, 3)"
            :key="tag"
            class="px-2 py-1 bg-inverse/50 text-xs text-gray-600 rounded-lg"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Progress indicator for current role -->
        <div v-if="milestone.current" class="mt-4">
          <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Current Role</span>
            <span>{{ milestone.duration }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
              :style="{ width: '85%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Arrow indicators for desktop -->
    <div v-if="alignment === 'top'" class="hidden lg:block absolute left-1/2 -translate-x-1/2 -bottom-2">
      <div class="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-primary/30"></div>
    </div>
    <div v-if="alignment === 'bottom'" class="hidden lg:block absolute left-1/2 -translate-x-1/2 -top-2">
      <div class="w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-primary/30"></div>
    </div>
  </div>
</template>

<script setup>
import { CalendarIcon, ArrowUpIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  milestone: {
    type: Object,
    required: true
  },
  alignment: {
    type: String,
    required: true,
    validator: (value) => ['top', 'bottom', 'mobile'].includes(value)
  }
})
</script>