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
          Calculators and utilities to explore ideas from the blog and everyday decisions.
        </p>
      </div>
    </section>

    <section class="py-16">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            to="/tools/mortgage-calculator"
            class="group block p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-200"
          >
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <CalculatorIcon class="w-6 h-6 text-primary" />
            </div>
            <h2 class="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
              Mortgage Calculator
            </h2>
            <p class="text-gray-600 text-sm leading-relaxed mb-4">
              Amortization, extra principal with annual limit, term summary, and compare up to 3 scenarios with charts.
            </p>
            <span class="text-sm font-bold text-accent uppercase tracking-widest group-hover:underline">
              Open calculator →
            </span>
          </NuxtLink>

          <NuxtLink
            to="/tools/canadian-tax-calculator"
            class="group block p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-200"
          >
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <CalculatorIcon class="w-6 h-6 text-primary" />
            </div>
            <h2 class="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
              Canadian Tax Calculator
            </h2>
            <p class="text-gray-600 text-sm leading-relaxed mb-4">
              Federal and provincial tax estimate. Salary, interest, dividends, capital gains, rental income. RRSP and rental expense deductions. Compare up to 3 scenarios.
            </p>
            <span class="text-sm font-bold text-accent uppercase tracking-widest group-hover:underline">
              Open calculator →
            </span>
          </NuxtLink>

          <NuxtLink
            to="/tools/heloc-mortgage-calculator"
            class="group block p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-200"
          >
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <CalculatorIcon class="w-6 h-6 text-primary" />
            </div>
            <h2 class="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
              HELOC vs Mortgage Calculator
            </h2>
            <p class="text-gray-600 text-sm leading-relaxed mb-4">
              Compare converting your HELOC to a fixed mortgage vs making extra principal payments. See monthly payments and 5-year outcomes with your own numbers.
            </p>
            <span class="text-sm font-bold text-accent uppercase tracking-widest group-hover:underline">
              Open calculator →
            </span>
          </NuxtLink>

          <NuxtLink
            to="/tools/rental-application"
            class="group block p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-200"
          >
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <DocumentTextIcon class="w-6 h-6 text-primary" />
            </div>
            <h2 class="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
              Rental Application
            </h2>
            <p class="text-gray-600 text-sm leading-relaxed mb-4">
              Multi-step residential rental application. Progress is saved in your browser; generate a PDF when complete.
            </p>
            <span class="text-sm font-bold text-accent uppercase tracking-widest group-hover:underline">
              Open form →
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { CalculatorIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'

useSeoMeta({
  title: 'Tools - Prishan Fernando',
  description: 'Interactive calculators and tools: Mortgage calculator, Canadian tax calculator, HELOC vs Mortgage calculator, Rental application and more.'
})
</script>
