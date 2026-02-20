<template>
  <div class="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
        <button
          v-for="month in months"
          :key="month.id"
          type="button"
          class="activity-month-tab shrink-0 px-4 py-1.5 text-xs font-bold rounded-lg transition-colors"
          :class="activeMonthId === month.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
          @click="$emit('select-month', month.id)"
        >
          {{ month.label }}
        </button>
        <div v-if="currentMonthWeeks.length" class="h-5 w-px bg-gray-200 mx-1 shrink-0" />
        <span v-if="currentMonthWeeks.length" class="text-[10px] text-gray-400 font-medium uppercase tracking-widest shrink-0">
          Jump to week:
        </span>
        <NuxtLink
          v-for="week in currentMonthWeeks"
          :key="week.id"
          :to="`#${week.id}`"
          class="shrink-0 px-3 py-1 text-[11px] font-medium text-gray-500 hover:text-primary border border-gray-200 rounded-lg hover:border-primary transition-colors"
        >
          W{{ week.weekNum }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActivityMonth } from '~/types/activity'

defineEmits<{
  'select-month': [id: string]
}>()

const props = withDefaults(
  defineProps<{
    months: ActivityMonth[]
    activeMonthId: string
  }>(),
  { activeMonthId: '' }
)

const currentMonthWeeks = computed(() => {
  const month = props.months.find((m) => m.id === props.activeMonthId)
  return month?.weeks ?? []
})
</script>
