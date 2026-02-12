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
          Mortgage Strategist
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl">
          Compare scenarios, optimize extra payments, and see the real return on your home equity.
        </p>
      </div>
    </section>

    <!-- Scenarios bar (visible below hero, not under header) -->
    <section class="py-4 border-b border-gray-100 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h2 class="text-xl font-bold text-primary">Scenarios</h2>
          <div class="flex items-center gap-3">
            <button
              v-for="(_, i) in scenarios"
              :key="i"
              type="button"
              @click="activeScenarioIndex = i"
              :class="[
                'px-4 py-2.5 rounded-lg font-medium transition-colors',
                activeScenarioIndex === i
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ ['A', 'B', 'C'][i] }}
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
      </div>
    </section>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <aside class="lg:col-span-4 space-y-6">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div class="p-6 border-b border-gray-50 bg-gray-50/50">
              <h2 class="font-bold text-primary">Configure</h2>
              <p class="text-sm text-gray-500 mt-0.5">Adjust loan and acceleration for Scenario {{ ['A', 'B', 'C'][activeScenarioIndex] }}</p>
            </div>

            <div class="p-6 space-y-5">
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Mortgage Amount</label>
                  <div class="relative">
                    <span class="absolute left-3 top-2.5 text-gray-400">$</span>
                    <input v-model.number="activeScenario.amount" type="number" class="w-full pl-7 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-semibold" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Rate (%)</label>
                    <input v-model.number="activeScenario.ratePct" type="number" step="0.1" class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-semibold" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Amortization (yr)</label>
                    <input v-model.number="activeScenario.amortYears" type="number" class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-semibold" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Term (yr)</label>
                    <select v-model.number="activeScenario.termYears" class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-semibold">
                      <option :value="3">3</option>
                      <option :value="4">4</option>
                      <option :value="5">5</option>
                      <option :value="7">7</option>
                      <option :value="10">10</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Frequency</label>
                  <select v-model="activeScenario.paymentFreq" class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-semibold">
                    <option value="monthly">Monthly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-100">
                <button @click="showTaxes = !showTaxes" class="flex items-center text-xs font-bold text-primary uppercase">
                  {{ showTaxes ? '−' : '+' }} Add Taxes & Insurance (PITI)
                </button>
                <div v-if="showTaxes" class="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Annual Tax</label>
                    <input v-model.number="activeScenario.annualTax" type="number" class="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Annual Ins.</label>
                    <input v-model.number="activeScenario.annualIns" type="number" class="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm" />
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-100 bg-accent/5 -mx-6 px-6 pb-6">
                <h3 class="text-sm font-bold text-accent mb-4 pt-4">Acceleration Strategy</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <label class="text-xs font-semibold text-gray-600">Extra Amount</label>
                    <input v-model.number="activeScenario.extraAmount" type="number" class="w-24 px-2 py-1 bg-white border border-accent/20 rounded text-right font-bold text-accent" />
                  </div>
                  <input type="range" v-model.number="activeScenario.extraAmount" min="0" max="5000" step="50" class="w-full accent-accent" />
                  
                  <div class="flex justify-between items-center text-xs text-gray-500">
                    <span>Freq: {{ activeScenario.extraFreq }}</span>
                    <span>Cap: {{ activeScenario.annualLimitPct }}%</span>
                  </div>
                </div>
              </div>
              
              <button v-if="scenarios.length > 1" @click="removeScenario(activeScenarioIndex)" class="w-full text-xs text-red-400 font-medium hover:text-red-600 transition-colors py-2">Delete This Scenario</button>
            </div>
            </div>
          </div>
        </aside>

        <div class="lg:col-span-8 space-y-8">
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full"></div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Payment</p>
              <h3 class="text-3xl font-black text-primary">{{ formatCurrency(activeSummary.payment + (activeScenario.annualTax + activeScenario.annualIns) / getPaymentsPerYear(activeScenario.paymentFreq)) }}</h3>
              <p class="text-[10px] text-gray-400 mt-1 uppercase">Principal + Interest + PITI</p>
            </div>
            
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Interest Saved</p>
              <h3 class="text-3xl font-black text-green-500">{{ formatCurrency(activeSummary.interestSaved) }}</h3>
              <p class="text-xs text-green-600/70 font-bold mt-1">↑ {{ activeSummary.yearsReduction?.toFixed(1) }} Years Faster</p>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Payoff Date</p>
              <h3 class="text-3xl font-black text-slate-700">{{ payoffDate }}</h3>
              <p class="text-[10px] text-gray-400 mt-1 uppercase">Based on {{ activeSummary.yearsToPayoff?.toFixed(1) }}yr duration</p>
            </div>
          </div>

          <section v-if="scenarios.length > 1" class="bg-primary rounded-2xl overflow-hidden shadow-xl">
            <div class="px-6 py-4 border-b border-white/10 flex justify-between items-center">
              <h3 class="text-white font-bold">Scenario Comparison</h3>
              <span class="text-[10px] bg-accent text-primary px-2 py-0.5 rounded-full font-black uppercase">Live Benchmarking</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm text-white/90">
                <thead class="bg-white/5 text-[10px] uppercase font-black tracking-widest">
                  <tr>
                    <th class="px-6 py-3">Metric</th>
                    <th v-for="(_, i) in scenarios" :key="i" class="px-6 py-3 text-center" :class="{'bg-accent/10': activeScenarioIndex === i}">
                      Scenario {{ ['A', 'B', 'C'][i] }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  <tr>
                    <td class="px-6 py-4 font-medium">Total Interest</td>
                    <td v-for="(row, i) in comparisonRows" :key="i" class="px-6 py-4 text-center tabular-nums" :class="{'text-green-400 font-bold': isCheapest(i, 'totalInterest')}">
                      {{ formatCurrency(row.totalInterest) }}
                    </td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 font-medium">Payoff Time</td>
                    <td v-for="(row, i) in comparisonRows" :key="i" class="px-6 py-4 text-center tabular-nums" :class="{'text-green-400 font-bold': isCheapest(i, 'yearsToPayoff')}">
                      {{ row.yearsToPayoff?.toFixed(1) }}yr
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <h3 class="text-xl font-bold text-primary">Financial Trajectory</h3>
                <p class="text-sm text-gray-500">Balance projection vs interest accumulation.</p>
              </div>
              <div class="flex bg-gray-100 p-1 rounded-lg">
                <button @click="chartMode = 'balance'" :class="['px-4 py-1.5 text-xs font-bold rounded-md transition-all', chartMode === 'balance' ? 'bg-white shadow-sm text-primary' : 'text-gray-400']">Balance</button>
                <button @click="chartMode = 'equity'" :class="['px-4 py-1.5 text-xs font-bold rounded-md transition-all', chartMode === 'equity' ? 'bg-white shadow-sm text-primary' : 'text-gray-400']">Equity</button>
              </div>
            </div>
            <div class="h-80 w-full">
              <client-only>
                <component :is="chartMode === 'balance' ? MortgageBalanceChart : MortgageStackedChart" :chart-data="chartMode === 'balance' ? balanceChartData : principalInterestChartData" :chart-options="chartMode === 'balance' ? chartOptionsLine : chartOptionsStacked" />
              </client-only>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div class="p-6 ">
               <h3 class="text-lg font-bold">Mortgage vs. Market</h3>
               <p class="text-sm text-slate-400">Is your extra {{ formatCurrency(activeScenario.extraAmount) }} better off in the S&P 500?</p>
             </div>
             <div class="p-6">
                <div class="flex items-center gap-4 mb-6">
                  <div class="flex-1">
                    <label class="text-[10px] font-bold text-gray-400 uppercase">Est. Market Return (%)</label>
                    <input v-model.number="alternativeReturnPct" type="range" min="0" max="15" class="w-full accent-primary" />
                  </div>
                  <span class="text-2xl font-black text-primary">{{ alternativeReturnPct }}%</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-2">
                    <div class="flex justify-between text-sm"><span class="text-gray-500">Interest Saved:</span><span class="font-bold text-green-600">{{ formatCurrency(extraVsInvestComparison.interestSaved) }}</span></div>
                    <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div class="bg-primary h-full" :style="{width: (extraVsInvestComparison.interestSaved / Math.max(extraVsInvestComparison.interestSaved, extraVsInvestComparison.investmentGain) * 100) + '%'}"></div></div>
                  </div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-sm"><span class="text-gray-500">Market Gain:</span><span class="font-bold text-blue-600">{{ formatCurrency(extraVsInvestComparison.investmentGain) }}</span></div>
                    <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div class="bg-accent h-full" :style="{width: (extraVsInvestComparison.investmentGain / Math.max(extraVsInvestComparison.interestSaved, extraVsInvestComparison.investmentGain) * 100) + '%'}"></div></div>
                  </div>
                </div>
             </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button @click="showFullSchedule = !showFullSchedule" class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <span class="font-bold text-primary">Amortization Schedule</span>
              <span class="text-xs text-gray-400 font-bold uppercase">{{ showFullSchedule ? 'Hide' : 'View' }} Details</span>
            </button>
            <div v-if="showFullSchedule" class="overflow-x-auto max-h-96">
              <table class="w-full text-left text-xs tabular-nums">
                <thead class="sticky top-0 bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th class="px-6 py-3 font-bold text-gray-500">Pmt #</th>
                    <th class="px-6 py-3 font-bold text-gray-500 text-right">Principal</th>
                    <th class="px-6 py-3 font-bold text-gray-500 text-right">Interest</th>
                    <th class="px-6 py-3 font-bold text-gray-500 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="row in amortizationTableRows" :key="row.paymentNum">
                    <td class="px-6 py-3 font-medium">{{ row.paymentNum }}</td>
                    <td class="px-6 py-3 text-right text-gray-600">{{ formatCurrency(row.principal) }}</td>
                    <td class="px-6 py-3 text-right text-gray-600">{{ formatCurrency(row.interest) }}</td>
                    <td class="px-6 py-3 text-right font-bold text-gray-900">{{ formatCurrency(row.endingBalance) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, defineComponent, h } from 'vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { Bar, Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler)

// Plugin: vertical lines at mortgage term boundaries (e.g. 5, 10, 15, 20, 25 for 5-year term)
const termMarkersPlugin = {
  id: 'termMarkers',
  afterDraw (chart) {
    const opts = chart.options.plugins?.termMarkers
    if (!opts?.termYears || !opts?.amortYears || !chart.scales?.x) return
    const { termYears, amortYears } = opts
    const ctx = chart.ctx
    const xScale = chart.scales.x
    const yScale = chart.scales.y
    const topY = yScale.top
    const bottomY = yScale.bottom
    for (let t = termYears; t < amortYears; t += termYears) {
      const dataIndex = t - 1
      if (dataIndex < 0 || dataIndex >= chart.data.labels?.length) continue
      const x = xScale.getPixelForValue(dataIndex)
      ctx.save()
      ctx.strokeStyle = 'rgba(115, 142, 107, 0.6)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(x, topY)
      ctx.lineTo(x, bottomY)
      ctx.stroke()
      ctx.restore()
    }
  }
}
ChartJS.register(termMarkersPlugin)

const baseChartOptionsLine = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { beginAtZero: true }
  },
  plugins: { legend: { position: 'top' } }
}

