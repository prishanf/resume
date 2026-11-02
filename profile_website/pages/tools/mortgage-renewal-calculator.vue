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
          Mortgage Renewal Calculator (Canada, 2026)
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl">
          Compare renewal offers, payment shock, extra payments, and the OSFI stress test for any province or territory. Defaults are a 2021 5-year fixed near 2% coming due in 2026 — swap in your own numbers.
        </p>
        <div class="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2">
          <NuxtLink to="/posts/mortgage-renewal-calculator-canada-2026" class="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            How I use this calculator →
          </NuxtLink>
          <NuxtLink to="/tools/mortgage-calculator" class="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            Mortgage calculator →
          </NuxtLink>
          <NuxtLink to="/tools/heloc-mortgage-calculator" class="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            HELOC vs mortgage →
          </NuxtLink>
          <NuxtLink to="/tools/canadian-tax-calculator" class="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            Canadian tax calculator →
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="py-12 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-xl font-bold text-primary mb-6">Your current mortgage</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <label for="renewal-province" class="block text-sm font-medium text-gray-700 mb-2">Province or territory</label>
            <select
              id="renewal-province"
              v-model="inputs.province"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option v-for="p in provinces" :key="p.code" :value="p.code">{{ p.name }}</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Payment math is federal (same compounding everywhere). Defaults to British Columbia.</p>
          </div>
          <div>
            <label for="renewal-balance" class="block text-sm font-medium text-gray-700 mb-2">Remaining balance ($)</label>
            <input
              id="renewal-balance"
              v-model.number="inputs.remainingBalance"
              type="number"
              min="0"
              step="1000"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
          </div>
          <div>
            <label for="renewal-current-rate" class="block text-sm font-medium text-gray-700 mb-2">Current rate (%)</label>
            <input
              id="renewal-current-rate"
              v-model.number="inputs.currentRatePct"
              type="number"
              min="0"
              max="30"
              step="0.01"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
          </div>
          <div>
            <label for="renewal-amort-years" class="block text-sm font-medium text-gray-700 mb-2">Remaining amortization (years)</label>
            <input
              id="renewal-amort-years"
              v-model.number="inputs.remainingAmortYears"
              type="number"
              min="0"
              max="40"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
          </div>
          <div>
            <label for="renewal-amort-months" class="block text-sm font-medium text-gray-700 mb-2">Extra months (0–11)</label>
            <input
              id="renewal-amort-months"
              v-model.number="inputs.remainingAmortMonths"
              type="number"
              min="0"
              max="11"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
          </div>
          <div>
            <label for="renewal-freq" class="block text-sm font-medium text-gray-700 mb-2">Payment frequency</label>
            <select
              id="renewal-freq"
              v-model="inputs.paymentFreq"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option v-for="freq in frequencyOptions" :key="freq.key" :value="freq.key">{{ freq.label }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <label for="renewal-lump" class="block text-sm font-medium text-gray-700 mb-2">Lump sum at renewal ($)</label>
            <input
              id="renewal-lump"
              v-model.number="inputs.lumpSum"
              type="number"
              min="0"
              step="500"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">Applied first; the new payment is calculated on what is left.</p>
          </div>
          <div>
            <label for="renewal-extra" class="block text-sm font-medium text-gray-700 mb-2">Extra per payment ($)</label>
            <input
              id="renewal-extra"
              v-model.number="inputs.extraPerPeriod"
              type="number"
              min="0"
              step="25"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">Does not change the contractual P&amp;I. Goes to principal.</p>
          </div>
          <div>
            <label for="renewal-situation" class="block text-sm font-medium text-gray-700 mb-2">What are you doing?</label>
            <select
              id="renewal-situation"
              v-model="inputs.situation"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option v-for="s in situationOptions" :key="s.key" :value="s.key">{{ s.label }}</option>
            </select>
          </div>
        </div>

        <h2 class="text-xl font-bold text-primary mb-2">Qualification (optional)</h2>
        <p class="text-sm text-gray-600 mb-6">Used for GDS / TDS at the OSFI minimum qualifying rate. Leave at zero to skip the income check.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label for="renewal-income" class="block text-sm font-medium text-gray-700 mb-2">Gross household income ($ / year)</label>
            <input
              id="renewal-income"
              v-model.number="inputs.grossAnnualIncome"
              type="number"
              min="0"
              step="1000"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
          </div>
          <div>
            <label for="renewal-debts" class="block text-sm font-medium text-gray-700 mb-2">Other monthly debts ($)</label>
            <input
              id="renewal-debts"
              v-model.number="inputs.monthlyDebts"
              type="number"
              min="0"
              step="50"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
          </div>
          <div>
            <label for="renewal-tax" class="block text-sm font-medium text-gray-700 mb-2">Property tax ($ / year)</label>
            <input
              id="renewal-tax"
              v-model.number="inputs.annualPropertyTax"
              type="number"
              min="0"
              step="100"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
          </div>
          <div>
            <label for="renewal-heat" class="block text-sm font-medium text-gray-700 mb-2">Heating ($ / month)</label>
            <input
              id="renewal-heat"
              v-model.number="inputs.monthlyHeating"
              type="number"
              min="0"
              step="10"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
          </div>
          <div>
            <label for="renewal-condo" class="block text-sm font-medium text-gray-700 mb-2">Condo fees ($ / month)</label>
            <input
              id="renewal-condo"
              v-model.number="inputs.monthlyCondoFees"
              type="number"
              min="0"
              step="10"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">GDS/TDS count 50% of this, matching CMHC.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 border-b border-gray-100 bg-gray-50/40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-xl font-bold text-primary mb-2">Renewal offers</h2>
        <p class="text-sm text-gray-600 mb-6">Example rates only — replace them with quotes you actually have. Variable is the rate you type, held constant for the term.</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(offer, index) in inputs.offers"
            :key="offer.id"
            class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <p class="text-xs font-bold text-accent uppercase tracking-widest mb-4">Offer {{ ['A', 'B', 'C'][index] }}</p>
            <div class="space-y-4">
              <div>
                <label :for="`renewal-offer-label-${offer.id}`" class="block text-xs font-bold text-gray-500 uppercase mb-1">Label</label>
                <input
                  :id="`renewal-offer-label-${offer.id}`"
                  v-model="offer.label"
                  type="text"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label :for="`renewal-offer-rate-${offer.id}`" class="block text-xs font-bold text-gray-500 uppercase mb-1">Rate (%)</label>
                  <input
                    :id="`renewal-offer-rate-${offer.id}`"
                    v-model.number="offer.ratePct"
                    type="number"
                    min="0"
                    max="30"
                    step="0.01"
                    class="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary tabular-nums"
                  />
                </div>
                <div>
                  <label :for="`renewal-offer-term-${offer.id}`" class="block text-xs font-bold text-gray-500 uppercase mb-1">Term (years)</label>
                  <select
                    :id="`renewal-offer-term-${offer.id}`"
                    v-model.number="offer.termYears"
                    class="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option :value="1">1</option>
                    <option :value="2">2</option>
                    <option :value="3">3</option>
                    <option :value="4">4</option>
                    <option :value="5">5</option>
                    <option :value="7">7</option>
                    <option :value="10">10</option>
                  </select>
                </div>
              </div>
              <div>
                <label :for="`renewal-offer-type-${offer.id}`" class="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                <select
                  :id="`renewal-offer-type-${offer.id}`"
                  v-model="offer.type"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="fixed">Fixed</option>
                  <option value="variable">Variable</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 bg-gradient-to-br from-inverse/50 via-white to-secondary/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-primary">Payment shock</h2>
          <p class="text-sm text-gray-600 mt-1">
            Current P&amp;I {{ formatCurrency(result.current.payment) }}
            {{ frequencyLabel }}
            on {{ formatCurrency(result.current.startBalance) }}
            remaining, {{ result.current.remainingAmortYears }} years left
            at {{ result.current.ratePct }}%.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            v-for="offer in result.offers"
            :key="offer.id"
            class="bg-white rounded-2xl p-6 border shadow-sm"
            :class="result.lowestPayment?.id === offer.id ? 'border-primary/40 ring-1 ring-primary/20' : 'border-gray-100'"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-bold text-primary">{{ offer.label }}</h3>
              <span class="text-xs font-bold uppercase tracking-widest text-accent">{{ offer.type }} · {{ offer.termYears }} yr</span>
            </div>
            <p class="text-3xl font-black tabular-nums tracking-tight text-primary">{{ formatCurrency(offer.contractualPayment) }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ frequencyLabel }} P&amp;I at {{ offer.ratePct }}%</p>
            <p
              class="mt-4 text-sm font-semibold tabular-nums"
              :class="offer.paymentShock.dollars > 0.5 ? 'text-rose-600' : offer.paymentShock.dollars < -0.5 ? 'text-emerald-700' : 'text-gray-600'"
            >
              {{ formatSigned(offer.paymentShock.dollars) }}
              ({{ formatSignedPct(offer.paymentShock.percentPts) }})
              vs current
            </p>
            <dl class="mt-4 space-y-1 text-sm text-gray-600">
              <div class="flex justify-between gap-4">
                <dt>Interest over term</dt>
                <dd class="font-semibold tabular-nums text-gray-900">{{ formatCurrency(offer.interestOverTerm) }}</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt>Balance at end of term</dt>
                <dd class="font-semibold tabular-nums text-gray-900">{{ formatCurrency(offer.endBalance) }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="overflow-x-auto rounded-xl border border-gray-100 shadow-lg mb-8">
          <table class="w-full text-left border-collapse bg-white">
            <thead class="bg-gray-50 border-b-2 border-gray-100">
              <tr>
                <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Offer</th>
                <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">New payment</th>
                <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">Shock</th>
                <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">Interest over term</th>
                <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">End balance</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="offer in result.offers"
                :key="`row-${offer.id}`"
                class="border-b border-gray-50 hover:bg-gray-50/30 transition-colors"
                :class="result.lowestPayment?.id === offer.id ? 'bg-primary/5' : ''"
              >
                <td class="py-4 px-6 text-sm font-medium text-gray-800">
                  {{ offer.label }}
                  <span class="block text-xs text-gray-500">{{ offer.ratePct }}% · {{ offer.termYears }}-year {{ offer.type }}</span>
                </td>
                <td class="py-4 px-6 text-sm text-gray-900 text-right tabular-nums font-semibold">{{ formatCurrency(offer.contractualPayment) }}</td>
                <td class="py-4 px-6 text-sm text-right tabular-nums" :class="offer.paymentShock.dollars > 0.5 ? 'text-rose-600' : 'text-gray-600'">
                  {{ formatSigned(offer.paymentShock.dollars) }}
                  <span class="block text-xs">{{ formatSignedPct(offer.paymentShock.percentPts) }}</span>
                </td>
                <td class="py-4 px-6 text-sm text-gray-600 text-right tabular-nums">{{ formatCurrency(offer.interestOverTerm) }}</td>
                <td class="py-4 px-6 text-sm text-gray-600 text-right tabular-nums">{{ formatCurrency(offer.endBalance) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="result.warnings.length" class="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-8">
          <ul class="list-disc pl-5 space-y-1 text-sm text-amber-900">
            <li v-for="warning in result.warnings" :key="warning">{{ warning }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="py-12 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-primary mb-2">Keep the payment the same</h2>
        <p class="text-sm text-gray-600 mb-6 max-w-3xl">
          If the new payment stings, some lenders will stretch amortization so you keep paying {{ formatCurrency(result.current.payment) }}.
          That is extra years of interest, and it is not a straight switch — it typically has to be re-qualified.
          FCAC warns this can cost thousands more.
        </p>
        <div class="overflow-x-auto rounded-xl border border-gray-100 shadow-lg">
          <table class="w-full text-left border-collapse bg-white">
            <thead class="bg-gray-50 border-b-2 border-gray-100">
              <tr>
                <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Offer</th>
                <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">Amortization to keep current payment</th>
                <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">Extra years</th>
                <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">Extra interest to pay off</th>
                <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-right">Balance after this term</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="offer in result.offers" :key="`keep-${offer.id}`" class="border-b border-gray-50">
                <td class="py-4 px-6 text-sm font-medium text-gray-800">{{ offer.label }}</td>
                <template v-if="offer.keepPaymentSame.possible">
                  <td class="py-4 px-6 text-sm text-right tabular-nums">{{ offer.keepPaymentSame.extendedAmortYears }} years</td>
                  <td class="py-4 px-6 text-sm text-right tabular-nums">{{ offer.keepPaymentSame.extraYears }}</td>
                  <td class="py-4 px-6 text-sm text-right tabular-nums font-semibold text-rose-700">{{ formatCurrency(offer.keepPaymentSame.extraInterestToPayoff) }}</td>
                  <td class="py-4 px-6 text-sm text-right tabular-nums">{{ formatCurrency(offer.keepPaymentSame.endBalanceAfterTerm) }}</td>
                </template>
                <td v-else colspan="4" class="py-4 px-6 text-sm text-gray-500">{{ offer.keepPaymentSame.reason }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="py-12 border-b border-gray-100 bg-gray-50/40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-primary mb-2">Stress test (GDS / TDS)</h2>
        <p class="text-sm text-gray-700 max-w-3xl mb-6">{{ result.applicabilityNote }}</p>
        <div
          class="rounded-2xl p-5 mb-8 border"
          :class="result.prescribedMqrRequired ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'"
        >
          <p class="text-xs font-bold uppercase tracking-widest mb-1" :class="result.prescribedMqrRequired ? 'text-amber-800' : 'text-accent'">
            {{ result.prescribedMqrRequired ? 'Prescribed MQR is the relevant check' : 'Prescribed MQR is not required for this situation' }}
          </p>
          <p class="text-sm text-gray-700">
            Qualifying rate = greater of 5.25% or contract rate + 2%. Typical limits: GDS 39%, TDS 44%.
            A lender can still apply its own test.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="offer in result.offers" :key="`gds-${offer.id}`" class="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 class="text-lg font-bold text-primary mb-1">{{ offer.label }}</h3>
            <p class="text-xs text-gray-500 mb-4">Qualifying rate {{ offer.stressTest.qualifyingRatePct }}%</p>
            <p class="text-2xl font-black tabular-nums" :class="offer.stressTest.passes ? 'text-emerald-700' : 'text-rose-700'">
              {{ offer.stressTest.passes ? 'Within typical limits' : 'Above typical limits' }}
            </p>
            <dl class="mt-4 space-y-1 text-sm text-gray-600">
              <div class="flex justify-between gap-4">
                <dt>GDS</dt>
                <dd class="font-semibold tabular-nums" :class="offer.stressTest.gdsPass ? 'text-gray-900' : 'text-rose-700'">
                  {{ offer.stressTest.gdsPct }}% <span class="text-xs font-normal text-gray-500">/ 39%</span>
                </dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt>TDS</dt>
                <dd class="font-semibold tabular-nums" :class="offer.stressTest.tdsPass ? 'text-gray-900' : 'text-rose-700'">
                  {{ offer.stressTest.tdsPct }}% <span class="text-xs font-normal text-gray-500">/ 44%</span>
                </dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt>Qualifying monthly P&amp;I</dt>
                <dd class="font-semibold tabular-nums text-gray-900">{{ formatCurrency(offer.stressTest.qualifyingMonthlyPi) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="rounded-2xl border border-gray-100 p-6">
            <h2 class="text-xl font-bold text-primary mb-4">Assumptions</h2>
            <ul class="space-y-3 text-sm text-gray-700">
              <li>Canadian compounding: nominal rate compounded semi-annually, not in advance. Same formula in every province and territory.</li>
              <li>Minimum qualifying rate = greater of contract rate + 2% or 5.25% (
                <a class="font-semibold text-primary hover:underline" href="https://www.osfi-bsif.gc.ca/en/supervision/financial-institutions/banks/minimum-qualifying-rate-uninsured-mortgages" target="_blank" rel="noopener noreferrer">OSFI MQR</a>).
              </li>
              <li>GDS 39% / TDS 44%; GDS housing costs = qualifying P&amp;I + property tax + heating + 50% of condo fees (
                <a class="font-semibold text-primary hover:underline" href="https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/calculating-gds-tds" target="_blank" rel="noopener noreferrer">CMHC GDS/TDS</a>).
              </li>
              <li>Uninsured straight-switch MQR exemption effective 21 November 2024 for federally regulated lenders; insured switches at renewal were exempted under the Canadian Mortgage Charter.</li>
              <li>No lender fees, penalties, insurance premiums, or live rate feed. Variable offers are held at the rate you type.</li>
            </ul>
          </div>
          <div class="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 class="text-xl font-bold text-primary mb-4">Not financial advice</h2>
            <p class="text-sm text-amber-950 leading-relaxed">
              Educational estimates only. This is not financial, tax, or legal advice, and it is not a lender quote or approval.
              Prepayment privileges, compounding conventions on a specific product, and discharge rules vary by lender.
              Confirm anything that matters with your lender and a qualified professional. If you are in hardship, start with
              <a class="font-semibold text-primary hover:underline" href="https://www.canada.ca/en/financial-consumer-agency/services/mortgages/renew-mortgage.html" target="_blank" rel="noopener noreferrer">FCAC’s renewal guidance</a>.
            </p>
          </div>
        </div>
      </div>
    </section>

    <ToolsToolSeoContent seo-key="mortgage-renewal-calculator" />
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { getToolSeo } from '~/data/toolSeo'
import { faqPageJsonLd, softwareApplicationJsonLd } from '~/utils/seo'
import { DEFAULT_TAX_YEAR, getCanadaProvincesList } from '~/utils/canadianTax'
import {
  DEFAULT_RENEWAL_OFFERS,
  PAYMENT_FREQUENCIES,
  RENEWAL_SITUATIONS,
  WORKED_EXAMPLE_AT_RENEWAL,
  compareMortgageRenewal
} from '~/utils/mortgageRenewal'

const toolSeo = getToolSeo('mortgage-renewal-calculator')
const seoConfig = useRuntimeConfig()
const siteUrl = seoConfig.public.siteUrl

usePageSeo({
  title: toolSeo.title,
  description: toolSeo.description,
  jsonLd: [
    softwareApplicationJsonLd({
      siteUrl,
      path: '/tools/mortgage-renewal-calculator/',
      name: 'Mortgage Renewal Calculator (Canada, 2026)',
      description: toolSeo.description
    }),
    faqPageJsonLd(toolSeo.faqs)
  ]
})

const provinces = getCanadaProvincesList(DEFAULT_TAX_YEAR)
const frequencyOptions = Object.values(PAYMENT_FREQUENCIES)
const situationOptions = Object.values(RENEWAL_SITUATIONS)

const inputs = reactive({
  remainingBalance: WORKED_EXAMPLE_AT_RENEWAL.remainingBalance,
  remainingAmortYears: WORKED_EXAMPLE_AT_RENEWAL.remainingAmortYears,
  remainingAmortMonths: WORKED_EXAMPLE_AT_RENEWAL.remainingAmortMonths,
  currentRatePct: WORKED_EXAMPLE_AT_RENEWAL.currentRatePct,
  paymentFreq: WORKED_EXAMPLE_AT_RENEWAL.paymentFreq,
  lumpSum: WORKED_EXAMPLE_AT_RENEWAL.lumpSum,
  extraPerPeriod: WORKED_EXAMPLE_AT_RENEWAL.extraPerPeriod,
  grossAnnualIncome: WORKED_EXAMPLE_AT_RENEWAL.grossAnnualIncome,
  monthlyDebts: WORKED_EXAMPLE_AT_RENEWAL.monthlyDebts,
  annualPropertyTax: WORKED_EXAMPLE_AT_RENEWAL.annualPropertyTax,
  monthlyHeating: WORKED_EXAMPLE_AT_RENEWAL.monthlyHeating,
  monthlyCondoFees: WORKED_EXAMPLE_AT_RENEWAL.monthlyCondoFees,
  province: WORKED_EXAMPLE_AT_RENEWAL.province,
  situation: WORKED_EXAMPLE_AT_RENEWAL.situation,
  offers: DEFAULT_RENEWAL_OFFERS.map((offer) => ({ ...offer }))
})

const result = computed(() => compareMortgageRenewal({
  remainingBalance: inputs.remainingBalance,
  remainingAmortYears: inputs.remainingAmortYears,
  remainingAmortMonths: inputs.remainingAmortMonths,
  currentRatePct: inputs.currentRatePct,
  paymentFreq: inputs.paymentFreq,
  lumpSum: inputs.lumpSum,
  extraPerPeriod: inputs.extraPerPeriod,
  grossAnnualIncome: inputs.grossAnnualIncome,
  monthlyDebts: inputs.monthlyDebts,
  annualPropertyTax: inputs.annualPropertyTax,
  monthlyHeating: inputs.monthlyHeating,
  monthlyCondoFees: inputs.monthlyCondoFees,
  province: inputs.province,
  situation: inputs.situation,
  offers: inputs.offers
}))

const frequencyLabel = computed(() => PAYMENT_FREQUENCIES[result.value.frequency]?.label || 'Monthly')

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

function formatSignedPct (n) {
  if (n == null || Number.isNaN(n)) return '—'
  const abs = `${Math.abs(n).toFixed(1)}%`
  if (Math.abs(n) < 0.05) return abs
  return n > 0 ? `+${abs}` : `−${abs}`
}
</script>
