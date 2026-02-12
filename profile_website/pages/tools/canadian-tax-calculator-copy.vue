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
          Canadian Tax Calculator
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl">
          Estimate federal and provincial income tax for Canada. Salary, interest, dividends, capital gains, rental income. RRSP and rental expense deductions. Compare scenarios.
        </p>
      </div>
    </section>

    <!-- Scenarios & Inputs -->
    <section class="py-12 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 class="text-xl font-bold text-primary">Scenarios</h2>
          <div class="flex items-center gap-3">
            <button
              v-for="(s, idx) in scenarios"
              :key="idx"
              type="button"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                activeScenarioIndex === idx
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
              @click="activeScenarioIndex = idx"
            >
              {{ scenarioLabel(idx) }}
            </button>
            <button
              v-if="scenarios.length < 3"
              type="button"
              class="px-4 py-2 text-sm font-semibold text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              @click="addScenario"
            >
              + Add scenario
            </button>
          </div>
        </div>

        <div v-for="(scenario, idx) in scenarios" :key="idx" class="mb-10">
          <div v-show="activeScenarioIndex === idx" class="space-y-6">
            <div class="mb-4 flex items-center gap-6">
              <div class="w-56">
                <label class="block text-sm font-medium text-gray-700 mb-2">Province / Territory</label>
                <select
                  v-model="scenario.province"
                  class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option v-for="p in provinces" :key="p.code" :value="p.code">{{ p.name }}</option>
                </select>
              </div>
            </div>

            <h3 class="text-sm font-bold text-primary">Income</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Salary / employment ($)</label>
                <input
                  v-model.number="scenario.salary"
                  type="number"
                  min="0"
                  step="1000"
                  class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Interest ($)</label>
                <input
                  v-model.number="scenario.interest"
                  type="number"
                  min="0"
                  step="100"
                  class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Eligible dividends ($)</label>
                <input
                  v-model.number="scenario.eligibleDividend"
                  type="number"
                  min="0"
                  step="100"
                  class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <p class="text-xs text-gray-500 mt-1">Canadian public corps, preferred shares</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Non-eligible dividends ($)</label>
                <input
                  v-model.number="scenario.nonEligibleDividend"
                  type="number"
                  min="0"
                  step="100"
                  class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Capital gains ($)</label>
                <input
                  v-model.number="scenario.capitalGains"
                  type="number"
                  min="0"
                  step="100"
                  class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <p class="text-xs text-gray-500 mt-1">50% taxable</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Rental income ($)</label>
                <input
                  v-model.number="scenario.rentalIncome"
                  type="number"
                  min="0"
                  step="100"
                  class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </div>

            <h3 class="text-sm font-bold text-primary pt-2">Deductions</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">RRSP contribution ($)</label>
                <input
                  v-model.number="scenario.rrsp"
                  type="number"
                  min="0"
                  step="500"
                  class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Rental expenses ($)</label>
                <input
                  v-model.number="scenario.rentalExpenses"
                  type="number"
                  min="0"
                  step="100"
                  class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <p class="text-xs text-gray-500 mt-1">Deductible from rental income</p>
              </div>
            </div>

            <div v-if="scenarios.length > 1" class="flex justify-end">
              <button
                type="button"
                class="text-sm text-red-600 hover:text-red-700 font-medium"
                @click="removeScenario(idx)"
              >
                Remove scenario
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Summary (active scenario) -->
    <section class="py-12 bg-gradient-to-br from-inverse/50 via-white to-secondary/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-primary mb-2">Summary — {{ scenarioLabel(activeScenarioIndex) }}</h2>
        <p class="text-gray-600 mb-6">{{ activeScenario.province ? getProvinceName(activeScenario.province) : '' }} · Tax year 2024</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <span class="text-xs font-bold text-accent uppercase tracking-widest">Total income</span>
            <p class="text-2xl font-black text-primary mt-1 tabular-nums">{{ formatCurrency(activeResult.totalIncome) }}</p>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <span class="text-xs font-bold text-accent uppercase tracking-widest">Taxable income</span>
            <p class="text-2xl font-black text-primary mt-1 tabular-nums">{{ formatCurrency(activeResult.taxableIncome) }}</p>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <span class="text-xs font-bold text-accent uppercase tracking-widest">Total tax</span>
            <p class="text-2xl font-black text-primary mt-1 tabular-nums">{{ formatCurrency(activeResult.totalTax) }}</p>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <span class="text-xs font-bold text-accent uppercase tracking-widest">After-tax income</span>
            <p class="text-2xl font-black text-primary mt-1 tabular-nums">{{ formatCurrency(activeResult.afterTaxIncome) }}</p>
          </div>
        </div>
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl p-6 border border-gray-100">
            <h3 class="text-sm font-bold text-primary mb-3">Tax breakdown</h3>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between"><dt class="text-gray-600">Federal tax</dt><dd class="tabular-nums font-medium">{{ formatCurrency(activeResult.federalTax) }}</dd></div>
              <div class="flex justify-between"><dt class="text-gray-600">Provincial tax</dt><dd class="tabular-nums font-medium">{{ formatCurrency(activeResult.provincialTax) }}</dd></div>
              <div class="flex justify-between pt-2 border-t"><dt class="text-gray-800 font-medium">Effective rate</dt><dd class="tabular-nums font-medium">{{ activeResult.effectiveRate != null ? activeResult.effectiveRate.toFixed(1) + '%' : '—' }}</dd></div>
            </dl>
          </div>
          <div class="bg-white rounded-xl p-6 border border-gray-100">
            <h3 class="text-sm font-bold text-primary mb-3">Income breakdown (taxable)</h3>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between"><dt class="text-gray-600">Employment + interest</dt><dd class="tabular-nums">{{ formatCurrency(activeResult.employmentInterestTaxable) }}</dd></div>
              <div class="flex justify-between"><dt class="text-gray-600">Eligible dividends (grossed-up)</dt><dd class="tabular-nums">{{ formatCurrency(activeResult.eligibleDivTaxable) }}</dd></div>
              <div class="flex justify-between"><dt class="text-gray-600">Non-eligible dividends (grossed-up)</dt><dd class="tabular-nums">{{ formatCurrency(activeResult.nonEligibleDivTaxable) }}</dd></div>
              <div class="flex justify-between"><dt class="text-gray-600">Capital gains (50%)</dt><dd class="tabular-nums">{{ formatCurrency(activeResult.capGainsTaxable) }}</dd></div>
              <div class="flex justify-between"><dt class="text-gray-600">Net rental</dt><dd class="tabular-nums">{{ formatCurrency(activeResult.netRentalTaxable) }}</dd></div>
              <div class="flex justify-between"><dt class="text-gray-600">Less RRSP</dt><dd class="tabular-nums text-red-600">-{{ formatCurrency(activeResult.rrspDeduction) }}</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <!-- Scenario comparison -->
    <section v-if="scenarios.length >= 2" class="py-12 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-primary mb-2">Scenario comparison</h2>
        <p class="text-gray-600 mb-6">Compare tax outcomes across scenarios.</p>
        <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
          <table class="w-full text-left border-collapse bg-white">
            <thead class="bg-primary/10 border-b-2 border-primary/20">
              <tr>
                <th class="py-4 px-6 font-bold text-sm uppercase tracking-wider text-primary">Metric</th>
                <th
                  v-for="(s, idx) in scenarios"
                  :key="idx"
                  class="py-4 px-6 font-bold text-sm uppercase tracking-wider text-primary text-right"
                  :class="{ 'ring-2 ring-primary ring-inset': activeScenarioIndex === idx }"
                >
                  <div>{{ scenarioLabel(idx) }}</div>
                  <div class="text-xs font-normal text-gray-600 mt-1">{{ getProvinceName(s.province) }}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 text-sm font-medium text-gray-800">Total income</td>
                <td v-for="(_, idx) in scenarios" :key="idx" class="py-4 px-6 text-sm text-right tabular-nums" :class="activeScenarioIndex === idx ? 'bg-primary/5' : ''">
                  {{ formatCurrency(allResults[idx].totalIncome) }}
                </td>
              </tr>
              <tr class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 text-sm font-medium text-gray-800">Taxable income</td>
                <td v-for="(_, idx) in scenarios" :key="idx" class="py-4 px-6 text-sm text-right tabular-nums" :class="activeScenarioIndex === idx ? 'bg-primary/5' : ''">
                  {{ formatCurrency(allResults[idx].taxableIncome) }}
                </td>
              </tr>
              <tr class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 text-sm font-medium text-gray-800">Total tax</td>
                <td v-for="(_, idx) in scenarios" :key="idx" class="py-4 px-6 text-sm text-right tabular-nums font-medium" :class="activeScenarioIndex === idx ? 'bg-primary/5' : ''">
                  {{ formatCurrency(allResults[idx].totalTax) }}
                </td>
              </tr>
              <tr class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 text-sm font-medium text-gray-800">After-tax income</td>
                <td v-for="(_, idx) in scenarios" :key="idx" class="py-4 px-6 text-sm text-right tabular-nums font-medium" :class="activeScenarioIndex === idx ? 'bg-primary/5' : ''">
                  {{ formatCurrency(allResults[idx].afterTaxIncome) }}
                </td>
              </tr>
              <tr class="bg-gray-100/80">
                <td class="py-4 px-6 text-sm font-bold text-gray-900">Effective rate</td>
                <td v-for="(_, idx) in scenarios" :key="idx" class="py-4 px-6 text-sm text-right tabular-nums font-bold" :class="activeScenarioIndex === idx ? 'bg-primary/10' : ''">
                  {{ allResults[idx].effectiveRate != null ? allResults[idx].effectiveRate.toFixed(1) + '%' : '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Disclaimer -->
    <section class="py-12 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-xl bg-amber-50 border border-amber-200 p-6">
          <h3 class="text-sm font-bold text-amber-900 mb-2">Disclaimer</h3>
          <p class="text-sm text-amber-800">
            This calculator is for estimation only. It uses 2024 federal and provincial tax brackets, basic personal amount, and dividend tax credits. It does not include CPP/EI, provincial surtaxes (e.g. Ontario health premium), or other credits. Quebec tax is approximated using provincial rates; Quebec has a separate return. Always verify with CRA and a tax professional.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

// 2024 Federal brackets: [ threshold, rate ] — tax on amount up to threshold at rate
const FEDERAL_2024 = {
  brackets: [
    [55867, 0.15],
    [111733, 0.205],
    [173205, 0.26],
    [246752, 0.2932],
    [1e9, 0.33]
  ],
  basicPersonalAmount: 14156,
  basicPersonalAmountMax: 15705,
  dividendEligibleCreditRate: 0.150198,
  dividendNonEligibleCreditRate: 0.090301,
  grossUpEligible: 1.38,
  grossUpNonEligible: 1.15
}

const PROVINCES_2024 = {
  ON: {
    name: 'Ontario',
    brackets: [[51446, 0.0505], [102894, 0.0915], [150000, 0.1116], [220000, 0.1216], [1e9, 0.1316]],
    basicPersonalAmount: 12399,
    dividendEligibleCreditRate: 0.1,
    dividendNonEligibleCreditRate: 0.0334
  },
  BC: {
    name: 'British Columbia',
    brackets: [[47937, 0.0506], [95875, 0.077], [110076, 0.105], [133664, 0.1229], [181232, 0.147], [252752, 0.168], [1e9, 0.205]],
    basicPersonalAmount: 12580,
    dividendEligibleCreditRate: 0.12,
    dividendNonEligibleCreditRate: 0.02
  },
  AB: {
    name: 'Alberta',
    brackets: [[148269, 0.10], [177922, 0.12], [237230, 0.13], [355845, 0.14], [1e9, 0.15]],
    basicPersonalAmount: 21885,
    dividendEligibleCreditRate: 0.08,
    dividendNonEligibleCreditRate: 0.025
  },
  MB: {
    name: 'Manitoba',
    brackets: [[47000, 0.108], [100000, 0.1275], [1e9, 0.174]],
    basicPersonalAmount: 10145,
    dividendEligibleCreditRate: 0.08,
    dividendNonEligibleCreditRate: 0.025
  },
  SK: {
    name: 'Saskatchewan',
    brackets: [[52306, 0.105], [149720, 0.125], [1e9, 0.145]],
    basicPersonalAmount: 17361,
    dividendEligibleCreditRate: 0.11,
    dividendNonEligibleCreditRate: 0.028
  },
  NS: {
    name: 'Nova Scotia',
    brackets: [[29590, 0.0879], [59180, 0.1495], [93000, 0.1667], [150000, 0.175], [1e9, 0.21]],
    basicPersonalAmount: 11481,
    dividendEligibleCreditRate: 0.08,
    dividendNonEligibleCreditRate: 0.028
  },
  NB: {
    name: 'New Brunswick',
    brackets: [[47815, 0.094], [95463, 0.14], [176756, 0.16], [1e9, 0.195]],
    basicPersonalAmount: 11817,
    dividendEligibleCreditRate: 0.08,
    dividendNonEligibleCreditRate: 0.028
  },
  NL: {
    name: 'Newfoundland and Labrador',
    brackets: [[43198, 0.087], [86395, 0.145], [154244, 0.158], [215943, 0.173], [1e9, 0.208]],
    basicPersonalAmount: 10237,
    dividendEligibleCreditRate: 0.08,
    dividendNonEligibleCreditRate: 0.028
  },
  PE: {
    name: 'Prince Edward Island',
    brackets: [[31984, 0.098], [63969, 0.138], [1e9, 0.167]],
    basicPersonalAmount: 12000,
    dividendEligibleCreditRate: 0.105,
    dividendNonEligibleCreditRate: 0.035
  },
  QC: {
    name: 'Quebec',
    brackets: [[52000, 0.14], [104000, 0.19], [1e9, 0.24]],
    basicPersonalAmount: 17783,
    dividendEligibleCreditRate: 0.1175,
    dividendNonEligibleCreditRate: 0.0383
  },
  YT: {
    name: 'Yukon',
    brackets: [[55867, 0.064], [111733, 0.09], [173205, 0.109], [246752, 0.128], [500000, 0.15], [1e9, 0.15]],
    basicPersonalAmount: 14156,
    dividendEligibleCreditRate: 0.12,
    dividendNonEligibleCreditRate: 0.028
  },
  NT: {
    name: 'Northwest Territories',
    brackets: [[50897, 0.059], [101891, 0.086], [165430, 0.122], [1e9, 0.1405]],
    basicPersonalAmount: 16193,
    dividendEligibleCreditRate: 0.115,
    dividendNonEligibleCreditRate: 0.028
  },
  NU: {
    name: 'Nunavut',
    brackets: [[53359, 0.04], [106716, 0.07], [173205, 0.09], [1e9, 0.115]],
    basicPersonalAmount: 18389,
    dividendEligibleCreditRate: 0.04,
    dividendNonEligibleCreditRate: 0.02
  }
}

const provinces = [
  { code: 'ON', name: 'Ontario' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'AB', name: 'Alberta' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'YT', name: 'Yukon' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' }
]

function getProvinceName (code) {
  return PROVINCES_2024[code]?.name || code
}

function taxFromBrackets (taxable, brackets) {
  let tax = 0
  let prev = 0
  for (const [to, rate] of brackets) {
    const inBracket = Math.max(0, Math.min(taxable, to) - prev)
    tax += inBracket * rate
    if (taxable <= to) break
    prev = to
  }
  return tax
}

function calculateTax (scenario) {
  const salary = Math.max(0, Number(scenario.salary) || 0)
  const interest = Math.max(0, Number(scenario.interest) || 0)
  const eligibleDiv = Math.max(0, Number(scenario.eligibleDividend) || 0)
  const nonEligibleDiv = Math.max(0, Number(scenario.nonEligibleDividend) || 0)
  const capGains = Math.max(0, Number(scenario.capitalGains) || 0)
  const rentalIncome = Math.max(0, Number(scenario.rentalIncome) || 0)
  const rentalExpenses = Math.max(0, Number(scenario.rentalExpenses) || 0)
  const rrsp = Math.max(0, Number(scenario.rrsp) || 0)

  const netRental = Math.max(0, rentalIncome - rentalExpenses)
  const eligibleDivTaxable = eligibleDiv * FEDERAL_2024.grossUpEligible
  const nonEligibleDivTaxable = nonEligibleDiv * FEDERAL_2024.grossUpNonEligible
  const capGainsTaxable = capGains * 0.5
  const employmentInterestTaxable = salary + interest

  const totalIncome = salary + interest + eligibleDiv + nonEligibleDiv + capGains + rentalIncome
  let taxableIncome = employmentInterestTaxable + eligibleDivTaxable + nonEligibleDivTaxable + capGainsTaxable + netRental - rrsp
  taxableIncome = Math.max(0, taxableIncome)

  const prov = PROVINCES_2024[scenario.province] || PROVINCES_2024.ON
  const fedBrackets = FEDERAL_2024.brackets
  const provBrackets = prov.brackets

  let federalTaxBeforeCredits = taxFromBrackets(taxableIncome, fedBrackets)
  let provincialTaxBeforeCredits = taxFromBrackets(taxableIncome, provBrackets)

  const federalBpaCredit = FEDERAL_2024.basicPersonalAmount * 0.15
  const provincialBpaCredit = (prov.basicPersonalAmount || 0) * (provBrackets[0]?.[1] || 0.05)
  const federalDivCredit = eligibleDivTaxable * FEDERAL_2024.dividendEligibleCreditRate + nonEligibleDivTaxable * FEDERAL_2024.dividendNonEligibleCreditRate
  const provincialDivCredit = (eligibleDivTaxable * (prov.dividendEligibleCreditRate || 0) + nonEligibleDivTaxable * (prov.dividendNonEligibleCreditRate || 0))

  let federalTax = Math.max(0, federalTaxBeforeCredits - federalBpaCredit - federalDivCredit)
  let provincialTax = Math.max(0, provincialTaxBeforeCredits - provincialBpaCredit - provincialDivCredit)

  const totalTax = federalTax + provincialTax
  const afterTaxIncome = totalIncome - totalTax
  const effectiveRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : null

  return {
    totalIncome,
    taxableIncome,
    employmentInterestTaxable,
    eligibleDivTaxable,
    nonEligibleDivTaxable,
    capGainsTaxable,
    netRentalTaxable: netRental,
    rrspDeduction: rrsp,
    federalTax,
    provincialTax,
    totalTax,
    afterTaxIncome,
    effectiveRate
  }
}

function defaultScenario () {
  return {
    province: 'ON',
    salary: 80000,
    interest: 0,
    eligibleDividend: 0,
    nonEligibleDividend: 0,
    capitalGains: 0,
    rentalIncome: 0,
    rentalExpenses: 0,
    rrsp: 5000
  }
}

const scenarios = ref([defaultScenario()])
const activeScenarioIndex = ref(0)

function scenarioLabel (idx) {
  return ['Scenario A', 'Scenario B', 'Scenario C'][idx] || `Scenario ${idx + 1}`
}

function addScenario () {
  if (scenarios.value.length >= 3) return
  scenarios.value.push(defaultScenario())
  activeScenarioIndex.value = scenarios.value.length - 1
}

function removeScenario (idx) {
  if (scenarios.value.length <= 1) return
  scenarios.value.splice(idx, 1)
  if (activeScenarioIndex.value >= scenarios.value.length) activeScenarioIndex.value = Math.max(0, scenarios.value.length - 1)
  else if (idx < activeScenarioIndex.value) activeScenarioIndex.value--
}

const activeScenario = computed(() => scenarios.value[activeScenarioIndex.value] || defaultScenario())
const activeResult = computed(() => calculateTax(activeScenario.value))
const allResults = computed(() => scenarios.value.map(s => calculateTax(s)))

function formatCurrency (n) {
  if (n == null || Number.isNaN(n)) return '—'
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

useSeoMeta({
  title: 'Canadian Tax Calculator - Prishan Fernando',
  description: 'Estimate Canadian federal and provincial income tax. Salary, interest, dividends, capital gains, rental income. RRSP and rental deductions. Compare scenarios by province.'
})
</script>