const baseChartOptionsStacked = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { stacked: true },
    y: { stacked: true }
  },
  plugins: { legend: { position: 'top' } }
}

const MortgageBalanceChart = defineComponent({
  name: 'MortgageBalanceChart',
  components: { Line },
  props: {
    chartData: { type: Object, required: true },
    chartOptions: { type: Object, default: null }
  },
  setup (props) {
    return () => h(Line, { data: props.chartData, options: props.chartOptions || baseChartOptionsLine })
  }
})

const MortgageStackedChart = defineComponent({
  name: 'MortgageStackedChart',
  components: { Bar },
  props: {
    chartData: { type: Object, required: true },
    chartOptions: { type: Object, default: null }
  },
  setup (props) {
    return () => h(Bar, { data: props.chartData, options: props.chartOptions || baseChartOptionsStacked })
  }
})

// State
const PAYMENT_FREQ_MAP = { monthly: 12, biweekly: 26, weekly: 52 }
const activeScenarioIndex = ref(0)
const showFullSchedule = ref(false)
const showTaxes = ref(false)
const chartMode = ref('balance')
const alternativeReturnPct = ref(7)

const defaultScenario = () => ({
  amount: 450000,
  ratePct: 5.2,
  amortYears: 25,
  termYears: 5,
  paymentFreq: 'monthly',
  extraAmount: 0,
  extraFreq: 'monthly',
  annualLimitPct: 15,
  annualTax: 3000,
  annualIns: 1200
})

