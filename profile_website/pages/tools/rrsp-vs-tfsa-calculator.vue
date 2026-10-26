<template>
  <div class="min-h-screen bg-white">
    <section class="relative pt-12 pb-12 overflow-hidden bg-inverse/85">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/tools" class="inline-flex items-center text-xs font-bold text-accent uppercase tracking-[0.3em] mb-8 hover:text-primary transition-colors group">
          <ArrowLeftIcon class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Tools
        </NuxtLink>
        <h1 class="text-4xl md:text-6xl font-black text-primary mb-4 tracking-tighter">
          RRSP vs TFSA vs FHSA Calculator (Canada, 2026)
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl">
          Put the same dollars into an RRSP, TFSA, FHSA, or non-registered account and compare after-tax value for any province or territory. Tax math reuses the 2026 federal and provincial engine from the
          <NuxtLink to="/tools/canadian-tax-calculator" class="font-semibold text-primary hover:underline">Canadian Tax Calculator</NuxtLink>.
        </p>
        <div class="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2">
          <NuxtLink to="/posts/rrsp-vs-tfsa-vs-fhsa-calculator-canada-2026" class="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            How I use this calculator →
          </NuxtLink>
          <NuxtLink to="/posts/canadian-income-rrsp-tax-strategies" class="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            Income, RRSP, and tax strategies →
          </NuxtLink>
          <NuxtLink to="/posts/canadian-20k-investment-tax-guide-2026" class="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            Investment playbook →
          </NuxtLink>
          <NuxtLink to="/posts/debt-vs-invest-2026" class="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            Pay down debt or invest →
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="py-12 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-xl font-bold text-primary mb-6">Your scenario</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <label for="rrsp-province" class="block text-sm font-medium text-gray-700 mb-2">Province or territory</label>
            <select
              id="rrsp-province"
              v-model="inputs.province"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option v-for="p in provinces" :key="p.code" :value="p.code">{{ p.name }}</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Residence on 31 December 2026. Used for tax now and at withdrawal. Defaults to British Columbia.</p>
          </div>
          <div>
            <label for="rrsp-income" class="block text-sm font-medium text-gray-700 mb-2">Current income ($)</label>
            <input
              id="rrsp-income"
              v-model.number="inputs.income"
              type="number"
              min="0"
              step="1000"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">Employment income, 2026 tax year.</p>
          </div>
          <div>
            <label for="rrsp-contribution" class="block text-sm font-medium text-gray-700 mb-2">Contribution ($)</label>
            <input
              id="rrsp-contribution"
              v-model.number="inputs.contribution"
              type="number"
              min="0"
              step="500"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">The same cash placed in one account.</p>
          </div>
          <div>
            <label for="rrsp-years" class="block text-sm font-medium text-gray-700 mb-2">Years invested</label>
            <input
              id="rrsp-years"
              v-model.number="inputs.years"
              type="number"
              min="0"
              max="60"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
          </div>
          <div>
            <label for="rrsp-return" class="block text-sm font-medium text-gray-700 mb-2">Expected return (% / year)</label>
            <input
              id="rrsp-return"
              v-model.number="inputs.returnPct"
              type="number"
              min="0"
              max="20"
              step="0.1"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
          </div>
          <div>
            <label for="rrsp-withdrawal-mode" class="block text-sm font-medium text-gray-700 mb-2">Tax at withdrawal</label>
            <select
              id="rrsp-withdrawal-mode"
              v-model="inputs.withdrawalMode"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="income">Expected income at withdrawal</option>
              <option value="rate">Combined tax rate</option>
            </select>
          </div>
          <div v-if="inputs.withdrawalMode === 'income'">
            <label for="rrsp-withdrawal-income" class="block text-sm font-medium text-gray-700 mb-2">Expected income at withdrawal ($)</label>
            <input
              id="rrsp-withdrawal-income"
              v-model.number="inputs.withdrawalIncome"
              type="number"
              min="0"
              step="1000"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">Other income in the year you withdraw. Taxed with the same province’s 2026 brackets as the contribution year.</p>
          </div>
          <div v-else>
            <label for="rrsp-withdrawal-rate" class="block text-sm font-medium text-gray-700 mb-2">Combined tax rate at withdrawal (%)</label>
            <input
              id="rrsp-withdrawal-rate"
              v-model.number="inputs.withdrawalRatePct"
              type="number"
              min="0"
              max="80"
              step="0.1"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <label class="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-5 cursor-pointer hover:border-primary/20 transition-colors">
            <input id="rrsp-fthb" v-model="inputs.firstTimeHomeBuyer" type="checkbox" class="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30" />
            <span>
              <span class="block text-sm font-semibold text-primary">Eligible first-time home buyer</span>
              <span class="block text-xs text-gray-500 mt-1">Required to open an FHSA and take a qualifying tax-free withdrawal.</span>
            </span>
          </label>
          <label class="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-5 cursor-pointer hover:border-primary/20 transition-colors">
            <input id="rrsp-reinvest" v-model="inputs.reinvestRefundInTfsa" type="checkbox" class="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30" />
            <span>
              <span class="block text-sm font-semibold text-primary">Reinvest the tax refund in a TFSA</span>
              <span class="block text-xs text-gray-500 mt-1">Applies to the RRSP and FHSA deduction. Assumes you have TFSA room for the refund.</span>
            </span>
          </label>
          <div class="rounded-2xl border border-gray-100 bg-white p-5">
            <label for="rrsp-nonreg" class="block text-sm font-semibold text-primary mb-2">Non-registered tax treatment</label>
            <select
              id="rrsp-nonreg"
              v-model="inputs.nonRegisteredTreatment"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="capital-gains">Capital gain at withdrawal (50% inclusion)</option>
              <option value="interest">Interest taxed each year</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 bg-gradient-to-br from-inverse/50 via-white to-secondary/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-primary">Recommendation</h2>
          <p class="text-sm text-gray-600 mt-1">After-tax value of {{ formatCurrency(result.contribution) }} after {{ result.years }} years at {{ (result.annualReturn * 100).toFixed(1) }}%.</p>
        </div>

        <div class="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/30 rounded-2xl p-6 border border-primary/20 mb-8">
          <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">{{ result.winner.key ? 'Winner' : 'Enter a contribution' }}</p>
          <h3 class="text-2xl font-black text-primary mb-2">
            {{ result.winner.name || '—' }}
            <span v-if="result.winner.key" class="text-lg font-bold tabular-nums"> · {{ formatCurrency(result.winner.afterTaxValue) }}</span>
          </h3>
          <p class="text-sm text-gray-700 max-w-3xl">{{ result.winner.reason }}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            v-for="card in accountCards"
            :key="card.key"
            class="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow"
            :class="result.winner.key === card.key ? 'border-primary/40 ring-1 ring-primary/20' : 'border-gray-100'"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrophyIcon v-if="result.winner.key === card.key" class="w-6 h-6 text-primary" />
                <BanknotesIcon v-else class="w-6 h-6 text-primary" />
              </div>
              <span class="text-xs font-bold uppercase tracking-widest" :class="card.eligible ? 'text-accent' : 'text-gray-400'">
                {{ card.eligible ? (result.winner.key === card.key ? 'Best' : 'Eligible') : 'Not eligible' }}
              </span>
            </div>
            <h3 class="text-lg font-bold text-primary mb-1">{{ card.name }}</h3>
            <p class="text-2xl font-black tabular-nums tracking-tight" :class="card.eligible ? 'text-primary' : 'text-gray-400'">
              {{ card.eligible ? formatCurrency(card.afterTaxValue) : '—' }}
            </p>
            <p class="text-xs text-gray-500 mt-3 leading-relaxed">{{ card.note }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl p-6 border border-gray-100">
            <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">Tax savings now</p>
            <p class="text-2xl font-black text-primary tabular-nums">{{ formatPct(result.contributionRefundRate) }}</p>
            <p class="text-sm text-gray-600 mt-1">Refund {{ formatCurrency(result.refund) }} on this contribution. Combined income-tax rate on extra investment income: {{ formatPct(result.currentRate) }}.</p>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-gray-100">
            <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">Tax on RRSP withdrawal</p>
            <p class="text-2xl font-black text-primary tabular-nums">{{ formatPct(result.withdrawalRate) }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ formatCurrency(result.accounts.rrsp.taxOnWithdrawal) }} of tax if the RRSP grows to {{ formatCurrency(result.grownContribution) }}.</p>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-gray-100">
            <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">Refund if reinvested</p>
            <p class="text-2xl font-black text-primary tabular-nums">{{ formatCurrency(result.refundFutureValue) }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ inputs.reinvestRefundInTfsa ? 'Grown in a TFSA at the same return.' : 'Face value only — refund is not invested.' }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <h2 class="text-2xl font-bold text-primary mb-2">After-tax comparison</h2>
          <p class="text-gray-600 mb-6">Same contribution, same return, different wrappers.</p>
          <div class="overflow-x-auto rounded-xl border border-gray-100 shadow-lg">
            <table class="w-full text-left border-collapse bg-white">
              <thead class="bg-gray-50 border-b-2 border-gray-100">
                <tr>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Account</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">Grows to</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">Tax at withdrawal</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">Refund (now / later)</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">After-tax value</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in tableRows"
                  :key="row.key"
                  class="border-b border-gray-50 hover:bg-gray-50/30 transition-colors"
                  :class="result.winner.key === row.key ? 'bg-primary/5' : ''"
                >
                  <td class="py-4 px-6 text-sm font-medium text-gray-800">
                    {{ row.name }}
                    <span v-if="result.winner.key === row.key" class="ml-2 text-[10px] font-bold uppercase tracking-widest text-accent">Winner</span>
                    <span v-if="!row.eligible" class="ml-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">N/A</span>
                  </td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-right tabular-nums">{{ row.eligible ? formatCurrency(row.futureValue) : '—' }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-right tabular-nums">{{ row.eligible ? formatCurrency(row.taxOnWithdrawal) : '—' }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-right tabular-nums">
                    <template v-if="row.eligible && row.refund">{{ formatCurrency(row.refund) }} / {{ formatCurrency(row.refundFutureValue) }}</template>
                    <template v-else-if="row.eligible">—</template>
                    <template v-else>—</template>
                  </td>
                  <td class="py-4 px-6 text-sm font-bold text-gray-900 text-right tabular-nums">{{ row.eligible ? formatCurrency(row.afterTaxValue) : '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="rounded-2xl border border-gray-100 p-6">
            <h2 class="text-xl font-bold text-primary mb-4">2026 contribution-limit assumptions</h2>
            <ul class="space-y-3 text-sm text-gray-700">
              <li>
                <strong>RRSP:</strong> dollar limit {{ formatCurrency(result.limits.rrspDollarLimit) }}; room proxy for this income {{ formatCurrency(result.limits.rrspRoomProxy) }} (lesser of 18% and the dollar limit).
                Actual room uses prior-year earned income, unused room, and pension adjustment —
                <a class="font-semibold text-primary hover:underline" href="https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html" target="_blank" rel="noopener noreferrer">CRA limits table</a>.
              </li>
              <li>
                <strong>TFSA:</strong> {{ formatCurrency(result.limits.tfsaAnnual) }} annual dollar limit for 2026 —
                <a class="font-semibold text-primary hover:underline" href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account/contributing/calculate-room.html" target="_blank" rel="noopener noreferrer">CRA TFSA room</a>.
              </li>
              <li>
                <strong>FHSA:</strong> {{ formatCurrency(result.limits.fhsaAnnual) }} per year, {{ formatCurrency(result.limits.fhsaLifetime) }} lifetime —
                <a class="font-semibold text-primary hover:underline" href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account/contributing-your-fhsa.html" target="_blank" rel="noopener noreferrer">CRA FHSA contributions</a>.
              </li>
            </ul>
            <p class="text-sm text-gray-600 mt-4">These are published CRA figures, not your personal room. Check <strong>CRA My Account</strong> before you contribute.</p>
          </div>

          <div class="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 class="text-xl font-bold text-primary mb-4">Assumptions and disclaimer</h2>
            <ul class="list-disc pl-5 space-y-2 text-sm text-amber-950">
              <li>2026 federal + provincial income tax only, from the same engine as the Canadian tax calculator (all 13 provinces and territories). Not payroll, OAS, GIS, or AMT.</li>
              <li>Constant annual return, no fees, no inflation, one lump-sum contribution.</li>
              <li>FHSA path assumes a qualifying first-home withdrawal. Non-qualifying withdrawals are taxable.</li>
              <li>RRSP withholding on a cash withdrawal is not modelled; tax at filing is.</li>
              <li>Reinvesting the refund in a TFSA assumes available TFSA room.</li>
            </ul>
            <p class="text-sm font-medium text-amber-900 mt-4">Educational estimates only. This is not financial, tax, or legal advice. Confirm anything that matters with the CRA and a qualified professional.</p>
          </div>
        </div>

        <div v-if="result.warnings.length" class="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p class="text-sm font-semibold text-amber-900 mb-2">Room notes</p>
          <ul class="list-disc pl-5 space-y-1 text-sm text-amber-900">
            <li v-for="warning in result.warnings" :key="warning">{{ warning }}</li>
          </ul>
        </div>
      </div>
    </section>

    <ToolsToolSeoContent seo-key="rrsp-vs-tfsa-calculator" />
  </div>
</template>

<script setup>
import { ArrowLeftIcon, BanknotesIcon, TrophyIcon } from '@heroicons/vue/24/outline'
import { getToolSeo } from '~/data/toolSeo'
import { faqPageJsonLd, softwareApplicationJsonLd } from '~/utils/seo'
import { compareRegisteredAccounts, REGISTERED_ACCOUNT_PROVINCE } from '~/utils/registeredAccounts'
import { DEFAULT_TAX_YEAR, getCanadaProvincesList } from '~/utils/canadianTax'

const toolSeo = getToolSeo('rrsp-vs-tfsa-calculator')
const seoConfig = useRuntimeConfig()
const siteUrl = seoConfig.public.siteUrl

usePageSeo({
  title: toolSeo.title,
  description: toolSeo.description,
  jsonLd: [
    softwareApplicationJsonLd({
      siteUrl,
      path: '/tools/rrsp-vs-tfsa-calculator/',
      name: 'RRSP vs TFSA vs FHSA Calculator (Canada, 2026)',
      description: toolSeo.description
    }),
    faqPageJsonLd(toolSeo.faqs)
  ]
})

const provinces = getCanadaProvincesList(DEFAULT_TAX_YEAR)

const inputs = reactive({
  province: REGISTERED_ACCOUNT_PROVINCE,
  income: 95000,
  contribution: 7000,
  years: 20,
  returnPct: 6,
  withdrawalMode: 'income',
  withdrawalIncome: 55000,
  withdrawalRatePct: 22,
  firstTimeHomeBuyer: true,
  reinvestRefundInTfsa: true,
  nonRegisteredTreatment: 'capital-gains'
})

const result = computed(() => compareRegisteredAccounts({
  province: inputs.province,
  income: inputs.income,
  contribution: inputs.contribution,
  years: inputs.years,
  annualReturn: (Number(inputs.returnPct) || 0) / 100,
  withdrawalMode: inputs.withdrawalMode,
  withdrawalIncome: inputs.withdrawalIncome,
  withdrawalRate: (Number(inputs.withdrawalRatePct) || 0) / 100,
  firstTimeHomeBuyer: inputs.firstTimeHomeBuyer,
  reinvestRefundInTfsa: inputs.reinvestRefundInTfsa,
  nonRegisteredTreatment: inputs.nonRegisteredTreatment
}))

const accountCards = computed(() => ([
  result.value.accounts.fhsa,
  result.value.accounts.rrsp,
  result.value.accounts.tfsa,
  result.value.accounts.nonRegistered
]))

const tableRows = computed(() => accountCards.value)

function formatCurrency (n) {
  if (n == null || Number.isNaN(n)) return '—'
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n)
}

function formatPct (rate) {
  if (rate == null || Number.isNaN(rate)) return '—'
  return `${(rate * 100).toFixed(1)}%`
}
</script>
