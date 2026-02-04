<template>
  <Card :hover="true" class="summary-card h-full group transition-all duration-500 overflow-hidden relative flex flex-col border border-primary/20 rounded-xl bg-gradient-to-br from-white via-primary/[0.04] to-primary/10 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
    <!-- Top Accent Bar -->
    <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-xl"></div>
    
    <div class="flex flex-col h-full p-8 min-h-[320px]">
      <!-- Icon & Title Header -->
      <div class="flex items-center space-x-4 mb-6">
        <div :class="iconBgClass" class="flex-shrink-0 p-3.5 rounded-xl shadow-sm border border-primary/10 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
          <component :is="icon" class="w-6 h-6" :class="iconClass + ' group-hover:text-white'" />
        </div>
        <h3 class="text-xl font-bold text-primary tracking-tight leading-tight">{{ title }}</h3>
      </div>
      
      <!-- Content -->
      <p class="text-gray-600 mb-6 leading-relaxed text-sm font-medium flex-grow-0">
        {{ description }}
      </p>
      
      <!-- Metrics Section -->
      <div v-if="metrics" class="space-y-3 mb-6 mt-auto">
        <div v-for="(metric, index) in metrics" :key="index" class="metric-bar bg-gradient-to-r from-primary/[0.15] to-primary/[0.08] rounded-lg px-4 py-3.5 border border-primary/10 group-hover:from-primary/[0.2] group-hover:to-primary/[0.12] transition-colors duration-300">
          <div class="flex flex-col">
            <span class="text-2xl md:text-3xl font-black text-primary leading-none mb-1 tracking-tight">{{ metric.value }}</span>
            <span class="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">{{ metric.label }}</span>
          </div>
        </div>
      </div>
      
      <!-- Footer Link -->
      <NuxtLink 
        v-if="link" 
        :to="link" 
        class="inline-flex items-center text-[11px] font-black text-primary uppercase tracking-[0.2em] group-hover:text-accent transition-colors duration-300 pt-4 mt-auto border-t border-gray-200/80"
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
