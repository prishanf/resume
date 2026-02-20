<template>
  <header class="relative overflow-hidden bg-primary py-16 pb-20">
    <div class="absolute inset-0 bg-grid-pattern opacity-10" />
    <div class="absolute -top-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2 mb-10 text-white/70 text-xs font-medium uppercase tracking-widest">
        <NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink>
        <span>/</span>
        <span class="text-accent">Activity</span>
      </div>

      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div>
          <div class="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span class="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
            <span class="text-white/80 text-xs font-medium uppercase tracking-widest">Build log — Active</span>
          </div>
          <h1 class="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-4">
            Site Activity
            <span class="block text-accent">Summary</span>
          </h1>
          <p class="text-white/70 text-lg max-w-xl leading-relaxed">
            A running changelog of everything shipped — tools built, content published, bugs squashed, and ideas made real. Pulled from commit history and organised by week.
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 lg:min-w-[380px]">
          <div class="bg-white/10 border border-white/20 rounded-2xl p-4 text-center hover:bg-white/15 transition-colors">
            <div class="text-2xl md:text-3xl font-bold text-white">{{ summary.totalCommits }}</div>
            <div class="text-white/50 text-[10px] uppercase tracking-widest font-medium">Commits</div>
          </div>
          <div class="bg-white/10 border border-white/20 rounded-2xl p-4 text-center hover:bg-white/15 transition-colors">
            <div class="text-2xl md:text-3xl font-bold text-accent">{{ summary.totalFeatures }}</div>
            <div class="text-white/50 text-[10px] uppercase tracking-widest font-medium">Features</div>
          </div>
          <div class="bg-white/10 border border-white/20 rounded-2xl p-4 text-center hover:bg-white/15 transition-colors">
            <div class="text-2xl md:text-3xl font-bold text-white">{{ summary.totalTools }}</div>
            <div class="text-white/50 text-[10px] uppercase tracking-widest font-medium">Tools</div>
          </div>
          <div class="bg-white/10 border border-white/20 rounded-2xl p-4 text-center hover:bg-white/15 transition-colors">
            <div class="text-2xl md:text-3xl font-bold text-white">{{ summary.activeDays }}</div>
            <div class="text-white/50 text-[10px] uppercase tracking-widest font-medium">Active days</div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { ActivitySummaryStats } from '~/types/activity'

defineProps<{
  summary: ActivitySummaryStats
}>()
</script>
