<template>
  <div class="min-h-screen bg-white">
    <section class="relative pt-12 pb-16 overflow-hidden bg-inverse/85">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl md:text-6xl font-black text-primary mb-4 tracking-tighter">
          Calculators &amp; Utilities
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl">
          Canada-focused calculators for everyday money decisions, plus a couple of small utilities.
          Figures are estimates, not financial advice.
        </p>
      </div>
    </section>

    <section class="py-16">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div>
          <h2 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-3">Finance calculators</h2>
          <p class="text-gray-600 mb-8 max-w-2xl">
            Mortgage, Canadian income tax, HELOC vs fixed-rate, and RRSP vs TFSA vs FHSA comparisons. Built for Canadian numbers.
          </p>
          <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <NuxtLink
              v-for="tool in FINANCE_TOOLS"
              :key="tool.slug"
              :to="tool.path"
              class="group block p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-200"
            >
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <component :is="iconFor(tool.icon)" class="w-6 h-6 text-primary" />
              </div>
              <h3 class="text-xl font-bold text-primary mb-2 group-hover:text-primary/80 transition-colors">
                {{ tool.title }}
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed mb-4">
                {{ tool.description }}
              </p>
              <span class="text-sm font-bold text-primary uppercase tracking-widest group-hover:underline">
                {{ tool.cta }}
              </span>
            </NuxtLink>
          </div>
        </div>

        <div>
          <h2 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-3">Utilities</h2>
          <p class="text-gray-600 mb-8 max-w-2xl">
            Browser-based helpers that are not financial calculators.
          </p>
          <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <NuxtLink
              v-for="tool in UTILITY_TOOLS"
              :key="tool.slug"
              :to="tool.path"
              class="group block p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-200"
            >
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <component :is="iconFor(tool.icon)" class="w-6 h-6 text-primary" />
              </div>
              <h3 class="text-xl font-bold text-primary mb-2 group-hover:text-primary/80 transition-colors">
                {{ tool.title }}
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed mb-4">
                {{ tool.description }}
              </p>
              <span class="text-sm font-bold text-primary uppercase tracking-widest group-hover:underline">
                {{ tool.cta }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { CalculatorIcon, DocumentTextIcon, ClipboardDocumentListIcon } from '@heroicons/vue/24/outline'
import { FINANCE_TOOLS, UTILITY_TOOLS, TOOLS } from '~/data/toolsCatalog'
import { webPageJsonLd } from '~/utils/seo'

const icons = {
  calculator: CalculatorIcon,
  document: DocumentTextIcon,
  clipboard: ClipboardDocumentListIcon
}

const iconFor = (name) => icons[name] || CalculatorIcon

const pageTitle = 'Canada Calculators & Utilities | Prishan Fernando'
const pageDescription = 'Canada-focused mortgage, tax, HELOC, and RRSP vs TFSA vs FHSA calculators, plus a rental application and todo board. Estimates only — not financial advice.'

const seoConfig = useRuntimeConfig()
const siteUrl = seoConfig.public.siteUrl

usePageSeo({
  title: pageTitle,
  description: pageDescription,
  jsonLd: () => [
    webPageJsonLd({
      siteUrl,
      path: '/tools/',
      name: pageTitle,
      description: pageDescription
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: pageTitle,
      description: pageDescription,
      itemListElement: TOOLS.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tool.title,
        description: tool.description,
        url: `${String(siteUrl || 'https://prishanfernando.com').replace(/\/+$/, '')}${tool.path.endsWith('/') ? tool.path : `${tool.path}/`}`
      }))
    }
  ]
})
</script>
