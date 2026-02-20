<template>
  <div :id="month.id" class="activity-month-section">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
      <div>
        <p class="text-[10px] font-medium uppercase tracking-[0.3em] text-gray-400 mb-2">{{ month.year }}</p>
        <h2 class="text-4xl md:text-5xl font-bold text-primary">{{ month.label.split(' ')[0] }}</h2>
      </div>
      <div class="hidden sm:flex items-center gap-6 text-right pb-1">
        <div>
          <div class="text-2xl font-black text-primary font-medium">{{ month.commits }}</div>
          <div class="text-[10px] text-gray-400 uppercase tracking-widest">Commits</div>
        </div>
        <div>
          <div class="text-2xl font-black text-accent font-medium">{{ month.features }}</div>
          <div class="text-[10px] text-gray-400 uppercase tracking-widest">Features</div>
        </div>
        <div>
          <div class="text-2xl font-black text-primary font-medium">{{ month.activeDays }}</div>
          <div class="text-[10px] text-gray-400 uppercase tracking-widest">Active days</div>
        </div>
      </div>
    </div>
    <ActivitySummaryWeek
      v-for="week in month.weeks"
      :key="week.id"
      :week="week"
    />
  </div>
</template>

<script setup lang="ts">
import type { ActivityMonth } from '~/types/activity'

defineProps<{
  month: ActivityMonth
}>()
</script>
