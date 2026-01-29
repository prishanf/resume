<template>
  <Card :hover="true" class="h-full group transition-all duration-500 overflow-hidden relative flex flex-col border border-primary rounded-xl bg-primary/10">
    <!-- Top Accent Bar -->
    <div class="absolute top-0 left-0 w-full h-1.5 bg-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    
    <div class="flex flex-col h-full p-8">
      <!-- Icon & Title Header -->
      <div class="flex items-center space-x-4 mb-8">
        <div :class="iconBgClass" class="flex-shrink-0 p-3.5 rounded-xl shadow-sm border border-black/5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
          <component :is="icon" class="w-6 h-6" :class="iconClass + ' group-hover:text-white'" />
        </div>
        <h3 class="text-xl font-bold text-primary tracking-tight leading-tight">{{ title }}</h3>
      </div>
      
      <!-- Content -->
      <p class="text-gray-600 mb-8 leading-relaxed text-sm font-medium">
        {{ description }}
      </p>
      
      <!-- Metrics Section -->
      <div v-if="metrics" class="space-y-4 mb-8 mt-auto">
        <div v-for="(metric, index) in metrics" :key="index" class="bg-primary/[0.3] rounded-lg p-4 border border-primary/5 group-hover:bg-primary/[0.06] transition-colors duration-300">
          <div class="flex flex-col">
            <span class="text-3xl font-black text-primary leading-none mb-1.5">{{ metric.value }}</span>
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{{ metric.label }}</span>
          </div>
        </div>
      </div>
      
      <!-- Footer Link -->
      <NuxtLink 
        v-if="link" 
        :to="link" 
        class="inline-flex items-center text-[11px] font-black text-primary uppercase tracking-[0.2em] group-hover:text-accent transition-colors duration-300 pt-4 border-t border-gray-100"
      >
        <span>Explore Details</span>
        <ArrowRightIcon class="w-3.5 h-3.5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
      </NuxtLink>
    </div>
  </Card>
</template>

<script setup>
import { ArrowRightIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: Object,
    required: true
  },
  iconBgClass: {
    type: String,
    default: 'bg-primary/10'
  },
  iconClass: {
    type: String,
    default: 'text-primary'
  },
  metrics: {
    type: Array,
    default: null
  },
  link: {
    type: String,
    default: null
  }
})
</script>
