<template>
  <div class="min-h-screen bg-white">
    <section class="relative pt-12 pb-16 overflow-hidden bg-inverse/85">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl md:text-6xl font-black text-primary mb-4 tracking-tighter">
          Tools
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl">
          Canada-focused calculators and small utilities for ideas from the blog and everyday decisions.
          Each card opens one tool. New calculators are added from a single catalog list — see
          <code class="text-sm bg-white border border-gray-200 rounded px-1.5 py-0.5">docs/adding-a-tool.md</code>.
          Figures are estimates, not financial advice.
        </p>
      </div>
    </section>

    <section class="py-16">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Cards are rendered from data/toolsCatalog.ts. Add a weekly tool there. -->
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="tool in TOOLS"
            :key="tool.slug"
            :to="tool.path"
            class="group block p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-200"
          >
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <component :is="iconFor(tool.icon)" class="w-6 h-6 text-primary" />
            </div>
            <h2 class="text-xl font-bold text-primary mb-2 group-hover:text-primary/80 transition-colors">
              {{ tool.title }}
            </h2>
            <p class="text-gray-600 text-sm leading-relaxed mb-4">
              {{ tool.description }}
            </p>
            <span class="text-sm font-bold text-primary uppercase tracking-widest group-hover:underline">
              {{ tool.cta }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { CalculatorIcon, DocumentTextIcon, ClipboardDocumentListIcon } from '@heroicons/vue/24/outline'
import { TOOLS } from '~/data/toolsCatalog'

const icons = {
  calculator: CalculatorIcon,
  document: DocumentTextIcon,
  clipboard: ClipboardDocumentListIcon
}

const iconFor = (name) => icons[name] || CalculatorIcon

usePageSeo({
  title: 'Canada Finance Calculators & Tools | Prishan Fernando',
  description: 'Canada calculators for income tax, mortgages, and HELOC vs fixed-rate decisions, plus a rental form and todo board. Estimates only — not financial advice.'
})
</script>