const scenarios = ref([defaultScenario()])

// Helpers
const activeScenario = computed(() => scenarios.value[activeScenarioIndex.value])
const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0)
const getPaymentsPerYear = (freq) => PAYMENT_FREQ_MAP[freq] || 12

const payoffDate = computed(() => {
  const years = activeSummary.value.yearsToPayoff || 0
  const date = new Date()
  date.setMonth(date.getMonth() + (years * 12))
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
})

const addScenario = () => {
  if (scenarios.value.length < 3) {
    scenarios.value.push(JSON.parse(JSON.stringify(activeScenario.value)))
    activeScenarioIndex.value = scenarios.value.length - 1
  }
}

const removeScenario = (idx) => {
  scenarios.value.splice(idx, 1)
  activeScenarioIndex.value = 0
}

const isCheapest = (idx, key) => {
  const values = comparisonRows.value.map(r => r[key])
  return comparisonRows.value[idx][key] === Math.min(...values)
}

// Chart options with Amortization label and term markers (computed so they use active scenario)
const chartOptionsLine = computed(() => {
  const s = activeScenario.value
  return {
    ...baseChartOptionsLine,
    scales: {
      ...baseChartOptionsLine.scales,
      x: {
        title: { display: true, text: 'Amortization (years)' }
      }
    },
    plugins: {
      ...baseChartOptionsLine.plugins,
      termMarkers: { termYears: s.termYears, amortYears: s.amortYears }
    }
  }
})

