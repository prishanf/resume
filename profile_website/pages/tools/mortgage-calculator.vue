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
          Mortgage Calculator
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl">
          Calculate payments, amortization, and savings with extra principal. Compare up to three scenarios with different amounts, terms, and rates.
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
          <div
            v-show="activeScenarioIndex === idx"
            class="space-y-6"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Mortgage amount ($)</label>
                <input
                  v-model.number="scenario.amount"
                  type="number"
                  min="1000"
                  step="10000"
                  class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Interest rate (%)</label>
                <input
                  v-model.number="scenario.ratePct"
                  type="number"
                  min="0"
                  step="0.05"
                  class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Amortization (years)</label>
                <input
                  v-model.number="scenario.amortYears"
                  type="number"
                  min="1"
                  max="30"
                  class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Term (years)</label>
                <input
                  v-model.number="scenario.termYears"
                  type="number"
                  min="1"
                  max="30"
                  class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Payment frequency</label>
                <select
                  v-model="scenario.paymentFreq"
                  class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="monthly">Monthly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-100">
              <h3 class="text-sm font-bold text-primary mb-3">Extra principal</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Extra amount ($)</label>
                  <input
                    v-model.number="scenario.extraAmount"
                    type="number"
                    min="0"
                    step="50"
                    class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Extra frequency</label>
                  <select
                    v-model="scenario.extraFreq"
                    class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Annual limit (%)</label>
                  <input
                    v-model.number="scenario.annualLimitPct"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <p class="text-xs text-gray-500 mt-1">Max extra principal per year (of original)</p>
                </div>
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

    <!-- Summary cards (active scenario) -->
    <section class="py-12 bg-gradient-to-br from-inverse/50 via-white to-secondary/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-primary mb-2">At a glance — {{ scenarioLabel(activeScenarioIndex) }}</h2>
        <p class="text-gray-600 mb-6">Key numbers for your current scenario.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarIcon class="w-6 h-6 text-primary" />
              </div>
              <span class="text-xs font-bold text-accent uppercase tracking-widest">Payment</span>
            </div>
            <p class="text-2xl font-black text-primary mb-1 tabular-nums">{{ formatCurrency(activeSummary.payment) }}</p>
            <p class="text-sm text-gray-500">{{ paymentFreqLabel(activeScenario.paymentFreq) }}</p>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <BanknotesIcon class="w-6 h-6 text-accent" />
              </div>
              <span class="text-xs font-bold text-accent uppercase tracking-widest">Total interest</span>
            </div>
            <p class="text-2xl font-black text-primary mb-1 tabular-nums">{{ formatCurrency(activeSummary.totalInterest) }}</p>
            <p class="text-sm text-gray-500">Over life of loan</p>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center">
                <ChartBarIcon class="w-6 h-6 text-primary" />
              </div>
              <span class="text-xs font-bold text-accent uppercase tracking-widest">Interest saved</span>
            </div>
            <p class="text-2xl font-black text-primary mb-1 tabular-nums">{{ formatCurrency(activeSummary.interestSaved) }}</p>
            <p class="text-sm text-gray-500">vs no extra principal</p>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ClockIcon class="w-6 h-6 text-primary" />
              </div>
              <span class="text-xs font-bold text-accent uppercase tracking-widest">Payoff</span>
            </div>
            <p class="text-2xl font-black text-primary mb-1 tabular-nums">{{ activeSummary.yearsToPayoff != null ? activeSummary.yearsToPayoff.toFixed(1) + ' years' : '—' }}</p>
            <p class="text-sm text-gray-500">{{ activeSummary.yearsReduction != null ? activeSummary.yearsReduction.toFixed(1) + ' years sooner' : '' }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Scenario comparison (when 2+ scenarios) — near top for quick comparison -->
    <section v-if="scenarios.length >= 2" class="py-12 border-b border-gray-100 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-primary mb-2">Scenario comparison</h2>
        <p class="text-gray-600 mb-6">Compare key metrics across your scenarios at a glance.</p>
        <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
          <table class="w-full text-left border-collapse bg-white">
            <thead class="bg-primary/10 border-b-2 border-primary/20">
              <tr>
                <th class="py-4 px-6 font-bold text-sm uppercase tracking-wider text-primary">Metric</th>
                <th
                  v-for="(s, idx) in scenarios"
                  :key="idx"
                  class="py-4 px-6 font-bold text-sm uppercase tracking-wider text-primary text-center"
                  :class="{ 'ring-2 ring-primary ring-inset': activeScenarioIndex === idx }"
                >
                  <div>{{ scenarioLabel(idx) }}</div>
                  <div class="text-xs font-normal text-gray-600 mt-1">{{ formatCurrency(s.amount) }} · {{ s.ratePct }}% · {{ s.amortYears }}yr</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td class="py-4 px-6 text-sm font-medium text-gray-800">Payment</td>
                <td v-for="(_, idx) in scenarios" :key="idx" class="py-4 px-6 text-sm text-right font-medium tabular-nums" :class="activeScenarioIndex === idx ? 'bg-primary/5' : 'text-gray-700'">
                  {{ formatCurrency(comparisonRows[idx].payment) }}
                </td>
              </tr>
              <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td class="py-4 px-6 text-sm font-medium text-gray-800">Total interest</td>
                <td v-for="(_, idx) in scenarios" :key="idx" class="py-4 px-6 text-sm text-right tabular-nums" :class="activeScenarioIndex === idx ? 'bg-primary/5 text-gray-800 font-medium' : 'text-gray-600'">
                  {{ formatCurrency(comparisonRows[idx].totalInterest) }}
                </td>
              </tr>
              <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td class="py-4 px-6 text-sm font-medium text-gray-800">Interest saved</td>
                <td v-for="(_, idx) in scenarios" :key="idx" class="py-4 px-6 text-sm text-right tabular-nums text-green-700" :class="activeScenarioIndex === idx ? 'bg-primary/5 font-medium' : ''">
                  {{ formatCurrency(comparisonRows[idx].interestSaved) }}
                </td>
              </tr>
              <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td class="py-4 px-6 text-sm font-medium text-gray-800">Years to payoff</td>
                <td v-for="(_, idx) in scenarios" :key="idx" class="py-4 px-6 text-sm text-right tabular-nums" :class="activeScenarioIndex === idx ? 'bg-primary/5 font-medium' : 'text-gray-600'">
                  {{ comparisonRows[idx].yearsToPayoff != null ? comparisonRows[idx].yearsToPayoff.toFixed(1) : '—' }}
                </td>
              </tr>
              <tr class="bg-gray-100/80">
                <td class="py-4 px-6 text-sm font-bold text-gray-900">Total amount paid</td>
                <td v-for="(_, idx) in scenarios" :key="idx" class="py-4 px-6 text-sm text-right font-bold tabular-nums text-gray-900" :class="activeScenarioIndex === idx ? 'bg-primary/10' : ''">
                  {{ formatCurrency(comparisonRows[idx].totalPaid) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Term summary — near top so users see it early -->
    <section class="py-12 border-b border-gray-100 bg-gray-50/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-primary mb-2">Term summary</h2>
        <p class="text-gray-600 mb-6">Summary per {{ activeScenario.termYears }}-year term for {{ scenarioLabel(activeScenarioIndex) }}. Savings vs no extra principal.</p>
        <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
          <table class="w-full text-left border-collapse bg-white">
            <thead class="bg-primary/10 border-b-2 border-primary/20">
              <tr>
                <th class="py-4 px-6 font-bold text-sm uppercase tracking-wider text-primary">Term</th>
                <th class="py-4 px-6 font-bold text-sm uppercase tracking-wider text-primary text-right">Starting balance</th>
                <th class="py-4 px-6 font-bold text-sm uppercase tracking-wider text-primary text-right">Principal paid</th>
                <th class="py-4 px-6 font-bold text-sm uppercase tracking-wider text-primary text-right">Interest paid</th>
                <th class="py-4 px-6 font-bold text-sm uppercase tracking-wider text-primary text-right">Extra principal</th>
                <th class="py-4 px-6 font-bold text-sm uppercase tracking-wider text-primary text-right">Ending balance</th>
                <th class="py-4 px-6 font-bold text-sm uppercase tracking-wider text-primary text-right">Interest saved (term)</th>
                <th class="py-4 px-6 font-bold text-sm uppercase tracking-wider text-primary text-right">Interest saved (cumulative)</th>
                <th class="py-4 px-6 font-bold text-sm uppercase tracking-wider text-primary text-right">Years saved</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in termSummaryRows"
                :key="row.termIndex"
                class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
              >
                <td class="py-4 px-6 text-sm font-semibold text-gray-800">Term {{ row.termIndex + 1 }}</td>
                <td class="py-4 px-6 text-sm text-right tabular-nums text-gray-700">{{ formatCurrency(row.startBalance) }}</td>
                <td class="py-4 px-6 text-sm text-right tabular-nums text-gray-700">{{ formatCurrency(row.principalPaid) }}</td>
                <td class="py-4 px-6 text-sm text-right tabular-nums text-gray-700">{{ formatCurrency(row.interestPaid) }}</td>
                <td class="py-4 px-6 text-sm text-right tabular-nums text-gray-700">{{ formatCurrency(row.extraPaid) }}</td>
                <td class="py-4 px-6 text-sm text-right tabular-nums font-semibold text-gray-900">{{ formatCurrency(row.endBalance) }}</td>
                <td class="py-4 px-6 text-sm text-right tabular-nums font-medium text-green-700">{{ formatCurrency(row.interestSavedThisTerm) }}</td>
                <td class="py-4 px-6 text-sm text-right tabular-nums font-medium text-green-700">{{ formatCurrency(row.interestSavedCumulative) }}</td>
                <td class="py-4 px-6 text-sm text-right tabular-nums font-medium text-primary">
                  {{ row.yearsSavedOverall != null ? row.yearsSavedOverall.toFixed(1) + ' yr' : '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-xs text-gray-500 mt-3">
          Interest saved (term) = interest you would have paid this term without extra principal minus interest actually paid. Years saved = how much sooner the loan is paid off overall (same for all terms).
        </p>
      </div>
    </section>

    <!-- Return: extra principal vs investing elsewhere -->
    <section class="py-12 border-b border-gray-100 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-primary mb-2">Return on additional principal vs investing</h2>
        <p class="text-gray-600 mb-4">Compare putting extra money into your mortgage versus investing the same amounts in stocks, bonds, or savings.</p>
        <div class="mb-6 flex flex-wrap items-end gap-4">
          <div class="w-48">
            <label class="block text-sm font-medium text-gray-700 mb-2">Alternative investment return (% per year)</label>
            <input
              v-model.number="alternativeReturnPct"
              type="number"
              min="0"
              max="20"
              step="0.5"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <p class="text-xs text-gray-500 mt-1">e.g. 4% savings, 5–7% bonds, 7–10% stocks (avg)</p>
          </div>
        </div>
        <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
          <table class="w-full text-left border-collapse bg-white">
            <thead class="bg-primary/10 border-b-2 border-primary/20">
              <tr>
                <th class="py-4 px-6 font-bold text-sm uppercase tracking-wider text-primary">Metric</th>
                <th class="py-4 px-6 font-bold text-sm uppercase tracking-wider text-primary text-right">Extra to mortgage</th>
                <th class="py-4 px-6 font-bold text-sm uppercase tracking-wider text-primary text-right">Same $ at {{ extraVsInvestComparison.altReturnPct }}% (stocks/bonds/savings)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td class="py-4 px-6 text-sm font-medium text-gray-800">Total amount invested / paid in</td>
                <td class="py-4 px-6 text-sm text-right tabular-nums text-gray-700">{{ formatCurrency(extraVsInvestComparison.totalExtraPaid) }}</td>
                <td class="py-4 px-6 text-sm text-right tabular-nums text-gray-700">{{ formatCurrency(extraVsInvestComparison.totalExtraPaid) }}</td>
              </tr>
              <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td class="py-4 px-6 text-sm font-medium text-gray-800">Result</td>
                <td class="py-4 px-6 text-sm text-right tabular-nums text-gray-700">
                  <span class="block">Interest saved: {{ formatCurrency(extraVsInvestComparison.interestSaved) }}</span>
                  <span class="text-xs text-gray-500">Years saved: {{ extraVsInvestComparison.yearsSaved != null ? extraVsInvestComparison.yearsSaved.toFixed(1) + ' yr' : '—' }}</span>
                </td>
                <td class="py-4 px-6 text-sm text-right tabular-nums text-gray-700">
                  Future value: {{ formatCurrency(extraVsInvestComparison.fvInvested) }}
                </td>
              </tr>
              <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td class="py-4 px-6 text-sm font-medium text-gray-800">Dollar gain (vs amount put in)</td>
                <td class="py-4 px-6 text-sm text-right tabular-nums font-medium text-green-700">{{ formatCurrency(extraVsInvestComparison.interestSaved) }}</td>
                <td class="py-4 px-6 text-sm text-right tabular-nums font-medium text-green-700">{{ formatCurrency(extraVsInvestComparison.investmentGain) }}</td>
              </tr>
              <tr class="bg-gray-100/80">
                <td class="py-4 px-6 text-sm font-bold text-gray-900">Effective return (gain ÷ invested)</td>
                <td class="py-4 px-6 text-sm text-right tabular-nums font-bold text-gray-900">
                  {{ extraVsInvestComparison.totalExtraPaid > 0 ? ((extraVsInvestComparison.interestSaved / extraVsInvestComparison.totalExtraPaid) * 100).toFixed(1) + '%' : '—' }}
                </td>
                <td class="py-4 px-6 text-sm text-right tabular-nums font-bold text-gray-900">
                  {{ extraVsInvestComparison.totalExtraPaid > 0 ? ((extraVsInvestComparison.investmentGain / extraVsInvestComparison.totalExtraPaid) * 100).toFixed(1) + '%' : '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-xs text-gray-500 mt-3">
          Extra to mortgage: you pay the same total extra into the loan and save interest (your “return” is the interest saved). Same $ at {{ extraVsInvestComparison.altReturnPct }}%: the same stream of extra payments is invested at {{ extraVsInvestComparison.altReturnPct }}% per year (compounded with your payment frequency). Compare which gives a higher dollar gain for {{ scenarioLabel(activeScenarioIndex) }}.
        </p>
      </div>
    </section>

    <!-- Charts -->
    <section class="py-12 border-b border-gray-100 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <h2 class="text-2xl font-bold text-primary mb-2">Principal vs interest over time</h2>
          <p class="text-gray-600 mb-4">How each year’s payments split between principal (reduces debt) and interest (cost).</p>
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 h-80">
            <client-only>
              <MortgageStackedChart :chart-data="principalInterestChartData" />
            </client-only>
          </div>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-primary mb-2">Balance over time</h2>
          <p class="text-gray-600 mb-4">Remaining balance: with extra principal (green) vs no extra (accent).</p>
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 h-80">
            <client-only>
              <MortgageBalanceChart :chart-data="balanceChartData" />
            </client-only>
          </div>
        </div>
      </div>
    </section>

    <!-- Payment schedule (amortization) -->
    <section class="py-12 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-primary mb-2">Payment schedule</h2>
        <p class="text-gray-600 mb-4">Full amortization for {{ scenarioLabel(activeScenarioIndex) }}. {{ showFullSchedule ? 'Showing all rows.' : 'First ' + tablePageSize + ' rows.' }}</p>
        <div class="mb-4 flex gap-2">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            @click="showFullSchedule = !showFullSchedule"
          >
            {{ showFullSchedule ? 'Show less' : 'Show full schedule' }}
          </button>
        </div>
        <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
          <table class="w-full text-left border-collapse bg-white">
            <thead class="bg-primary/10 border-b-2 border-primary/20">
              <tr>
                <th class="py-3 px-6 font-bold text-xs uppercase tracking-wider text-primary">#</th>
                <th class="py-3 px-6 font-bold text-xs uppercase tracking-wider text-primary text-right">Payment (P+I)</th>
                <th class="py-3 px-6 font-bold text-xs uppercase tracking-wider text-primary text-right">Principal</th>
                <th class="py-3 px-6 font-bold text-xs uppercase tracking-wider text-primary text-right">Interest</th>
                <th class="py-3 px-6 font-bold text-xs uppercase tracking-wider text-primary text-right">Extra</th>
                <th class="py-3 px-6 font-bold text-xs uppercase tracking-wider text-primary text-right">Ending balance</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in amortizationTableRows"
                :key="row.paymentNum"
                class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
              >
                <td class="py-3 px-6 text-sm text-gray-800 font-medium">{{ row.paymentNum }}</td>
                <td class="py-3 px-6 text-sm text-right tabular-nums text-gray-700">{{ formatCurrency(row.payment) }}</td>
                <td class="py-3 px-6 text-sm text-right tabular-nums text-gray-700">{{ formatCurrency(row.principal) }}</td>
                <td class="py-3 px-6 text-sm text-right tabular-nums text-gray-700">{{ formatCurrency(row.interest) }}</td>
                <td class="py-3 px-6 text-sm text-right tabular-nums text-gray-700">{{ formatCurrency(row.extraPrincipal) }}</td>
                <td class="py-3 px-6 text-sm text-right tabular-nums font-medium text-gray-900">{{ formatCurrency(row.endingBalance) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { h, defineComponent } from 'vue'
import { ArrowLeftIcon, CalendarIcon, BanknotesIcon, ChartBarIcon, ClockIcon } from '@heroicons/vue/24/outline'
import { Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler)

const PAYMENT_FREQ_MAP = { monthly: 12, biweekly: 26, weekly: 52 }

function defaultScenario () {
  return {
    amount: 400000,
    ratePct: 5.5,
    amortYears: 25,
    termYears: 5,
    paymentFreq: 'monthly',
    extraAmount: 200,
    extraFreq: 'monthly',
    annualLimitPct: 15
  }
}

const scenarios = ref([defaultScenario()])
const activeScenarioIndex = ref(0)
const showFullSchedule = ref(false)
const tablePageSize = 60
const alternativeReturnPct = ref(4)

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
  if (activeScenarioIndex.value >= scenarios.value.length) {
    activeScenarioIndex.value = Math.max(0, scenarios.value.length - 1)
  } else if (idx < activeScenarioIndex.value) {
    activeScenarioIndex.value--
  }
}

function paymentFreqLabel (f) {
  return { monthly: 'Per month', biweekly: 'Per 2 weeks', weekly: 'Per week' }[f] || f
}

function getPaymentsPerYear (freq) {
  return PAYMENT_FREQ_MAP[freq] || 12
}

function paymentAmount (principal, annualRatePct, amortYears, paymentsPerYear) {
  if (principal <= 0) return 0
  const n = amortYears * paymentsPerYear
  const r = (annualRatePct / 100) / paymentsPerYear
  if (r === 0) return principal / n
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function buildSchedule (scenario) {
  const amount = Math.max(0, Number(scenario.amount) || 0)
  const ratePct = Math.max(0, Number(scenario.ratePct) || 0)
  const amortYears = Math.max(1, Math.min(30, Number(scenario.amortYears) || 25))
  const payFreq = scenario.paymentFreq || 'monthly'
  const extraAmt = Math.max(0, Number(scenario.extraAmount) || 0)
  const extraFreq = scenario.extraFreq || 'monthly'
  const annualLimitPct = Math.max(0, Math.min(100, Number(scenario.annualLimitPct) ?? 15))

  const payPerYear = getPaymentsPerYear(payFreq)
  const extraPerYear = getPaymentsPerYear(extraFreq)
  const r = (ratePct / 100) / payPerYear
  const payment = paymentAmount(amount, ratePct, amortYears, payPerYear)
  const maxExtraPerYear = amount * (annualLimitPct / 100)

  const schedule = []
  let balance = amount
  let period = 0
  let extraThisYear = 0
  const periodsPerYear = payPerYear

  while (balance > 0.01 && period < amortYears * payPerYear * 2) {
    if (period > 0 && period % periodsPerYear === 0) extraThisYear = 0
    const interest = balance * r
    const principal = Math.min(payment - interest, balance)
    let extra = 0
    if (extraAmt > 0 && balance > principal) {
      const remainingCap = maxExtraPerYear - extraThisYear
      const extraThisPeriod = Math.min(extraAmt, balance - principal, remainingCap)
      extra = Math.max(0, extraThisPeriod)
      extraThisYear += extra
    }
    const totalPrincipal = principal + extra
    balance = Math.max(0, balance - totalPrincipal)
    schedule.push({
      paymentNum: period + 1,
      payment,
      principal,
      interest,
      extraPrincipal: extra,
      endingBalance: balance
    })
    period++
  }

  return { schedule, payment, totalInterest: schedule.reduce((s, row) => s + row.interest, 0) }
}

function buildScheduleNoExtra (scenario) {
  const amount = Math.max(0, Number(scenario.amount) || 0)
  const ratePct = Math.max(0, Number(scenario.ratePct) || 0)
  const amortYears = Math.max(1, Math.min(30, Number(scenario.amortYears) || 25))
  const payFreq = scenario.paymentFreq || 'monthly'
  const payPerYear = getPaymentsPerYear(payFreq)
  const r = (ratePct / 100) / payPerYear
  const payment = paymentAmount(amount, ratePct, amortYears, payPerYear)
  const schedule = []
  let balance = amount
  let period = 0
  while (balance > 0.01 && period < amortYears * payPerYear * 2) {
    const interest = balance * r
    const principal = Math.min(payment - interest, balance)
    balance = Math.max(0, balance - principal)
    schedule.push({ paymentNum: period + 1, interest, endingBalance: balance })
    period++
  }
  const totalInterest = schedule.reduce((s, row) => s + row.interest, 0)
  const yearsToPayoff = period / payPerYear
  return { schedule, payment, totalInterest, yearsToPayoff }
}

const activeScenario = computed(() => scenarios.value[activeScenarioIndex.value] || defaultScenario())

const activeSchedule = computed(() => buildSchedule(activeScenario.value))

const activeScheduleNoExtra = computed(() => buildScheduleNoExtra(activeScenario.value))

const activeSummary = computed(() => {
  const withExtra = activeSchedule.value
  const noExtra = activeScheduleNoExtra.value
  const yearsWithExtra = withExtra.schedule.length / getPaymentsPerYear(activeScenario.value.paymentFreq)
  return {
    payment: withExtra.payment,
    totalInterest: withExtra.totalInterest,
    interestSaved: noExtra.totalInterest - withExtra.totalInterest,
    yearsToPayoff: withExtra.schedule.length > 0 ? yearsWithExtra : null,
    yearsReduction: noExtra.yearsToPayoff != null && withExtra.schedule.length > 0 ? noExtra.yearsToPayoff - yearsWithExtra : null
  }
})

function futureValueOfExtraStream (schedule, annualRatePct, payPerYear) {
  if (schedule.length === 0) return 0
  const r = Math.max(0, annualRatePct) / 100 / payPerYear
  let fv = 0
  const n = schedule.length
  for (let t = 0; t < n; t++) {
    const extra = schedule[t].extraPrincipal || 0
    const periodsToGrow = n - 1 - t
    if (extra > 0 && periodsToGrow >= 0) fv += extra * Math.pow(1 + r, periodsToGrow)
  }
  return fv
}

const extraVsInvestComparison = computed(() => {
  const schedule = activeSchedule.value.schedule
  const payPerYear = getPaymentsPerYear(activeScenario.value.paymentFreq)
  const totalExtraPaid = schedule.reduce((a, r) => a + (r.extraPrincipal || 0), 0)
  const interestSaved = activeSummary.value.interestSaved
  const yearsSaved = activeSummary.value.yearsReduction
  const altPct = Math.max(0, Number(alternativeReturnPct.value) ?? 4)
  const fvInvested = futureValueOfExtraStream(schedule, altPct, payPerYear)
  const investmentGain = fvInvested - totalExtraPaid
  const mortgageRate = activeScenario.value.ratePct || 0
  return {
    totalExtraPaid,
    interestSaved,
    yearsSaved,
    altReturnPct: altPct,
    fvInvested,
    investmentGain,
    mortgageRate
  }
})

const amortizationTableRows = computed(() => {
  const rows = activeSchedule.value.schedule
  if (showFullSchedule.value) return rows
  return rows.slice(0, tablePageSize)
})

const termSummaryRows = computed(() => {
  const s = activeSchedule.value.schedule
  const noExtra = activeScheduleNoExtra.value.schedule
  const termYears = Math.max(1, activeScenario.value.termYears)
  const payPerYear = getPaymentsPerYear(activeScenario.value.paymentFreq)
  const periodsPerTerm = termYears * payPerYear
  const yearsSavedOverall = activeSummary.value.yearsReduction
  const rows = []
  let idx = 0
  let start = 0
  let interestSavedCumulative = 0
  while (start < s.length) {
    const chunk = s.slice(start, start + periodsPerTerm)
    if (chunk.length === 0) break
    const principalPaid = chunk.reduce((a, r) => a + r.principal, 0)
    const interestPaid = chunk.reduce((a, r) => a + r.interest, 0)
    const extraPaid = chunk.reduce((a, r) => a + (r.extraPrincipal || 0), 0)
    const startBalance = start === 0 ? (activeScenario.value.amount || 0) : s[start - 1].endingBalance
    const endBalance = chunk[chunk.length - 1].endingBalance
    const noExtraChunk = noExtra.slice(start, start + periodsPerTerm)
    const interestNoExtraThisTerm = noExtraChunk.reduce((a, r) => a + r.interest, 0)
    const interestSavedThisTerm = interestNoExtraThisTerm - interestPaid
    interestSavedCumulative += interestSavedThisTerm
    rows.push({
      termIndex: idx,
      startBalance,
      principalPaid,
      interestPaid,
      extraPaid,
      endBalance,
      interestSavedThisTerm,
      interestSavedCumulative,
      yearsSavedOverall
    })
    start += periodsPerTerm
    idx++
    if (endBalance <= 0) break
  }
  return rows
})

const principalInterestChartData = computed(() => {
  const s = activeSchedule.value.schedule
  const payPerYear = getPaymentsPerYear(activeScenario.value.paymentFreq)
  const byYear = []
  let y = 0
  while (y * payPerYear < s.length) {
    const start = y * payPerYear
    const end = Math.min((y + 1) * payPerYear, s.length)
    const slice = s.slice(start, end)
    byYear.push({
      year: `Year ${y + 1}`,
      principal: slice.reduce((a, r) => a + r.principal, 0),
      interest: slice.reduce((a, r) => a + r.interest, 0)
    })
    y++
    if (end >= s.length) break
  }
  return {
    labels: byYear.map(d => d.year),
    datasets: [
      { label: 'Principal', data: byYear.map(d => d.principal), backgroundColor: 'rgba(115, 142, 107, 0.8)', stack: 'stack' },
      { label: 'Interest', data: byYear.map(d => d.interest), backgroundColor: 'rgba(232, 193, 109, 0.8)', stack: 'stack' }
    ]
  }
})

const balanceChartData = computed(() => {
  const withExtra = activeSchedule.value.schedule
  const noExtra = activeScheduleNoExtra.value.schedule
  const payPerYear = getPaymentsPerYear(activeScenario.value.paymentFreq)
  const maxLen = Math.max(withExtra.length, noExtra.length)
  const step = Math.max(1, Math.floor(maxLen / 60))
  const labels = []
  const withExtraBal = []
  const noExtraBal = []
  for (let i = 0; i < maxLen; i += step) {
    labels.push(`Payment ${i + 1}`)
    withExtraBal.push(i < withExtra.length ? withExtra[i].endingBalance : null)
    noExtraBal.push(i < noExtra.length ? noExtra[i].endingBalance : null)
  }
  return {
    labels,
    datasets: [
      { label: 'With extra principal', data: withExtraBal, borderColor: '#738E6B', fill: false, tension: 0.1 },
      { label: 'No extra principal', data: noExtraBal, borderColor: '#E8C16D', fill: false, tension: 0.1 }
    ]
  }
})

const comparisonRows = computed(() => {
  return scenarios.value.map(sc => {
    const withExtra = buildSchedule(sc)
    const noExtra = buildScheduleNoExtra(sc)
    const payPerYear = getPaymentsPerYear(sc.paymentFreq)
    const yearsToPayoff = withExtra.schedule.length / payPerYear
    return {
      payment: withExtra.payment,
      totalInterest: withExtra.totalInterest,
      interestSaved: noExtra.totalInterest - withExtra.totalInterest,
      yearsToPayoff: withExtra.schedule.length > 0 ? yearsToPayoff : null,
      totalPaid: withExtra.schedule.reduce((a, r) => a + r.payment + r.extraPrincipal, 0)
    }
  })
})

function formatCurrency (n) {
  if (n == null || Number.isNaN(n)) return '—'
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

const chartOptionsStacked = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { stacked: true },
    y: { stacked: true }
  },
  plugins: {
    legend: { position: 'top' }
  }
}

const chartOptionsLine = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { beginAtZero: true }
  },
  plugins: {
    legend: { position: 'top' }
  }
}

const MortgageStackedChart = defineComponent({
  name: 'MortgageStackedChart',
  components: { Bar },
  props: { chartData: { type: Object, required: true } },
  setup (props) {
    return () => h(Bar, { data: props.chartData, options: chartOptionsStacked })
  }
})

const MortgageBalanceChart = defineComponent({
  name: 'MortgageBalanceChart',
  components: { Line },
  props: { chartData: { type: Object, required: true } },
  setup (props) {
    return () => h(Line, { data: props.chartData, options: chartOptionsLine })
  }
})

useSeoMeta({
  title: 'Mortgage Calculator - Prishan Fernando',
  description: 'Calculate mortgage payments, amortization, and savings with extra principal. Compare up to three scenarios with charts and term summary.'
})
</script>
