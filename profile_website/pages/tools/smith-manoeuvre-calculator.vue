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
          Smith Manoeuvre &amp; Investment Loan Interest Deduction Calculator (Canada, 2026)
        </h1>
        <p class="text-lg text-gray-600 max-w-3xl">
          Estimate deductible HELOC interest, the tax refund at your combined 2026 federal and provincial rate, and net worth versus a plain mortgage. Works for every province and territory. Tax math reuses the 2026 engine from the
          <NuxtLink to="/tools/canadian-tax-calculator" class="font-semibold text-primary hover:underline">Canadian Tax Calculator</NuxtLink>.
        </p>
        <div class="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2">
          <NuxtLink to="/posts/smith-manoeuvre-calculator-canada-2026" class="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            How I use this calculator →
          </NuxtLink>
          <NuxtLink to="/tools/heloc-mortgage-calculator" class="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            HELOC vs mortgage →
          </NuxtLink>
          <NuxtLink to="/tools/rrsp-vs-tfsa-calculator" class="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            RRSP vs TFSA vs FHSA →
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
            <label for="smith-province" class="block text-sm font-medium text-gray-700 mb-2">Province or territory</label>
            <select
              id="smith-province"
              v-model="inputs.province"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option v-for="p in provinces" :key="p.code" :value="p.code">{{ p.name }}</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Residence for 2026 tax. Defaults to Ontario for the worked example; the mortgage math is the same everywhere.</p>
          </div>
          <div>
            <label for="smith-income" class="block text-sm font-medium text-gray-700 mb-2">Annual employment income ($)</label>
            <input
              id="smith-income"
              v-model.number="inputs.income"
              type="number"
              min="0"
              step="1000"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">Used for the interest deduction refund. Payroll (CPP/EI) does not change.</p>
          </div>
          <div>
            <label for="smith-years" class="block text-sm font-medium text-gray-700 mb-2">Years to project</label>
            <input
              id="smith-years"
              v-model.number="inputs.years"
              type="number"
              min="1"
              max="40"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
          </div>
        </div>

        <h2 class="text-xl font-bold text-primary mb-6">Mortgage</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <label for="smith-balance" class="block text-sm font-medium text-gray-700 mb-2">Mortgage balance ($)</label>
            <input
              id="smith-balance"
              v-model.number="inputs.mortgageBalance"
              type="number"
              min="0"
              step="1000"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
          </div>
          <div>
            <label for="smith-mtg-rate" class="block text-sm font-medium text-gray-700 mb-2">Mortgage rate (%)</label>
            <input
              id="smith-mtg-rate"
              v-model.number="inputs.mortgageRatePct"
              type="number"
              min="0"
              max="30"
              step="0.01"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">Example late-2026 rate — not a quote. Canadian semi-annual compounding.</p>
          </div>
          <div>
            <label for="smith-amort" class="block text-sm font-medium text-gray-700 mb-2">Amortization (years)</label>
            <input
              id="smith-amort"
              v-model.number="inputs.amortYears"
              type="number"
              min="1"
              max="40"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
          </div>
        </div>

        <h2 class="text-xl font-bold text-primary mb-6">Readvanceable HELOC</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <label for="smith-heloc-limit" class="block text-sm font-medium text-gray-700 mb-2">HELOC limit ($)</label>
            <input
              id="smith-heloc-limit"
              v-model.number="inputs.helocLimit"
              type="number"
              min="0"
              step="1000"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">Maximum investment HELOC. Keep this portion separate from personal spending.</p>
          </div>
          <div>
            <label for="smith-heloc-rate" class="block text-sm font-medium text-gray-700 mb-2">HELOC rate (%)</label>
            <input
              id="smith-heloc-rate"
              v-model.number="inputs.helocRatePct"
              type="number"
              min="0"
              max="30"
              step="0.01"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">Example variable rate, held constant. Real HELOC rates move with prime.</p>
          </div>
          <div>
            <label for="smith-borrow-mode" class="block text-sm font-medium text-gray-700 mb-2">How you borrow</label>
            <select
              id="smith-borrow-mode"
              v-model="inputs.borrowMode"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option v-for="mode in borrowModeOptions" :key="mode.key" :value="mode.key">{{ mode.label }}</option>
            </select>
          </div>
          <div v-if="inputs.borrowMode === 'principal'">
            <label for="smith-annual-cap" class="block text-sm font-medium text-gray-700 mb-2">Annual re-borrow cap ($)</label>
            <input
              id="smith-annual-cap"
              v-model="inputs.annualReborrow"
              type="number"
              min="0"
              step="1000"
              placeholder="All principal repaid"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">Leave blank to re-borrow the principal repaid each year (the default Smith Manoeuvre).</p>
          </div>
          <div v-else>
            <label for="smith-lump" class="block text-sm font-medium text-gray-700 mb-2">Lump sum to borrow and invest ($)</label>
            <input
              id="smith-lump"
              v-model.number="inputs.lumpSum"
              type="number"
              min="0"
              step="1000"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">Drawn once at the start, up to the HELOC limit. Interest-only after that.</p>
          </div>
        </div>

        <h2 class="text-xl font-bold text-primary mb-6">Portfolio and tax refund</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label for="smith-div" class="block text-sm font-medium text-gray-700 mb-2">Dividend yield (% / year)</label>
            <input
              id="smith-div"
              v-model.number="inputs.dividendYieldPct"
              type="number"
              min="0"
              max="30"
              step="0.1"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">Example Canadian eligible-dividend yield. Not a forecast.</p>
          </div>
          <div>
            <label for="smith-growth" class="block text-sm font-medium text-gray-700 mb-2">Capital growth (% / year)</label>
            <input
              id="smith-growth"
              v-model.number="inputs.growthPct"
              type="number"
              min="-50"
              max="30"
              step="0.1"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">Total return is yield plus growth. Default example is 7%.</p>
          </div>
          <div>
            <label for="smith-refund-use" class="block text-sm font-medium text-gray-700 mb-2">Tax refund</label>
            <select
              id="smith-refund-use"
              v-model="inputs.refundUse"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option v-for="use in refundUseOptions" :key="use.key" :value="use.key">{{ use.label }}</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 bg-gradient-to-br from-inverse/50 via-white to-secondary/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-primary">After {{ result.projectionYears }} years</h2>
          <p class="text-sm text-gray-600 mt-1">
            Monthly P&amp;I {{ formatCurrency(result.payment) }} on {{ formatCurrency(result.current.mortgageStart) }}
            at {{ result.mortgageRatePct }}%, {{ result.amortYears }}-year amortization.
            Example HELOC {{ result.helocRatePct }}%. Combined return {{ result.totalReturnPct.toFixed(1) }}%.
          </p>
        </div>

        <div class="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/30 rounded-2xl p-6 border border-primary/20 mb-8">
          <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">Net worth vs a plain mortgage</p>
          <h3 class="text-2xl font-black text-primary mb-2 tabular-nums">
            {{ formatSigned(result.netWorth.advantage) }}
          </h3>
          <p class="text-sm text-gray-700 max-w-3xl">
            After-tax portfolio {{ formatCurrency(result.portfolio.afterTaxValue) }}
            minus HELOC {{ formatCurrency(result.debt.heloc) }},
            with the house held constant. Break-even return (after-tax cost of borrowing):
            <span class="font-semibold tabular-nums">{{ result.tax.breakEvenReturnPct.toFixed(2) }}%</span>
            at a {{ result.tax.marginalRatePct.toFixed(1) }}% combined marginal rate on the interest deduction.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">Deductible interest</p>
            <p class="text-2xl font-black text-primary tabular-nums">{{ formatCurrency(result.totals.deductibleInterest) }}</p>
            <p class="text-sm text-gray-600 mt-1">HELOC interest over {{ result.projectionYears }} years. Claim on line 22100.</p>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">Tax refund</p>
            <p class="text-2xl font-black text-primary tabular-nums">{{ formatCurrency(result.totals.taxRefund) }}</p>
            <p class="text-sm text-gray-600 mt-1">tax(income) − tax(income − interest) from the 2026 federal + provincial engine.</p>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">After-tax portfolio</p>
            <p class="text-2xl font-black text-primary tabular-nums">{{ formatCurrency(result.portfolio.afterTaxValue) }}</p>
            <p class="text-sm text-gray-600 mt-1">Market value {{ formatCurrency(result.portfolio.marketValue) }} minus tax on the unrealized gain if sold.</p>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">Non-deductible mortgage</p>
            <p class="text-2xl font-black text-primary tabular-nums">{{ formatCurrency(result.debt.smithMortgage) }}</p>
            <p class="text-sm text-gray-600 mt-1">
              <template v-if="result.payoff.fasterBecausePrepay">
                About {{ result.payoff.yearsSaved.toFixed(1) }} years faster than the plain {{ result.payoff.plainYears.toFixed(1) }}-year payoff.
              </template>
              <template v-else>
                Same remaining schedule as a plain mortgage ({{ result.payoff.remainingAmortYearsSmith.toFixed(1) }} years left). Prepay with the refund to accelerate it.
              </template>
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl p-6 border border-gray-100">
            <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">HELOC (deductible)</p>
            <p class="text-2xl font-black text-primary tabular-nums">{{ formatCurrency(result.debt.heloc) }}</p>
            <p class="text-sm text-gray-600 mt-1">Re-borrowed {{ formatCurrency(result.totals.reborrowed) }} in total.</p>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-gray-100">
            <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">Plain mortgage left</p>
            <p class="text-2xl font-black text-primary tabular-nums">{{ formatCurrency(result.debt.plainMortgage) }}</p>
            <p class="text-sm text-gray-600 mt-1">Same start, no HELOC, no investments.</p>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-gray-100">
            <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">Break-even return</p>
            <p class="text-2xl font-black text-primary tabular-nums">{{ result.tax.breakEvenReturnPct.toFixed(2) }}%</p>
            <p class="text-sm text-gray-600 mt-1">After-tax cost of the {{ result.helocRatePct }}% HELOC. Portfolio return needs to beat this, not the sticker rate.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <h2 class="text-2xl font-bold text-primary mb-2">Year by year</h2>
          <p class="text-gray-600 mb-6">Deductible interest, tax refund, and balances. On a phone this table stacks into cards.</p>
          <div class="year-table-wrap rounded-xl border border-gray-100 shadow-lg">
            <table class="year-table w-full text-left border-collapse bg-white">
              <thead class="bg-gray-50 border-b-2 border-gray-100">
                <tr>
                  <th class="py-4 px-4 font-bold text-xs uppercase tracking-widest text-primary">Year</th>
                  <th class="py-4 px-4 font-bold text-xs uppercase tracking-widest text-primary text-right">Deductible interest</th>
                  <th class="py-4 px-4 font-bold text-xs uppercase tracking-widest text-primary text-right">Tax refund</th>
                  <th class="py-4 px-4 font-bold text-xs uppercase tracking-widest text-primary text-right">Re-borrowed</th>
                  <th class="py-4 px-4 font-bold text-xs uppercase tracking-widest text-primary text-right">Portfolio</th>
                  <th class="py-4 px-4 font-bold text-xs uppercase tracking-widest text-primary text-right">HELOC</th>
                  <th class="py-4 px-4 font-bold text-xs uppercase tracking-widest text-primary text-right">Mortgage left</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in result.schedule"
                  :key="row.year"
                  class="border-b border-gray-50 hover:bg-gray-50/30 transition-colors"
                >
                  <td class="py-4 px-4 text-sm font-medium text-gray-800" :data-label="'Year'">{{ row.year }}</td>
                  <td class="py-4 px-4 text-sm text-gray-600 text-right tabular-nums" :data-label="'Deductible interest'">{{ formatCurrency(row.deductibleInterest) }}</td>
                  <td class="py-4 px-4 text-sm text-gray-600 text-right tabular-nums" :data-label="'Tax refund'">{{ formatCurrency(row.taxRefund) }}</td>
                  <td class="py-4 px-4 text-sm text-gray-600 text-right tabular-nums" :data-label="'Re-borrowed'">{{ formatCurrency(row.reborrowed) }}</td>
                  <td class="py-4 px-4 text-sm text-gray-900 text-right tabular-nums font-semibold" :data-label="'Portfolio'">{{ formatCurrency(row.portfolioEnd) }}</td>
                  <td class="py-4 px-4 text-sm text-gray-600 text-right tabular-nums" :data-label="'HELOC'">{{ formatCurrency(row.helocEnd) }}</td>
                  <td class="py-4 px-4 text-sm text-gray-600 text-right tabular-nums" :data-label="'Mortgage left'">{{ formatCurrency(row.mortgageEnd) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="result.warnings.length" class="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p class="text-sm font-semibold text-amber-900 mb-2">Notes</p>
          <ul class="list-disc pl-5 space-y-1 text-sm text-amber-900">
            <li v-for="warning in result.warnings" :key="warning">{{ warning }}</li>
          </ul>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="rounded-2xl border border-gray-100 p-6">
            <h2 class="text-xl font-bold text-primary mb-4">CRA rules this page is built around</h2>
            <ul class="space-y-3 text-sm text-gray-700">
              <li>
                Interest is deductible only when borrowed money is used to earn income from a business or property —
                <a class="font-semibold text-primary hover:underline" href="https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-20.html" target="_blank" rel="noopener noreferrer">ITA s. 20(1)(c)</a>
                and
                <a class="font-semibold text-primary hover:underline" href="https://www.canada.ca/en/revenue-agency/services/tax/technical-information/income-tax/income-tax-folios-index/series-3-property-investments-savings-plans/series-3-property-investments-savings-plan-folio-6-interest/income-tax-folio-s3-f6-c1-interest-deductibility.html" target="_blank" rel="noopener noreferrer">CRA Folio S3-F6-C1</a>.
              </li>
              <li>
                Tracing / direct use matters. Keep the investment HELOC separate and never mix personal spending into it.
              </li>
              <li>
                Investments must have a reasonable expectation of income (dividends or interest). Growth-only holdings with no income potential can fail line 22100.
              </li>
              <li>
                Interest on money borrowed to contribute to a TFSA or RRSP is
                <a class="font-semibold text-primary hover:underline" href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-22100-carrying-charges-interest-expenses.html" target="_blank" rel="noopener noreferrer">not deductible</a>.
                Claim eligible interest on line 22100 (Carrying charges, interest expenses).
              </li>
            </ul>
          </div>

          <div class="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 class="text-xl font-bold text-primary mb-4">Assumptions and disclaimer</h2>
            <ul class="list-disc pl-5 space-y-2 text-sm text-amber-950">
              <li>Estimates only. Not financial, tax, or legal advice. Talk to a qualified professional before you borrow to invest.</li>
              <li>2026 federal + provincial income tax from the same engine as the Canadian tax calculator (all 13 provinces and territories). Refund = tax(income) − tax(income − interest).</li>
              <li>Mortgage: Canadian semi-annual compounding. HELOC: interest-only at the rate you type, held constant. Variable prime is not path-simulated.</li>
              <li>Portfolio sits in a non-registered account. Eligible dividends are taxed each year; leftover growth is taxed as a capital gain if sold at the end.</li>
              <li>Market drops while the HELOC stays. Lender rules for readvanceable mortgages are not modelled. Fees, penalties, and insurance are not included.</li>
            </ul>
            <p class="text-sm font-medium text-amber-900 mt-4">Educational estimates from the numbers you type. Confirm anything that matters with the CRA, your lender, and a qualified professional.</p>
          </div>
        </div>
      </div>
    </section>

    <ToolsToolSeoContent seo-key="smith-manoeuvre-calculator" />
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { getToolSeo } from '~/data/toolSeo'
import { faqPageJsonLd, softwareApplicationJsonLd } from '~/utils/seo'
import { DEFAULT_TAX_YEAR, getCanadaProvincesList } from '~/utils/canadianTax'
import {
  BORROW_MODES,
  REFUND_USES,
  WORKED_EXAMPLE,
  projectSmithManoeuvre
} from '~/utils/smithManoeuvre'

const toolSeo = getToolSeo('smith-manoeuvre-calculator')
const seoConfig = useRuntimeConfig()
const siteUrl = seoConfig.public.siteUrl

usePageSeo({
  title: toolSeo.title,
  description: toolSeo.description,
  jsonLd: [
    softwareApplicationJsonLd({
      siteUrl,
      path: '/tools/smith-manoeuvre-calculator/',
      name: 'Smith Manoeuvre & Investment Loan Interest Deduction Calculator (Canada, 2026)',
      description: toolSeo.description
    }),
    faqPageJsonLd(toolSeo.faqs)
  ]
})

const provinces = getCanadaProvincesList(DEFAULT_TAX_YEAR)
const borrowModeOptions = Object.values(BORROW_MODES)
const refundUseOptions = Object.values(REFUND_USES)

const inputs = reactive({
  province: WORKED_EXAMPLE.province,
  income: WORKED_EXAMPLE.income,
  mortgageBalance: WORKED_EXAMPLE.mortgageBalance,
  mortgageRatePct: WORKED_EXAMPLE.mortgageRatePct,
  amortYears: WORKED_EXAMPLE.amortYears,
  helocLimit: WORKED_EXAMPLE.helocLimit,
  helocRatePct: WORKED_EXAMPLE.helocRatePct,
  borrowMode: WORKED_EXAMPLE.borrowMode,
  annualReborrow: '',
  lumpSum: 100000,
  dividendYieldPct: WORKED_EXAMPLE.dividendYieldPct,
  growthPct: WORKED_EXAMPLE.growthPct,
  years: WORKED_EXAMPLE.years,
  refundUse: WORKED_EXAMPLE.refundUse
})

const result = computed(() => projectSmithManoeuvre({
  province: inputs.province,
  income: inputs.income,
  mortgageBalance: inputs.mortgageBalance,
  mortgageRatePct: inputs.mortgageRatePct,
  amortYears: inputs.amortYears,
  helocLimit: inputs.helocLimit,
  helocRatePct: inputs.helocRatePct,
  borrowMode: inputs.borrowMode,
  annualReborrow: inputs.annualReborrow === '' || inputs.annualReborrow == null
    ? null
    : inputs.annualReborrow,
  lumpSum: inputs.lumpSum,
  dividendYieldPct: inputs.dividendYieldPct,
  growthPct: inputs.growthPct,
  years: inputs.years,
  refundUse: inputs.refundUse
}))

function formatCurrency (n) {
  if (n == null || Number.isNaN(n)) return '—'
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n)
}

function formatSigned (n) {
  if (n == null || Number.isNaN(n)) return '—'
  const abs = formatCurrency(Math.abs(n))
  if (Math.abs(n) < 0.5) return abs
  return n > 0 ? `+${abs}` : `−${abs}`
}
</script>

<style scoped>
@media (max-width: 768px) {
  .year-table-wrap {
    box-shadow: none;
    border: 0;
    overflow: visible;
  }

  .year-table,
  .year-table tbody {
    display: block;
    width: 100%;
  }

  .year-table thead {
    display: none;
  }

  .year-table tbody tr {
    display: block;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    margin-bottom: 1rem;
    padding: 1rem;
    background: #fff;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
  }

  .year-table tbody td {
    display: block;
    width: 100%;
    box-sizing: border-box;
    text-align: left !important;
    padding: 0.5rem 0;
    border: 0;
  }

  .year-table tbody td:first-child {
    font-weight: 700;
    color: #1f3b2e;
    font-size: 1rem;
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #f3f4f6;
  }

  .year-table tbody td[data-label]::before {
    content: attr(data-label) ': ';
    font-weight: 600;
    color: #374151;
  }

  .year-table tbody td:first-child[data-label]::before {
    content: attr(data-label) ' ';
    font-weight: 700;
    color: inherit;
  }
}
</style>