const chartOptionsStacked = computed(() => {
  const s = activeScenario.value
  return {
    ...baseChartOptionsStacked,
    scales: {
      ...baseChartOptionsStacked.scales,
      x: {
        ...baseChartOptionsStacked.scales?.x,
        title: { display: true, text: 'Amortization (years)' }
      }
    },
    plugins: {
      ...baseChartOptionsStacked.plugins,
      termMarkers: { termYears: s.termYears, amortYears: s.amortYears }
    }
  }
})

// Math Engine
function calculateSchedule(scen, useExtra = true) {
  let bal = scen.amount
  const r = (scen.ratePct / 100) / getPaymentsPerYear(scen.paymentFreq)
  const n = scen.amortYears * getPaymentsPerYear(scen.paymentFreq)
  const pmt = bal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  
  const schedule = []
  let totalInt = 0
  let totalExtra = 0
  let period = 0
  const maxExtraYearly = scen.amount * (scen.annualLimitPct / 100)
  let extraThisYear = 0

  while (bal > 0.1 && period < 600) {
    if (period % getPaymentsPerYear(scen.paymentFreq) === 0) extraThisYear = 0
    
    const interest = bal * r
    const principal = Math.min(pmt - interest, bal)
    let extra = 0
    if (useExtra && scen.extraAmount > 0) {
      extra = Math.min(scen.extraAmount, bal - principal, maxExtraYearly - extraThisYear)
    }

    totalInt += interest
    totalExtra += extra
    bal -= (principal + extra)
    
    schedule.push({
      paymentNum: period + 1,
      principal,
      interest,
      extraPrincipal: extra,
      endingBalance: Math.max(0, bal)
    })
    period++
    extraThisYear += extra
  }

  return { schedule, payment: pmt, totalInterest: totalInt, totalExtra, yearsToPayoff: period / getPaymentsPerYear(scen.paymentFreq) }
}

