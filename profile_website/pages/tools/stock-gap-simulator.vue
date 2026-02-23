<template>
  <div class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="relative pt-12 pb-12 overflow-hidden bg-inverse/85">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/tools" class="inline-flex items-center text-xs font-bold text-accent uppercase tracking-[0.3em] mb-8 hover:text-primary transition-colors group">
          <ArrowLeftIcon class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Tools
        </NuxtLink>
        <h1 class="text-4xl md:text-6xl font-black text-primary mb-4 tracking-tighter">
          Stock Gap Simulator
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mb-4">
          Backtest a gap-open prediction strategy. Paste your OHLCV CSV and see accuracy for all signals vs MA-confirmed signals.
        </p>
        <div class="text-sm text-gray-600 max-w-2xl space-y-2">
          <p class="font-semibold text-gray-700">How the prediction works:</p>
          <ol class="list-decimal list-inside space-y-1 ml-1">
            <li><strong>Gap</strong> — Today’s open minus yesterday’s close. Open higher → predict UP; open lower → predict DOWN.</li>
            <li><strong>5-day MA</strong> — Average of the previous 5 days’ closes. Confirmed when the gap and the open agree with the MA (e.g. gap UP and open above MA, or gap DOWN and open below MA).</li>
            <li><strong>Confidence</strong> — Base 50% plus extra for gap size; +20% if MA confirms, −10% if MA conflicts. The simulator scores each day as correct when the predicted direction matches whether the close went up or down vs the previous close.</li>
          </ol>
          <p class="font-semibold text-gray-700 pt-2">How to read the metrics:</p>
          <ul class="list-disc list-inside space-y-1 ml-1">
            <li><strong>Confirmed Signals</strong> — Days where the gap direction and the MA confirmation agree (higher-confidence subset).</li>
            <li><strong>Unconfirmed Signals</strong> — Days where the gap predicts a direction but the MA conflicts (gap-only / lower-confidence subset).</li>
            <li><strong>MA Confirmation Lift</strong> — The accuracy difference: <strong>Confirmed accuracy − Unconfirmed accuracy</strong>. Positive means the MA filter improved hit rate; negative means it didn’t help on this dataset.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Simulator (full-width dark UI) -->
    <div class="simulator-wrapper">
      <StockGapSimulator />
    </div>
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

useSeoMeta({
  title: 'Stock Gap Simulator - Prishan Fernando',
  description: 'Backtest gap-open predictions with 5-day MA confirmation. Paste CSV OHLCV data and see accuracy for gap-only vs MA-confirmed signals.'
})
</script>

<style scoped>
.simulator-wrapper {
  padding: 24px 0 32px;
}
</style>
