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
          Capital Gains Tax Calculator (Canada, 2026)
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl">
          Estimate the 2026 tax on a capital gain for any province or territory, then see what year-end tax-loss harvesting would save. Inclusion rate is still 50%. Tax math reuses the 2026 federal and provincial engine from the
          <NuxtLink to="/tools/canadian-tax-calculator" class="font-semibold text-primary hover:underline">Canadian Tax Calculator</NuxtLink>.
        </p>
        <div class="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2">
          <NuxtLink to="/posts/capital-gains-tax-calculator-canada-2026" class="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            How I use this calculator →
          </NuxtLink>
          <NuxtLink to="/tools/canadian-tax-calculator" class="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            Canadian tax calculator →
          </NuxtLink>
          <NuxtLink to="/tools/rrsp-vs-tfsa-calculator" class="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            RRSP vs TFSA vs FHSA →
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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label for="cgt-province" class="block text-sm font-medium text-gray-700 mb-2">Province or territory</label>
            <select
              id="cgt-province"
              v-model="inputs.province"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option v-for="p in provinces" :key="p.code" :value="p.code">{{ p.name }}</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Residence on 31 December 2026. Defaults to British Columbia.</p>
          </div>
          <div>
            <label for="cgt-income" class="block text-sm font-medium text-gray-700 mb-2">Other taxable income ($)</label>
            <input
              id="cgt-income"
              v-model.number="inputs.income"
              type="number"
              min="0"
              step="1000"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">Modelled as 2026 employment income in the same tax engine.</p>
          </div>
          <div>
            <label for="cgt-cf" class="block text-sm font-medium text-gray-700 mb-2">Net capital losses carried forward ($)</label>
            <input
              id="cgt-cf"
              v-model.number="inputs.netCapitalLossesCF"
              type="number"
              min="0"
              step="100"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">Allowable amount from your notice of assessment (line 25300), already at 50%.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 border-b border-gray-100 bg-gray-50/40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h2 class="text-xl font-bold text-primary">Sold positions</h2>
            <p class="text-sm text-gray-600 mt-1">Proceeds of disposition, adjusted cost base, and outlays (commissions). Gain or loss is proceeds − ACB − outlays.</p>
          </div>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg border border-primary/20 bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
            @click="addPosition"
          >
            Add a position
          </button>
        </div>
        <div class="space-y-6">
          <div
            v-for="(row, index) in inputs.positions"
            :key="row.id"
            class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <div class="flex items-center justify-between mb-4">
              <p class="text-xs font-bold text-accent uppercase tracking-widest">Position {{ index + 1 }}</p>
              <button
                v-if="inputs.positions.length > 1"
                type="button"
                class="text-xs font-semibold text-rose-700 hover:underline"
                @click="removePosition(index)"
              >
                Remove
              </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label :for="`cgt-pos-label-${row.id}`" class="block text-xs font-bold text-gray-500 uppercase mb-1">Label</label>
                <input
                  :id="`cgt-pos-label-${row.id}`"
                  v-model="row.label"
                  type="text"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label :for="`cgt-pos-proceeds-${row.id}`" class="block text-xs font-bold text-gray-500 uppercase mb-1">Proceeds ($)</label>
                <input
                  :id="`cgt-pos-proceeds-${row.id}`"
                  v-model.number="row.proceeds"
                  type="number"
                  min="0"
                  step="100"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
                />
              </div>
              <div>
                <label :for="`cgt-pos-acb-${row.id}`" class="block text-xs font-bold text-gray-500 uppercase mb-1">Adjusted cost base ($)</label>
                <input
                  :id="`cgt-pos-acb-${row.id}`"
                  v-model.number="row.acb"
                  type="number"
                  min="0"
                  step="100"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
                />
              </div>
              <div>
                <label :for="`cgt-pos-outlays-${row.id}`" class="block text-xs font-bold text-gray-500 uppercase mb-1">Outlays / commissions ($)</label>
                <input
                  :id="`cgt-pos-outlays-${row.id}`"
                  v-model.number="row.outlays"
                  type="number"
                  min="0"
                  step="10"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h2 class="text-xl font-bold text-primary">Tax-loss harvesting (optional)</h2>
            <p class="text-sm text-gray-600 mt-1">Unrealized losers you could sell before year-end. Current value stands in for proceeds of disposition.</p>
          </div>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg border border-primary/20 bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
            @click="addHarvest"
          >
            Add a loser
          </button>
        </div>
        <label class="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-5 cursor-pointer hover:border-primary/20 transition-colors mb-6 max-w-3xl">
          <input id="cgt-harvest" v-model="inputs.harvestIncluded" type="checkbox" class="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30" />
          <span>
            <span class="block text-sm font-semibold text-primary">Include these harvest sales in 2026</span>
            <span class="block text-xs text-gray-500 mt-1">Turn this off to see tax on the sold positions alone. Last regular TSX trade that settles in 2026: {{ result.lastTradeLabel }}.</span>
          </span>
        </label>
        <div class="space-y-6">
          <div
            v-for="(row, index) in inputs.harvest"
            :key="row.id"
            class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <div class="flex items-center justify-between mb-4">
              <p class="text-xs font-bold text-accent uppercase tracking-widest">Harvest {{ index + 1 }}</p>
              <button
                v-if="inputs.harvest.length > 1"
                type="button"
                class="text-xs font-semibold text-rose-700 hover:underline"
                @click="removeHarvest(index)"
              >
                Remove
              </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label :for="`cgt-h-label-${row.id}`" class="block text-xs font-bold text-gray-500 uppercase mb-1">Label</label>
                <input
                  :id="`cgt-h-label-${row.id}`"
                  v-model="row.label"
                  type="text"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label :for="`cgt-h-value-${row.id}`" class="block text-xs font-bold text-gray-500 uppercase mb-1">Current value ($)</label>
                <input
                  :id="`cgt-h-value-${row.id}`"
                  v-model.number="row.currentValue"
                  type="number"
                  min="0"
                  step="100"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
                />
              </div>
              <div>
                <label :for="`cgt-h-acb-${row.id}`" class="block text-xs font-bold text-gray-500 uppercase mb-1">Adjusted cost base ($)</label>
                <input
                  :id="`cgt-h-acb-${row.id}`"
                  v-model.number="row.acb"
                  type="number"
                  min="0"
                  step="100"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
                />
              </div>
              <div>
                <label :for="`cgt-h-outlays-${row.id}`" class="block text-xs font-bold text-gray-500 uppercase mb-1">Outlays / commissions ($)</label>
                <input
                  :id="`cgt-h-outlays-${row.id}`"
                  v-model.number="row.outlays"
                  type="number"
                  min="0"
                  step="10"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 bg-gradient-to-br from-inverse/50 via-white to-secondary/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-primary">Result</h2>
          <p class="text-sm text-gray-600 mt-1">
            50% inclusion. Tax is the extra federal + provincial income tax from adding the taxable capital gain on top of {{ formatCurrency(result.income) }} of other income.
          </p>
        </div>

        <div class="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/30 rounded-2xl p-6 border border-primary/20 mb-8">
          <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">{{ result.harvestIncluded ? 'With harvesting' : 'Without harvesting' }}</p>
          <h3 class="text-2xl font-black text-primary mb-2">
            {{ result.harvestIncluded ? formatCurrency(result.taxSavedNow) + ' tax saved now' : formatCurrency(result.withoutHarvest.tax) + ' of tax on this gain' }}
          </h3>
          <p class="text-sm text-gray-700 max-w-3xl">
            <template v-if="result.harvestIncluded">
              Selling the losers this year cuts the taxable capital gain from {{ formatCurrency(result.withoutHarvest.taxableCapitalGain) }} to {{ formatCurrency(result.withHarvest.taxableCapitalGain) }}.
              Watch the 30-day superficial-loss rule, including a spouse and registered accounts.
            </template>
            <template v-else>
              Net capital {{ result.withoutHarvest.capitalGainOrLoss >= 0 ? 'gain' : 'loss' }} {{ formatCurrency(Math.abs(result.withoutHarvest.capitalGainOrLoss)) }}.
              Taxable amount after the 50% inclusion and any loss carry-forward: {{ formatCurrency(result.withoutHarvest.taxableCapitalGain) }}.
            </template>
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">Capital gain / loss</p>
            <p class="text-2xl font-black text-primary tabular-nums">{{ formatSigned(activeSlice.capitalGainOrLoss) }}</p>
            <p class="text-xs text-gray-500 mt-3">Proceeds − ACB − outlays, all positions combined.</p>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">Taxable capital gain</p>
            <p class="text-2xl font-black text-primary tabular-nums">{{ formatCurrency(activeSlice.taxableCapitalGain) }}</p>
            <p class="text-xs text-gray-500 mt-3">50% inclusion, after net capital losses of other years.</p>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">Tax on the gain</p>
            <p class="text-2xl font-black text-primary tabular-nums">{{ formatCurrency(activeSlice.tax) }}</p>
            <p class="text-xs text-gray-500 mt-3">Combined federal + provincial. About {{ formatPct(activeSlice.marginalRateOnIncluded) }} on the included amount.</p>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">After-tax proceeds</p>
            <p class="text-2xl font-black text-primary tabular-nums">{{ formatCurrency(activeSlice.afterTaxProceeds) }}</p>
            <p class="text-xs text-gray-500 mt-3">Net proceeds minus the tax on this year’s taxable capital gain.</p>
          </div>
        </div>

        <div v-if="result.harvestIncluded" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-2xl p-6 border border-gray-100">
            <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">Tax saved now</p>
            <p class="text-2xl font-black text-primary tabular-nums">{{ formatCurrency(result.taxSavedNow) }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ formatCurrency(result.withoutHarvest.tax) }} without harvesting vs {{ formatCurrency(result.withHarvest.tax) }} if you sell the losers this year.</p>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-gray-100">
            <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">Without harvesting</p>
            <p class="text-2xl font-black text-primary tabular-nums">{{ formatCurrency(result.withoutHarvest.afterTaxProceeds) }}</p>
            <p class="text-sm text-gray-600 mt-1">After-tax proceeds of the positions you already sold.</p>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-gray-100">
            <p class="text-xs font-bold text-accent uppercase tracking-widest mb-2">Leftover allowable loss</p>
            <p class="text-2xl font-black text-primary tabular-nums">{{ formatCurrency(result.leftoverAllowableLoss) }}</p>
            <p class="text-sm text-gray-600 mt-1">Carry back up to 3 years (Form T1A) or forward indefinitely, against taxable capital gains only.</p>
          </div>
        </div>

        <div class="rounded-2xl border border-amber-200 bg-amber-50 p-5 mb-8">
          <p class="text-xs font-bold uppercase tracking-widest text-amber-800 mb-1">Year-end 2026 deadline</p>
          <p class="text-sm text-amber-950">
            Canadian stock and ETF trades settle T+1 (since 27 May 2024). The TSX is open Thursday 31 December 2026, but that trade settles Monday 4 January 2027.
            The last regular TSX trade that still settles in 2026 is <strong>{{ result.lastTradeLabel }}</strong>.
            Mutual funds can settle later — confirm with your dealer.
          </p>
        </div>

        <div v-if="result.warnings.length" class="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-8">
          <p class="text-sm font-semibold text-amber-900 mb-2">Rules to watch</p>
          <ul class="list-disc pl-5 space-y-1 text-sm text-amber-900">
            <li v-for="warning in result.warnings" :key="warning">{{ warning }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <h2 class="text-2xl font-bold text-primary mb-2">Sold positions</h2>
          <p class="text-gray-600 mb-6">Each row is one disposition. Identical properties use average ACB — enter that average here; the tool does not rebuild it.</p>
          <div class="overflow-x-auto rounded-xl border border-gray-100 shadow-lg">
            <table class="w-full text-left border-collapse bg-white">
              <thead class="bg-gray-50 border-b-2 border-gray-100">
                <tr>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Position</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">Proceeds</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">ACB</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">Outlays</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">Gain / loss</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in result.positions" :key="row.id" class="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                  <td class="py-4 px-6 text-sm font-medium text-gray-800">{{ row.label }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-right tabular-nums">{{ formatCurrency(row.proceeds) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-right tabular-nums">{{ formatCurrency(row.acb) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-right tabular-nums">{{ formatCurrency(row.outlays) }}</td>
                  <td class="py-4 px-6 text-sm font-bold text-right tabular-nums" :class="row.gainLoss >= 0 ? 'text-gray-900' : 'text-rose-700'">{{ formatSigned(row.gainLoss) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="result.harvest.length">
          <h2 class="text-2xl font-bold text-primary mb-2">Harvest candidates</h2>
          <p class="text-gray-600 mb-6">Current value minus ACB minus selling costs. Only a loss offsets a gain.</p>
          <div class="overflow-x-auto rounded-xl border border-gray-100 shadow-lg">
            <table class="w-full text-left border-collapse bg-white">
              <thead class="bg-gray-50 border-b-2 border-gray-100">
                <tr>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Position</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">Current value</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">ACB</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">Outlays</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">Gain / loss</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in result.harvest" :key="row.id" class="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                  <td class="py-4 px-6 text-sm font-medium text-gray-800">{{ row.label }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-right tabular-nums">{{ formatCurrency(row.currentValue) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-right tabular-nums">{{ formatCurrency(row.acb) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-right tabular-nums">{{ formatCurrency(row.outlays) }}</td>
                  <td class="py-4 px-6 text-sm font-bold text-right tabular-nums" :class="row.gainLoss >= 0 ? 'text-gray-900' : 'text-rose-700'">{{ formatSigned(row.gainLoss) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="rounded-2xl border border-gray-100 p-6">
            <h2 class="text-xl font-bold text-primary mb-4">Assumptions</h2>
            <ul class="space-y-3 text-sm text-gray-700">
              <li>
                <strong>Inclusion rate:</strong> 50% for 2026. The proposed increase to 2/3 was
                <a class="font-semibold text-primary hover:underline" href="https://www.pm.gc.ca/en/news/news-releases/2025/03/21/prime-minister-mark-carney-cancels-proposed-capital-gains-tax-increase" target="_blank" rel="noopener noreferrer">cancelled on 21 March 2025</a>
                and never became law.
                <a class="font-semibold text-primary hover:underline" href="https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-38.html" target="_blank" rel="noopener noreferrer">Income Tax Act s. 38</a>
                still says one-half.
              </li>
              <li>
                <strong>Tax:</strong> federal + provincial income tax from the same 2026 engine as the Canadian tax calculator (all 13 provinces and territories). Formula: tax(other income + taxable capital gain) − tax(other income). Not payroll, OAS, GIS, or AMT.
              </li>
              <li>
                <strong>ACB:</strong> you enter the adjusted cost base. Identical properties (shares of the same class, ETF units) must be averaged —
                <a class="font-semibold text-primary hover:underline" href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains/special-rules-other-transactions.html" target="_blank" rel="noopener noreferrer">CRA identical properties</a>.
              </li>
              <li>
                <strong>Out of scope:</strong>
                <a class="font-semibold text-primary hover:underline" href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains/principal-residence-other-real-estate.html" target="_blank" rel="noopener noreferrer">principal residence exemption</a>
                and the
                <a class="font-semibold text-primary hover:underline" href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains/capital-gains-deduction.html" target="_blank" rel="noopener noreferrer">lifetime capital gains exemption</a>
                on qualified small-business, farm, or fishing property.
              </li>
            </ul>
          </div>
          <div class="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 class="text-xl font-bold text-primary mb-4">Not financial or tax advice</h2>
            <p class="text-sm text-amber-950 leading-relaxed">
              Educational estimates only. This is not financial, tax, or legal advice, and it does not file a return.
              Superficial-loss rules, settlement cut-offs, and ACB tracking depend on your facts.
              Confirm anything that matters with the CRA and a qualified professional. Start with
              <a class="font-semibold text-primary hover:underline" href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains.html" target="_blank" rel="noopener noreferrer">CRA capital gains (line 12700)</a>.
            </p>
          </div>
        </div>
      </div>
    </section>

    <ToolsToolSeoContent seo-key="capital-gains-tax-calculator" />
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { getToolSeo } from '~/data/toolSeo'
import { faqPageJsonLd, softwareApplicationJsonLd } from '~/utils/seo'
import { DEFAULT_TAX_YEAR, getCanadaProvincesList } from '~/utils/canadianTax'
import { WORKED_EXAMPLE_INPUT, compareCapitalGains } from '~/utils/capitalGains'

const toolSeo = getToolSeo('capital-gains-tax-calculator')
const seoConfig = useRuntimeConfig()
const siteUrl = seoConfig.public.siteUrl

usePageSeo({
  title: toolSeo.title,
  description: toolSeo.description,
  jsonLd: [
    softwareApplicationJsonLd({
      siteUrl,
      path: '/tools/capital-gains-tax-calculator/',
      name: 'Capital Gains Tax Calculator (Canada, 2026)',
      description: toolSeo.description
    }),
    faqPageJsonLd(toolSeo.faqs)
  ]
})

const provinces = getCanadaProvincesList(DEFAULT_TAX_YEAR)
const nextRowId = ref(10)

const inputs = reactive({
  province: WORKED_EXAMPLE_INPUT.province,
  income: WORKED_EXAMPLE_INPUT.income,
  netCapitalLossesCF: WORKED_EXAMPLE_INPUT.netCapitalLossesCF,
  harvestIncluded: WORKED_EXAMPLE_INPUT.harvestIncluded,
  positions: WORKED_EXAMPLE_INPUT.positions.map((row) => ({ ...row })),
  harvest: WORKED_EXAMPLE_INPUT.harvest.map((row) => ({ ...row }))
})

const result = computed(() => compareCapitalGains({
  province: inputs.province,
  income: inputs.income,
  netCapitalLossesCF: inputs.netCapitalLossesCF,
  harvestIncluded: inputs.harvestIncluded,
  positions: inputs.positions,
  harvest: inputs.harvest
}))

const activeSlice = computed(() => (
  result.value.harvestIncluded ? result.value.withHarvest : result.value.withoutHarvest
))

function addPosition () {
  nextRowId.value += 1
  inputs.positions.push({
    id: `p${nextRowId.value}`,
    label: `Position ${inputs.positions.length + 1}`,
    proceeds: 0,
    acb: 0,
    outlays: 0
  })
}

function removePosition (index) {
  if (inputs.positions.length > 1) inputs.positions.splice(index, 1)
}

function addHarvest () {
  nextRowId.value += 1
  inputs.harvest.push({
    id: `h${nextRowId.value}`,
    label: `Harvest ${inputs.harvest.length + 1}`,
    currentValue: 0,
    acb: 0,
    outlays: 0
  })
}

function removeHarvest (index) {
  if (inputs.harvest.length > 1) inputs.harvest.splice(index, 1)
}

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

function formatPct (rate) {
  if (rate == null || Number.isNaN(rate)) return '—'
  return `${(rate * 100).toFixed(1)}%`
}
</script>