const activeSummary = computed(() => {
  const withExtra = calculateSchedule(activeScenario.value, true)
  const noExtra = calculateSchedule(activeScenario.value, false)
  return {
    ...withExtra,
    interestSaved: Math.max(0, noExtra.totalInterest - withExtra.totalInterest),
    yearsReduction: noExtra.yearsToPayoff - withExtra.yearsToPayoff
  }
})

const comparisonRows = computed(() => scenarios.value.map(s => {
  const res = calculateSchedule(s, true)
  const base = calculateSchedule(s, false)
  return { ...res, interestSaved: base.totalInterest - res.totalInterest }
}))

const amortizationTableRows = computed(() => activeSummary.value.schedule)

const extraVsInvestComparison = computed(() => {
  const s = activeScenario.value
  const totalExtra = activeSummary.value.totalExtra
  const periods = activeSummary.value.schedule.length
  const rate = (alternativeReturnPct.value / 100) / getPaymentsPerYear(s.paymentFreq)
  
  // Future Value of periodic investments
  const fv = s.extraAmount * ((Math.pow(1 + rate, periods) - 1) / rate)
  
  return {
    interestSaved: activeSummary.value.interestSaved,
    investmentGain: fv - totalExtra,
    totalExtraPaid: totalExtra
  }
})

// Chart Data Mappers — use periods per year so biweekly/weekly show correct # of years (not 2x)
const balanceChartData = computed(() => {
  const sch = activeSummary.value.schedule
  const ppy = getPaymentsPerYear(activeScenario.value.paymentFreq)
  const points = sch.filter((_, i) => i % ppy === 0).map(r => ({
    label: `Yr ${Math.floor(r.paymentNum / ppy)}`,
    value: r.endingBalance
  }))
  return {
    labels: points.map(p => p.label),
    datasets: [{
      label: 'Remaining Balance',
      data: points.map(p => p.value),
      borderColor: '#0F172A',
      backgroundColor: 'rgba(15, 23, 42, 0.1)',
      fill: true,
      tension: 0.4
    }]
  }
})

const principalInterestChartData = computed(() => {
  const sch = activeSummary.value.schedule
  const ppy = getPaymentsPerYear(activeScenario.value.paymentFreq)
  const yearly = []
  for (let i = 0; i < sch.length; i += ppy) {
    const slice = sch.slice(i, i + ppy)
    if (slice.length === 0) break
    yearly.push({
      interest: slice.reduce((a, b) => a + b.interest, 0),
      principal: slice.reduce((a, b) => a + (b.principal + b.extraPrincipal), 0)
    })
  }
  return {
    labels: yearly.map((_, i) => `Yr ${i + 1}`),
    datasets: [
      { label: 'Principal', data: yearly.map(y => y.principal), backgroundColor: '#10B981' },
      { label: 'Interest', data: yearly.map(y => y.interest), backgroundColor: '#F43F5E' }
    ]
  }
})
</script>

<style>
.bg-grid-pattern {
  background-image: radial-gradient(circle, #ffffff 1px, transparent 1px);
  background-size: 30px 30px;
}
input[type="range"] {
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #e2e8f0;
  border-radius: 99px;
}
</style>