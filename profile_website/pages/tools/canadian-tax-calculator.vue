<template>
  <div class="min-h-screen bg-white">
    <!-- Hero (matches site: inverse, primary, accent) -->
    <section class="relative pt-12 pb-12 overflow-hidden bg-inverse/85">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/tools" class="inline-flex items-center text-xs font-bold text-accent uppercase tracking-[0.3em] mb-8 hover:text-primary transition-colors group">
          <ArrowLeftIcon class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Tools
        </NuxtLink>
        <h1 class="text-4xl md:text-6xl font-black text-primary mb-4 tracking-tighter">
          Canadian Tax Calculator
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl">
          Federal &amp; provincial estimate by tax year. Salary, interest, dividends, capital gains, rental income. RRSP and rental deductions. CPP/EI and investment gross-ups.
        </p>
      </div>
    </section>

    <!-- Scenarios & content (no negative margin – stays below header) -->
    <section class="py-12 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 class="text-xl font-bold text-primary">Scenarios</h2>
          <div class="flex items-center gap-3">
            <button
              v-for="(s, idx) in scenarios"
              :key="idx"
              type="button"
              @click="activeScenarioIndex = idx"
              :class="[
                'px-4 py-2.5 rounded-lg font-medium transition-colors',
                activeScenarioIndex === idx
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ scenarioLabel(idx) }}
            </button>
            <button
              v-if="scenarios.length < 3"
              type="button"
              @click="addScenario"
              class="px-4 py-2.5 text-sm font-semibold text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              title="Add scenario"
            >
              + Add scenario
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-7 space-y-6">
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center gap-3 mb-4">
                <MapPinIcon class="w-5 h-5 text-primary" />
                <h3 class="font-bold text-primary uppercase text-xs tracking-widest">Tax jurisdiction</h3>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tax year</label>
                  <select
                    v-model="taxYear"
                    class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option v-for="y in TAX_YEAR_OPTIONS" :key="y" :value="y">{{ y }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Province</label>
                  <select
                    v-model="activeScenario.province"
                    class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option v-for="p in provinces" :key="p.code" :value="p.code">{{ p.name }}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center gap-3 mb-6">
                <BanknotesIcon class="w-5 h-5 text-primary" />
                <h3 class="font-bold text-primary uppercase text-xs tracking-widest">Income sources</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="field in incomeFields" :key="field.key">
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ field.label }}</label>
                  <div class="relative group">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium group-focus-within:text-primary transition-colors">$</span>
                    <input
                      v-model.number="activeScenario[field.key]"
                      type="number"
                      min="0"
                      class="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center gap-3 mb-6">
                <ReceiptRefundIcon class="w-5 h-5 text-primary" />
                <h3 class="font-bold text-primary uppercase text-xs tracking-widest">Deductions</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">RRSP contribution</label>
                  <input v-model.number="activeScenario.rrsp" type="number" min="0" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Rental expenses</label>
                  <input v-model.number="activeScenario.rentalExpenses" type="number" min="0" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums" />
                </div>
              </div>
            </div>

            <div v-if="scenarios.length > 1" class="flex justify-end">
              <button type="button" @click="removeScenario(activeScenarioIndex)" class="text-sm text-red-600 hover:text-red-700 font-medium">
                Remove {{ scenarioLabel(activeScenarioIndex) }}
              </button>
            </div>
          </div>

          <div class="lg:col-span-5">
            <div class="lg:sticky lg:top-24 space-y-6">
              <div class="bg-gradient-to-br from-primary/15 via-white to-secondary/30 rounded-2xl p-8 border border-primary/20 shadow-sm relative overflow-hidden">
                <div class="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                <div class="relative">
                  <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">After-tax take home</p>
                  <h2 class="text-4xl font-black text-primary mb-6 tabular-nums tracking-tighter">{{ formatCurrency(activeResult.afterTaxIncome) }}</h2>
                  <div class="grid grid-cols-2 gap-4 border-t border-gray-200/80 pt-6">
                    <div>
                      <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Effective rate</p>
                      <p class="text-xl font-bold text-gray-800">{{ activeResult.effectiveRate != null ? activeResult.effectiveRate.toFixed(1) : '—' }}%</p>
                    </div>
                    <div>
                      <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Marginal rate</p>
                      <p class="text-xl font-bold text-primary">~{{ activeResult.marginalRate }}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 class="text-xs font-bold text-accent uppercase tracking-widest mb-4">Tax &amp; payroll breakdown</h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center py-1">
                    <span class="text-sm font-medium text-gray-600">Federal tax</span>
                    <span class="text-sm font-semibold tabular-nums text-gray-800">{{ formatCurrency(activeResult.federalTax) }}</span>
                  </div>
                  <div class="flex justify-between items-center py-1">
                    <span class="text-sm font-medium text-gray-600">Provincial tax</span>
                    <span class="text-sm font-semibold tabular-nums text-gray-800">{{ formatCurrency(activeResult.provincialTax) }}</span>
                  </div>
                  <div class="flex justify-between items-center py-1">
                    <span class="text-sm font-medium text-gray-600">CPP + CPP2</span>
                    <span class="text-sm font-semibold tabular-nums text-gray-800">{{ formatCurrency(activeResult.cpp) }}</span>
                  </div>
                  <div class="flex justify-between items-center py-1">
                    <span class="text-sm font-medium text-gray-600">EI premium</span>
                    <span class="text-sm font-semibold tabular-nums text-gray-800">{{ formatCurrency(activeResult.ei) }}</span>
                  </div>
                  <div class="pt-4 mt-2 border-t border-gray-100 flex justify-between items-center">
                    <span class="text-sm font-bold text-gray-900">Total tax &amp; payroll</span>
                    <span class="text-lg font-bold text-primary tabular-nums">{{ formatCurrency(activeResult.totalTax + activeResult.cpp + activeResult.ei) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="scenarios.length > 1" class="mt-12 pt-12 border-t border-gray-100">
          <h2 class="text-2xl font-bold text-primary mb-6">Scenario comparison</h2>
          <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
            <table class="w-full text-left border-collapse bg-white">
              <thead class="bg-primary/10 border-b-2 border-primary/20">
                <tr>
                  <th class="py-4 px-6 font-bold text-sm uppercase tracking-wider text-primary">Metric</th>
                  <th v-for="(s, idx) in scenarios" :key="idx" class="py-4 px-6 font-bold text-sm uppercase tracking-wider text-primary text-right" :class="{ 'ring-2 ring-primary ring-inset': activeScenarioIndex === idx }">
                    {{ scenarioLabel(idx) }} ({{ s.province }})
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr>
                  <td class="py-4 px-6 text-sm font-medium text-gray-800">Total income</td>
                  <td v-for="(res, idx) in allResults" :key="idx" class="py-4 px-6 text-right font-semibold text-gray-800 tabular-nums" :class="activeScenarioIndex === idx ? 'bg-primary/5' : ''">
                    {{ formatCurrency(res.totalIncome) }}
                  </td>
                </tr>
                <tr>
                  <td class="py-4 px-6 text-sm font-medium text-gray-800">Effective rate</td>
                  <td v-for="(res, idx) in allResults" :key="idx" class="py-4 px-6 text-right font-semibold text-gray-800 tabular-nums" :class="activeScenarioIndex === idx ? 'bg-primary/5' : ''">
                    {{ res.effectiveRate != null ? res.effectiveRate.toFixed(1) + '%' : '—' }}
                  </td>
                </tr>
                <tr>
                  <td class="py-4 px-6 text-sm font-medium text-gray-800">Marginal rate</td>
                  <td v-for="(res, idx) in allResults" :key="idx" class="py-4 px-6 text-right font-semibold text-gray-800 tabular-nums" :class="activeScenarioIndex === idx ? 'bg-primary/5' : ''">
                    ~{{ res.marginalRate }}%
                  </td>
                </tr>
                <tr>
                  <td class="py-4 px-6 text-sm font-medium text-gray-800">After-tax income</td>
                  <td v-for="(res, idx) in allResults" :key="idx" class="py-4 px-6 text-right font-semibold text-primary tabular-nums" :class="activeScenarioIndex === idx ? 'bg-primary/5' : ''">
                    {{ formatCurrency(res.afterTaxIncome) }}
                  </td>
                </tr>
                <tr>
                  <td class="py-4 px-6 text-sm font-medium text-gray-800">Total tax &amp; payroll</td>
                  <td v-for="(res, idx) in allResults" :key="idx" class="py-4 px-6 text-right font-semibold text-gray-800 tabular-nums" :class="activeScenarioIndex === idx ? 'bg-primary/5' : ''">
                    {{ formatCurrency(res.totalTax + res.cpp + res.ei) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-xl bg-amber-50 border border-amber-200 p-4 text-center">
          <p class="text-sm text-amber-800 font-medium">Estimates only. {{ taxYear }} tax year. Verify with CRA and a tax professional.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  ArrowLeftIcon,
  MapPinIcon,
  BanknotesIcon,
  ReceiptRefundIcon
} from '@heroicons/vue/24/outline'
import { TAX_YEAR_OPTIONS, calculateTax, getProvincesList } from '~/utils/canadianTax'

const incomeFields = [
  { label: 'Salary / Employment', key: 'salary' },
  { label: 'Interest Income', key: 'interest' },
  { label: 'Eligible Dividends', key: 'eligibleDividend' },
  { label: 'Non-Eligible Dividends', key: 'nonEligibleDividend' },
  { label: 'Capital Gains', key: 'capitalGains' },
  { label: 'Rental Income', key: 'rentalIncome' },
]

// --- State Management ---

const defaultScenario = () => ({
  province: 'ON',
  salary: 75000,
  interest: 0,
  eligibleDividend: 0,
  nonEligibleDividend: 0,
  capitalGains: 0,
  rentalIncome: 0,
  rentalExpenses: 0,
  rrsp: 0
})

const taxYear = ref(2025)
const scenarios = ref([defaultScenario()])
const activeScenarioIndex = ref(0)

const provinces = computed(() => getProvincesList(taxYear.value))
const activeScenario = computed(() => scenarios.value[activeScenarioIndex.value])
const activeResult = computed(() => calculateTax(activeScenario.value, taxYear.value))
const allResults = computed(() => scenarios.value.map(s => calculateTax(s, taxYear.value)))

const scenarioLabel = (idx) => ['Scenario A', 'Scenario B', 'Scenario C'][idx]
const addScenario = () => { if (scenarios.value.length < 3) scenarios.value.push(defaultScenario()) }
const removeScenario = (idx) => { 
  scenarios.value.splice(idx, 1)
  activeScenarioIndex.value = 0
}

const formatCurrency = (n) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n)

</script>

<style>
/* Custom transitions for a slicker feel */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>