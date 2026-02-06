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
          HELOC vs Mortgage Calculator
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl">
          Compare converting your HELOC to a fixed mortgage vs making extra principal payments. Uses the same methodology as the
          <NuxtLink to="/posts/heloc-vs-mortgage-conversion-analysis" class="font-semibold text-primary hover:text-accent underline">
            HELOC vs Fixed Mortgage analysis
          </NuxtLink>.
        </p>
      </div>
    </section>

    <!-- Inputs -->
    <section class="py-12 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-xl font-bold text-primary mb-6">Your scenario</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">HELOC balance ($)</label>
            <input
              v-model.number="inputs.balance"
              type="number"
              min="10000"
              step="10000"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">HELOC rate (%)</label>
            <input
              v-model.number="inputs.helocRatePct"
              type="number"
              min="0"
              step="0.05"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fixed rate (%)</label>
            <input
              v-model.number="inputs.fixedRatePct"
              type="number"
              min="0"
              step="0.05"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Amortization (years)</label>
            <input
              v-model.number="inputs.amortYears"
              type="number"
              min="1"
              max="30"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Analysis period (years)</label>
            <input
              v-model.number="inputs.analysisYears"
              type="number"
              min="1"
              max="30"
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>
        
        <!-- Conversion Amount for Comparison -->
        <div class="mt-6 pt-6 border-t border-gray-100">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Conversion amount to compare ($)
                <span class="text-xs text-gray-500 font-normal ml-2">(for comparison table)</span>
              </label>
              <input
                v-model.number="inputs.conversionAmount"
                type="number"
                :min="0"
                :max="inputs.balance"
                step="10000"
                class="w-full sm:w-64 rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <button
              @click="inputs.conversionAmount = bestStrategy.amountConverted"
              class="px-4 py-2.5 text-sm font-semibold text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
            >
              Use best strategy
            </button>
            <button
              @click="inputs.conversionAmount = inputs.balance"
              class="px-4 py-2.5 text-sm font-semibold text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Use full balance
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            This amount will be used in the comparison table below. Leave at 0 to compare against HELOC-only strategy.
          </p>
        </div>
      </div>
    </section>

    <!-- Summary Section -->
    <section class="py-12 bg-gradient-to-br from-inverse/50 via-white to-secondary/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8 flex items-center justify-between flex-wrap gap-4">
          <h2 class="text-2xl font-bold text-primary">Key insights</h2>
          <NuxtLink
            to="/posts/heloc-vs-mortgage-conversion-analysis"
            class="inline-flex items-center text-sm font-semibold text-primary hover:text-accent transition-colors group"
          >
            <span>Read full analysis</span>
            <ArrowRightIcon class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
        </div>
        
        <!-- Warning when HELOC is cheaper -->
        <div v-if="helocIsCheaper" class="mb-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-bold text-yellow-800 mb-2">HELOC rate is lower than fixed rate</h3>
              <p class="text-sm text-yellow-700">
                Your HELOC rate ({{ inputs.helocRatePct }}%) is lower than the fixed rate ({{ inputs.fixedRatePct }}%). 
                Converting to a fixed mortgage would cost you <strong>more</strong> in interest. 
                Consider keeping your balance in the HELOC, especially if you can make extra principal payments.
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Conversion Strategy Card -->
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrophyIcon class="w-6 h-6 text-primary" />
              </div>
              <span class="text-xs font-bold text-accent uppercase tracking-widest">
                {{ inputs.conversionAmount > 0 ? 'Your conversion' : 'Best strategy' }}
              </span>
            </div>
            <h3 class="text-lg font-bold text-primary mb-2">
              {{ selectedConversionStrategy.amountConverted === 0 ? 'Keep in HELOC' : formatCurrency(selectedConversionStrategy.amountConverted) + ' converted' }}
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              {{ selectedConversionStrategy.amountConverted === 0 
                ? 'Stay with HELOC (lower rate)' 
                : `Convert ${Math.round((selectedConversionStrategy.amountConverted / inputs.balance) * 100)}% to fixed mortgage` }}
            </p>
            <div class="pt-4 border-t border-gray-100">
              <div class="text-2xl font-black" :class="selectedConversionStrategy.interestSaved >= 0 ? 'text-primary' : 'text-red-600'">
                {{ selectedConversionStrategy.interestSaved >= 0 ? formatCurrency(selectedConversionStrategy.interestSaved) : formatCurrency(Math.abs(selectedConversionStrategy.interestSaved)) }}
              </div>
              <div class="text-xs text-gray-500 uppercase tracking-widest">
                {{ selectedConversionStrategy.interestSaved >= 0 ? 'Interest saved' : 'Additional cost' }}
              </div>
            </div>
          </div>

          <!-- Monthly Payment Card -->
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <CalendarIcon class="w-6 h-6 text-accent" />
              </div>
              <span class="text-xs font-bold text-accent uppercase tracking-widest">Monthly payment</span>
            </div>
            <h3 class="text-lg font-bold text-primary mb-2">{{ formatCurrency(selectedConversionStrategy.monthlyPayment) }}</h3>
            <p class="text-sm text-gray-600 mb-4">vs {{ formatCurrency(helocOnlyPayment) }} HELOC interest-only</p>
            <div class="pt-4 border-t border-gray-100">
              <div class="text-sm font-semibold" :class="selectedConversionStrategy.monthlyPayment > helocOnlyPayment ? 'text-red-600' : 'text-green-600'">
                {{ selectedConversionStrategy.monthlyPayment > helocOnlyPayment ? '+' : '' }}{{ formatCurrency(Math.abs(selectedConversionStrategy.monthlyPayment - helocOnlyPayment)) }}
              </div>
              <div class="text-xs text-gray-500 uppercase tracking-widest">Difference</div>
            </div>
          </div>

          <!-- Principal Paid Card -->
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center">
                <ChartBarIcon class="w-6 h-6 text-primary" />
              </div>
              <span class="text-xs font-bold text-accent uppercase tracking-widest">Principal paid</span>
            </div>
            <h3 class="text-lg font-bold text-primary mb-2">{{ formatCurrency(selectedConversionStrategy.principalPaid) }}</h3>
            <p class="text-sm text-gray-600 mb-4">Over {{ inputs.analysisYears }} years</p>
            <div class="pt-4 border-t border-gray-100">
              <div class="text-sm font-semibold text-gray-600">
                {{ selectedConversionStrategy.amountConverted > 0 ? Math.round((selectedConversionStrategy.principalPaid / inputs.balance) * 100) : 0 }}% of balance
              </div>
              <div class="text-xs text-gray-500 uppercase tracking-widest">Reduction</div>
            </div>
          </div>
        </div>

        <!-- Comparison Banner -->
        <div class="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/30 rounded-2xl p-6 border border-primary/20">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 class="text-lg font-bold text-primary mb-2">Fixed conversion vs HELOC + extra payments</h3>
              <p v-if="!helocIsCheaper && selectedConversionStrategy.interestSaved > 0 && selectedConversionStrategy.amountConverted > 0" class="text-sm text-gray-600">
                Converting {{ formatCurrency(selectedConversionStrategy.amountConverted) }} saves you 
                <span class="font-bold text-primary">{{ formatCurrency(selectedConversionStrategy.interestSaved) }}</span> in interest 
                compared to keeping everything in HELOC, even with extra payments.
              </p>
              <p v-else-if="helocIsCheaper" class="text-sm text-gray-600">
                Since your HELOC rate ({{ inputs.helocRatePct }}%) is lower than the fixed rate ({{ inputs.fixedRatePct }}%), 
                keeping your balance in the HELOC is the more cost-effective option. Consider making extra principal payments 
                to reduce debt faster while benefiting from the lower rate.
              </p>
              <p v-else class="text-sm text-gray-600">
                Compare the tables below to see how conversion amounts and extra payment strategies affect your total cost and debt reduction.
              </p>
            </div>
            <NuxtLink
              to="/posts/heloc-vs-mortgage-conversion-analysis"
              class="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Read full analysis →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Results -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <!-- Strategy 1: Conversion -->
        <div>
          <h2 class="text-2xl font-bold text-primary mb-2">Strategy 1: Conversion to fixed</h2>
          <p class="text-gray-600 mb-6">Monthly payments at different conversion amounts.</p>
          <div class="overflow-x-auto rounded-xl border border-gray-100 shadow-lg">
            <table class="w-full text-left border-collapse bg-white">
              <thead class="bg-gray-50 border-b-2 border-gray-100">
                <tr>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Amount converted</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">HELOC remaining</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Mortgage P&I</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">HELOC interest</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Total monthly</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in conversionTable"
                  :key="row.amountConverted"
                  class="border-b border-gray-50 hover:bg-gray-50/30 transition-colors"
                >
                  <td class="py-4 px-6 text-sm text-gray-800 font-medium">{{ formatCurrency(row.amountConverted) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600">{{ formatCurrency(row.helocRemaining) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600">{{ formatCurrency(row.mortgagePI) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600">{{ formatCurrency(row.helocInterest) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-800 font-medium">{{ formatCurrency(row.totalMonthly) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 5-year outcomes: Conversion -->
        <div>
          <h2 class="text-2xl font-bold text-primary mb-2">5-year outcomes: Conversion</h2>
          <p class="text-gray-600 mb-6">Principal paid, interest paid, and remaining debt over {{ inputs.analysisYears }} years.</p>
          <div class="overflow-x-auto rounded-xl border border-gray-100 shadow-lg">
            <table class="w-full text-left border-collapse bg-white">
              <thead class="bg-gray-50 border-b-2 border-gray-100">
                <tr>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Amount converted</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Principal paid</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Total interest</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Interest saved vs HELOC</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Remaining debt</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in conversionOutcomesTable"
                  :key="row.amountConverted"
                  class="border-b border-gray-50 hover:bg-gray-50/30 transition-colors"
                >
                  <td class="py-4 px-6 text-sm text-gray-800 font-medium">{{ formatCurrency(row.amountConverted) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600">{{ formatCurrency(row.principalPaid) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600">{{ formatCurrency(row.totalInterest) }}</td>
                  <td class="py-4 px-6 text-sm font-medium" :class="row.interestSaved >= 0 ? 'text-primary' : 'text-red-600'">
                    {{ row.interestSaved >= 0 ? formatCurrency(row.interestSaved) : `-${formatCurrency(Math.abs(row.interestSaved))}` }}
                  </td>
                  <td class="py-4 px-6 text-sm text-gray-600">{{ formatCurrency(row.remainingDebt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Strategy 2: HELOC + extra payments -->
        <div>
          <h2 class="text-2xl font-bold text-primary mb-2">Strategy 2: HELOC + extra payments</h2>
          <p class="text-gray-600 mb-6">Keep balance in HELOC and add a fixed extra principal payment each month.</p>
          <div class="mb-6 flex flex-wrap gap-4 items-end">
            <div class="w-48">
              <label class="block text-sm font-medium text-gray-700 mb-2">Extra payment ($/month)</label>
              <input
                v-model.number="inputs.extraPayment"
                type="number"
                min="0"
                step="100"
                class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>
          <div class="overflow-x-auto rounded-xl border border-gray-100 shadow-lg">
            <table class="w-full text-left border-collapse bg-white">
              <thead class="bg-gray-50 border-b-2 border-gray-100">
                <tr>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Extra payment</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Starting interest</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Avg monthly payment</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Principal paid ({{ inputs.analysisYears }}yr)</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Balance after {{ inputs.analysisYears }} years</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in extraPaymentTable"
                  :key="row.extraPayment"
                  class="border-b border-gray-50 hover:bg-gray-50/30 transition-colors"
                >
                  <td class="py-4 px-6 text-sm text-gray-800 font-medium">{{ formatCurrency(row.extraPayment) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600">{{ formatCurrency(row.startingInterest) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600">{{ formatCurrency(row.avgMonthlyPayment) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600">{{ formatCurrency(row.principalPaid) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600">{{ formatCurrency(row.balanceAfter) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Side-by-Side Comparison -->
        <div class="mt-16">
          <h2 class="text-2xl font-bold text-primary mb-2">Strategy comparison</h2>
          <p class="text-gray-600 mb-6">Compare all three strategies side-by-side with key metrics.</p>
          <div class="overflow-x-auto rounded-xl border border-gray-100 shadow-lg">
            <table class="w-full text-left border-collapse bg-white">
              <thead class="bg-gray-50 border-b-2 border-gray-100">
                <tr>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary">Metric</th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-center">
                    <div>Conversion</div>
                    <div class="text-[10px] font-normal text-gray-500 mt-1">{{ formatCurrency(comparisonTable.conversion.amountConverted) }}</div>
                  </th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-center">
                    <div>HELOC Only</div>
                    <div class="text-[10px] font-normal text-gray-500 mt-1">(No conversion)</div>
                  </th>
                  <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-primary text-center">
                    <div>HELOC + Extra</div>
                    <div class="text-[10px] font-normal text-gray-500 mt-1">{{ formatCurrency(inputs.extraPayment) }}/month</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                  <td class="py-4 px-6 text-sm font-medium text-gray-800">Monthly payment</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-center">{{ formatCurrency(comparisonTable.conversion.monthlyPayment) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-center">{{ formatCurrency(comparisonTable.none.monthlyPayment) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-center">{{ formatCurrency(comparisonTable.extraPayment.monthlyPayment) }}</td>
                </tr>
                <tr class="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                  <td class="py-4 px-6 text-sm font-medium text-gray-800">Total interest paid</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-center">{{ formatCurrency(comparisonTable.conversion.totalInterest) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-center">{{ formatCurrency(comparisonTable.none.totalInterest) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-center">{{ formatCurrency(comparisonTable.extraPayment.totalInterest) }}</td>
                </tr>
                <tr class="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                  <td class="py-4 px-6 text-sm font-medium text-gray-800">Principal paid</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-center">{{ formatCurrency(comparisonTable.conversion.principalPaid) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-center">{{ formatCurrency(comparisonTable.none.principalPaid) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-center">{{ formatCurrency(comparisonTable.extraPayment.principalPaid) }}</td>
                </tr>
                <tr class="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                  <td class="py-4 px-6 text-sm font-medium text-gray-800">Remaining debt</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-center">{{ formatCurrency(comparisonTable.conversion.remainingDebt) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-center">{{ formatCurrency(comparisonTable.none.remainingDebt) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600 text-center">{{ formatCurrency(comparisonTable.extraPayment.remainingDebt) }}</td>
                </tr>
                <tr class="border-b-2 border-gray-200 hover:bg-gray-50/30 transition-colors">
                  <td class="py-4 px-6 text-sm font-bold text-gray-800">Interest vs HELOC only</td>
                  <td class="py-4 px-6 text-sm font-medium text-center" :class="comparisonTable.conversion.interestDiff >= 0 ? 'text-primary' : 'text-red-600'">
                    {{ comparisonTable.conversion.interestDiff >= 0 ? '−' : '+' }}{{ formatCurrency(Math.abs(comparisonTable.conversion.interestDiff)) }}
                    <div class="text-[10px] text-gray-500 font-normal mt-1">{{ comparisonTable.conversion.interestDiff >= 0 ? 'Saved' : 'Costs more' }}</div>
                  </td>
                  <td class="py-4 px-6 text-sm text-gray-400 text-center">—</td>
                  <td class="py-4 px-6 text-sm font-medium text-center" :class="comparisonTable.extraPayment.interestDiff >= 0 ? 'text-primary' : 'text-red-600'">
                    {{ comparisonTable.extraPayment.interestDiff >= 0 ? '−' : '+' }}{{ formatCurrency(Math.abs(comparisonTable.extraPayment.interestDiff)) }}
                    <div class="text-[10px] text-gray-500 font-normal mt-1">{{ comparisonTable.extraPayment.interestDiff >= 0 ? 'Saved' : 'Costs more' }}</div>
                  </td>
                </tr>
                <tr class="bg-gray-50/50">
                  <td class="py-4 px-6 text-sm font-bold text-gray-800">Total amount paid</td>
                  <td class="py-4 px-6 text-sm font-bold text-gray-800 text-center">{{ formatCurrency(comparisonTable.conversion.totalPaid) }}</td>
                  <td class="py-4 px-6 text-sm font-bold text-gray-800 text-center">{{ formatCurrency(comparisonTable.none.totalPaid) }}</td>
                  <td class="py-4 px-6 text-sm font-bold text-gray-800 text-center">{{ formatCurrency(comparisonTable.extraPayment.totalPaid) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Link to Full Analysis -->
        <div class="mt-12 pt-8 border-t border-gray-100">
          <div class="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/10 rounded-xl p-6 border border-primary/10">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 class="text-lg font-bold text-primary mb-2">Want more details?</h3>
                <p class="text-sm text-gray-600">
                  Read the complete analysis with detailed methodology, formulas, risk scenarios, and real-world recommendations.
                </p>
              </div>
              <NuxtLink
                to="/posts/heloc-vs-mortgage-conversion-analysis"
                class="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap group"
              >
                <span>Read full analysis</span>
                <ArrowRightIcon class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ArrowLeftIcon, ArrowRightIcon, TrophyIcon, CalendarIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

useSeoMeta({
  title: 'HELOC vs Mortgage Calculator - Prishan Fernando',
  description: 'Compare converting your HELOC to a fixed mortgage vs extra principal payments. Interactive calculator with payment and 5-year outcome tables.'
})

const inputs = reactive({
  balance: 300000,
  helocRatePct: 4.65,
  fixedRatePct: 3.9,
  amortYears: 25,
  analysisYears: 5,
  extraPayment: 500,
  conversionAmount: 0 // Will be set to bestStrategy by default in comparisonTable
})

function monthlyPayment (principal, annualRate, numMonths) {
  if (principal <= 0) return 0
  const r = annualRate / 100 / 12
  const n = numMonths
  if (r === 0) return principal / n
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function fixedAmortization (principal, annualRate, amortMonths, runMonths) {
  const pay = monthlyPayment(principal, annualRate, amortMonths)
  const r = annualRate / 100 / 12
  let balance = principal
  let totalInterest = 0
  for (let m = 0; m < runMonths && balance > 0; m++) {
    const interest = balance * r
    const principalPaid = Math.min(pay - interest, balance)
    totalInterest += interest
    balance -= principalPaid
  }
  return {
    totalInterest,
    principalPaid: principal - balance,
    remainingBalance: balance
  }
}

function helocExtraScenario (balance, annualRatePct, extraPerMonth, months) {
  let b = balance
  let totalInterest = 0
  let totalPaymentSum = 0
  const r = annualRatePct / 100 / 12
  for (let m = 0; m < months; m++) {
    const interest = b * r
    totalInterest += interest
    const principal = Math.min(extraPerMonth, b)
    const payment = interest + principal
    totalPaymentSum += payment
    b -= principal
  }
  return {
    totalInterest,
    principalPaid: balance - b,
    balanceAfter: b,
    avgMonthlyPayment: totalPaymentSum / months
  }
}

const conversionTable = computed(() => {
  const B = inputs.balance
  const helocR = inputs.helocRatePct / 100 / 12
  const fixedR = inputs.fixedRatePct
  const amortMonths = inputs.amortYears * 12
  const step = Math.max(50000, Math.round(B / 6 / 10000) * 10000)
  const rows = []
  for (let converted = 0; converted <= B; converted += step) {
    if (converted > 0 && converted < B && rows.length > 0 && rows[rows.length - 1].amountConverted === converted) continue
    const helocRemaining = B - converted
    const mortgagePI = converted > 0 ? monthlyPayment(converted, fixedR, amortMonths) : 0
    const helocInterest = helocRemaining * helocR
    rows.push({
      amountConverted: converted,
      helocRemaining,
      mortgagePI,
      helocInterest,
      totalMonthly: mortgagePI + helocInterest
    })
  }
  if (rows.length > 0 && rows[rows.length - 1].amountConverted < B) {
    rows.push({
      amountConverted: B,
      helocRemaining: 0,
      mortgagePI: monthlyPayment(B, fixedR, amortMonths),
      helocInterest: 0,
      totalMonthly: monthlyPayment(B, fixedR, amortMonths)
    })
  }
  return rows
})

const conversionOutcomesTable = computed(() => {
  const B = inputs.balance
  const helocR = inputs.helocRatePct / 100
  const fixedR = inputs.fixedRatePct
  const amortMonths = inputs.amortYears * 12
  const runMonths = inputs.analysisYears * 12
  const helocOnlyInterest = B * helocR * inputs.analysisYears
  const step = Math.max(50000, Math.round(B / 6 / 10000) * 10000)
  const rows = []
  for (let converted = 0; converted <= B; converted += step) {
    if (converted > 0 && converted < B && rows.length > 0 && rows[rows.length - 1].amountConverted === converted) continue
    const helocRemaining = B - converted
    let totalInterest = 0
    let principalPaid = 0
    let remainingDebt = B
    if (converted > 0) {
      const fixed = fixedAmortization(converted, fixedR, amortMonths, runMonths)
      totalInterest += fixed.totalInterest
      principalPaid += fixed.principalPaid
      remainingDebt = fixed.remainingBalance + helocRemaining
      totalInterest += helocRemaining * (inputs.helocRatePct / 100) * inputs.analysisYears
    } else {
      totalInterest = helocOnlyInterest
    }
    const interestSaved = helocOnlyInterest - totalInterest
    rows.push({
      amountConverted: converted,
      principalPaid,
      totalInterest,
      interestSaved, // Allow negative values to show when conversion costs more
      remainingDebt
    })
  }
  if (rows.length > 0 && rows[rows.length - 1].amountConverted < B) {
    const converted = B
    const fixed = fixedAmortization(converted, fixedR, amortMonths, runMonths)
    const totalInterest = fixed.totalInterest
    const interestSaved = helocOnlyInterest - totalInterest
    rows.push({
      amountConverted: converted,
      principalPaid: fixed.principalPaid,
      totalInterest,
      interestSaved, // Allow negative values to show when conversion costs more
      remainingDebt: fixed.remainingBalance
    })
  }
  return rows
})

const extraPaymentTable = computed(() => {
  const B = inputs.balance
  const months = inputs.analysisYears * 12
  const startingInterest = B * (inputs.helocRatePct / 100 / 12)
  const extras = [0, inputs.extraPayment, inputs.extraPayment + 100, inputs.extraPayment + 200].filter((v, i, a) => a.indexOf(v) === i)
  return extras.map(extra => {
    const s = helocExtraScenario(B, inputs.helocRatePct, extra, months)
    return {
      extraPayment: extra,
      startingInterest,
      avgMonthlyPayment: s.avgMonthlyPayment,
      principalPaid: s.principalPaid,
      balanceAfter: s.balanceAfter
    }
  })
})

const helocOnlyPayment = computed(() => {
  return inputs.balance * (inputs.helocRatePct / 100 / 12)
})

const helocIsCheaper = computed(() => {
  return inputs.helocRatePct < inputs.fixedRatePct
})

// Selected conversion strategy (user input or best strategy)
const selectedConversionStrategy = computed(() => {
  const conversionAmountToUse = inputs.conversionAmount > 0 
    ? inputs.conversionAmount 
    : (bestStrategy.value.amountConverted > 0 ? bestStrategy.value.amountConverted : 0)
  
  if (conversionAmountToUse === 0) {
    return {
      amountConverted: 0,
      interestSaved: 0,
      monthlyPayment: helocOnlyPayment.value,
      principalPaid: 0,
      totalInterest: inputs.balance * (inputs.helocRatePct / 100) * inputs.analysisYears,
      remainingDebt: inputs.balance
    }
  }
  
  // Find or calculate the outcome for this conversion amount
  let conversionOutcome = conversionOutcomesTable.value.find(
    r => r.amountConverted === conversionAmountToUse
  )
  
  // If not found, calculate it
  if (!conversionOutcome) {
    const fixedR = inputs.fixedRatePct
    const amortMonths = inputs.amortYears * 12
    const runMonths = inputs.analysisYears * 12
    const helocRemaining = inputs.balance - conversionAmountToUse
    const helocOnlyInterest = inputs.balance * (inputs.helocRatePct / 100) * inputs.analysisYears
    
    let totalInterest = 0
    let principalPaid = 0
    let remainingBalance = helocRemaining
    
    if (conversionAmountToUse > 0) {
      const fixed = fixedAmortization(conversionAmountToUse, fixedR, amortMonths, runMonths)
      totalInterest += fixed.totalInterest
      principalPaid += fixed.principalPaid
      remainingBalance = fixed.remainingBalance + helocRemaining
      totalInterest += helocRemaining * (inputs.helocRatePct / 100) * inputs.analysisYears
    }
    
    const interestSaved = helocOnlyInterest - totalInterest
    
    conversionOutcome = {
      amountConverted: conversionAmountToUse,
      principalPaid,
      totalInterest,
      interestSaved,
      remainingDebt: remainingBalance
    }
  }
  
  // Find monthly payment
  const conversionMonthlyRow = conversionTable.value.find(
    r => r.amountConverted === conversionAmountToUse
  )
  
  let monthlyPaymentAmount = helocOnlyPayment.value
  if (conversionMonthlyRow) {
    monthlyPaymentAmount = conversionMonthlyRow.totalMonthly
  } else if (conversionAmountToUse > 0) {
    const helocR = inputs.helocRatePct / 100 / 12
    const fixedR = inputs.fixedRatePct
    const amortMonths = inputs.amortYears * 12
    const helocRemaining = inputs.balance - conversionAmountToUse
    const mortgagePI = monthlyPayment(conversionAmountToUse, fixedR, amortMonths)
    const helocInterest = helocRemaining * helocR
    monthlyPaymentAmount = mortgagePI + helocInterest
  }
  
  return {
    amountConverted: conversionOutcome.amountConverted,
    interestSaved: conversionOutcome.interestSaved,
    monthlyPayment: monthlyPaymentAmount,
    principalPaid: conversionOutcome.principalPaid,
    totalInterest: conversionOutcome.totalInterest,
    remainingDebt: conversionOutcome.remainingDebt
  }
})

const bestStrategy = computed(() => {
  // If HELOC rate is lower than fixed rate, best strategy is to keep everything in HELOC
  if (helocIsCheaper.value) {
    return {
      amountConverted: 0,
      interestSaved: 0,
      monthlyPayment: helocOnlyPayment.value,
      principalPaid: 0
    }
  }
  
  // Find the conversion strategy with the highest interest saved
  const outcomes = conversionOutcomesTable.value
  if (outcomes.length === 0) {
    return {
      amountConverted: 0,
      interestSaved: 0,
      monthlyPayment: helocOnlyPayment.value,
      principalPaid: 0
    }
  }
  
  // Find the one with max interest saved (but also consider a reasonable conversion amount)
  // Prefer conversions around 80-90% of balance for optimal balance
  const sorted = [...outcomes].sort((a, b) => {
    // First prioritize by interest saved
    if (Math.abs(b.interestSaved - a.interestSaved) > 1000) {
      return b.interestSaved - a.interestSaved
    }
    // Then by conversion amount (prefer higher conversions if similar savings)
    return b.amountConverted - a.amountConverted
  })
  
  const best = sorted[0]
  
  // If best strategy has negative interest saved (costs more), recommend staying with HELOC
  if (best.interestSaved < 0) {
    return {
      amountConverted: 0,
      interestSaved: 0,
      monthlyPayment: helocOnlyPayment.value,
      principalPaid: 0
    }
  }
  
  // Find the corresponding monthly payment
  const conversionRow = conversionTable.value.find(r => r.amountConverted === best.amountConverted)
  const monthlyPayment = conversionRow ? conversionRow.totalMonthly : helocOnlyPayment.value
  
  return {
    amountConverted: best.amountConverted,
    interestSaved: best.interestSaved,
    monthlyPayment,
    principalPaid: best.principalPaid
  }
})

const comparisonTable = computed(() => {
  const B = inputs.balance
  const months = inputs.analysisYears * 12
  const helocOnlyInterest = B * (inputs.helocRatePct / 100) * inputs.analysisYears
  
  // Determine conversion amount to use: user input, or best strategy, or 0
  const conversionAmountToUse = inputs.conversionAmount > 0 
    ? inputs.conversionAmount 
    : (bestStrategy.value.amountConverted > 0 ? bestStrategy.value.amountConverted : 0)
  
  // Strategy 1: Conversion (user-specified or best strategy)
  let conversionOutcome
  let conversionMonthlyRow
  
  if (conversionAmountToUse > 0) {
    // Find exact match or calculate on the fly
    conversionOutcome = conversionOutcomesTable.value.find(
      r => r.amountConverted === conversionAmountToUse
    )
    
    // If not found in table, calculate it
    if (!conversionOutcome) {
      const fixedR = inputs.fixedRatePct
      const amortMonths = inputs.amortYears * 12
      const runMonths = inputs.analysisYears * 12
      const helocRemaining = B - conversionAmountToUse
      
      let totalInterest = 0
      let principalPaid = 0
      let remainingDebt = B
      
      if (conversionAmountToUse > 0) {
        const fixed = fixedAmortization(conversionAmountToUse, fixedR, amortMonths, runMonths)
        totalInterest += fixed.totalInterest
        principalPaid += fixed.principalPaid
        remainingDebt = fixed.remainingBalance + helocRemaining
        totalInterest += helocRemaining * (inputs.helocRatePct / 100) * inputs.analysisYears
      }
      
      conversionOutcome = {
        amountConverted: conversionAmountToUse,
        principalPaid,
        totalInterest,
        remainingDebt
      }
    }
    
    conversionMonthlyRow = conversionTable.value.find(
      r => r.amountConverted === conversionAmountToUse
    )
    
    // If not found, calculate monthly payment
    if (!conversionMonthlyRow && conversionAmountToUse > 0) {
      const helocR = inputs.helocRatePct / 100 / 12
      const fixedR = inputs.fixedRatePct
      const amortMonths = inputs.amortYears * 12
      const helocRemaining = B - conversionAmountToUse
      const mortgagePI = monthlyPayment(conversionAmountToUse, fixedR, amortMonths)
      const helocInterest = helocRemaining * helocR
      
      conversionMonthlyRow = {
        amountConverted: conversionAmountToUse,
        totalMonthly: mortgagePI + helocInterest
      }
    }
  } else {
    // No conversion
    conversionOutcome = {
      amountConverted: 0,
      principalPaid: 0,
      totalInterest: helocOnlyInterest,
      remainingDebt: B
    }
    conversionMonthlyRow = {
      amountConverted: 0,
      totalMonthly: helocOnlyPayment.value
    }
  }
  
  // Strategy 2: HELOC Only (no conversion, interest-only)
  const noneTotalPaid = helocOnlyInterest
  const noneMonthlyPayment = helocOnlyPayment.value
  
  // Strategy 3: HELOC + Extra Payments
  const extraScenario = helocExtraScenario(B, inputs.helocRatePct, inputs.extraPayment, months)
  const extraTotalPaid = extraScenario.totalInterest + extraScenario.principalPaid
  
  return {
    conversion: {
      amountConverted: conversionOutcome.amountConverted,
      monthlyPayment: conversionMonthlyRow ? conversionMonthlyRow.totalMonthly : helocOnlyPayment.value,
      totalInterest: conversionOutcome.totalInterest,
      principalPaid: conversionOutcome.principalPaid,
      remainingDebt: conversionOutcome.remainingDebt,
      interestDiff: helocOnlyInterest - conversionOutcome.totalInterest,
      totalPaid: conversionOutcome.totalInterest + conversionOutcome.principalPaid
    },
    none: {
      monthlyPayment: noneMonthlyPayment,
      totalInterest: helocOnlyInterest,
      principalPaid: 0,
      remainingDebt: B,
      interestDiff: 0,
      totalPaid: noneTotalPaid
    },
    extraPayment: {
      monthlyPayment: extraScenario.avgMonthlyPayment,
      totalInterest: extraScenario.totalInterest,
      principalPaid: extraScenario.principalPaid,
      remainingDebt: extraScenario.balanceAfter,
      interestDiff: helocOnlyInterest - extraScenario.totalInterest,
      totalPaid: extraTotalPaid
    }
  }
})

function formatCurrency (n) {
  if (n == null || Number.isNaN(n)) return '—'
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}
</script>
