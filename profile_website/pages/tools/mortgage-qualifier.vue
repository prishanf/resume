<template>
  <div class="min-h-screen bg-white">

    <!-- Hero -->
    <section class="relative pt-12 pb-12 overflow-hidden bg-inverse/85">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/tools"
          class="inline-flex items-center text-xs font-bold text-accent uppercase tracking-[0.3em] mb-8 hover:text-primary transition-colors group">
          <ArrowLeftIcon class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Tools
        </NuxtLink>
        <h1 class="text-4xl md:text-6xl font-black text-primary mb-4 tracking-tighter">
          Mortgage Qualifier
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl">
          Enter your full financial picture — income sources, debts, assets, and property details — to see exactly where
          you stand before talking to a broker.
        </p>
        <button type="button" @click="loadExampleData"
          class="mt-4 text-sm font-semibold text-accent hover:text-primary underline">
          Load example data
        </button>
      </div>
    </section>

    <!-- Step tabs -->
    <section class="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex overflow-x-auto no-scrollbar">
          <button v-for="(step, i) in steps" :key="step.id" @click="activeStep = step.id" :class="[
            'flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all',
            activeStep === step.id
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-200'
          ]">
            <span :class="[
              'flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black',
              stepComplete(step.id) ? 'bg-green-500 text-white' : activeStep === step.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            ]">{{ stepComplete(step.id) ? '✓' : i + 1 }}</span>
            {{ step.label }}
          </button>
        </div>
      </div>
    </section>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <!-- Input Panel -->
        <div class="lg:col-span-8 space-y-6">

          <!-- ── STEP: INCOME ── -->
          <div v-if="activeStep === 'income'">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-2xl font-black text-primary">Income Sources</h2>
                <p class="text-sm text-gray-500 mt-0.5">Add all income that can be verified. Lenders typically need 2
                  years of history.</p>
              </div>
              <button @click="addIncomeSource"
                class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition-colors">
                <PlusIcon class="w-4 h-4" /> Add Source
              </button>
            </div>

            <div class="space-y-4">
              <div v-for="(src, i) in incomeSources" :key="src.id"
                class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <div class="flex items-center gap-3">
                    <span class="text-lg">{{ incomeTypeEmoji(src.type) }}</span>
                    <select v-model="src.type"
                      class="text-sm font-bold text-primary bg-transparent border-none focus:ring-0 cursor-pointer">
                      <option value="employment">Employment (T4/Salary)</option>
                      <option value="selfEmployed">Self-Employment</option>
                      <option value="rental">Rental Income</option>
                      <option value="dividends">Dividends</option>
                      <option value="investments">Investment / Capital Gains</option>
                      <option value="pension">Pension / CPP / OAS</option>
                      <option value="child">Child / Spousal Support</option>
                      <option value="other">Other Income</option>
                    </select>
                  </div>
                  <button v-if="incomeSources.length > 1" @click="removeIncomeSource(i)"
                    class="text-red-300 hover:text-red-500 transition-colors text-xs font-medium">Remove</button>
                </div>

                <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Description / Employer</label>
                    <input v-model="src.label" type="text" placeholder="e.g. ACME Corp"
                      class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Gross Income</label>
                    <div class="flex gap-2">
                      <div class="relative flex-1">
                        <span class="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                        <input v-model.number="src.gross" type="number"
                          class="w-full pl-7 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-semibold text-sm" />
                      </div>
                      <select v-model="src.frequency"
                        class="px-3 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-semibold text-gray-600">
                        <option value="annual">/ Year</option>
                        <option value="monthly">/ Month</option>
                        <option value="biweekly">/ 2 Weeks</option>
                        <option value="weekly">/ Week</option>
                      </select>
                    </div>
                  </div>

                  <!-- Self-employed extras -->
                  <template v-if="src.type === 'selfEmployed'">
                    <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Years in Business</label>
                      <input v-model.number="src.yearsInBusiness" type="number" min="0"
                        class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Business Type</label>
                      <select v-model="src.bizType"
                        class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm">
                        <option value="sole">Sole Proprietor</option>
                        <option value="corp">Incorporated</option>
                        <option value="partner">Partnership</option>
                      </select>
                    </div>
                  </template>

                  <!-- Rental extras -->
                  <template v-if="src.type === 'rental'">
                    <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Rental Offset Used by
                        Lender</label>
                      <select v-model="src.rentalOffset"
                        class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm">
                        <option :value="0.5">50% of rental income (standard)</option>
                        <option :value="0.8">80% of rental income (some lenders)</option>
                        <option :value="1.0">100% — Net rental positive</option>
                      </select>
                    </div>
                  </template>
                </div>

                <div class="px-5 pb-4 flex justify-between items-center">
                  <span class="text-xs text-gray-400">Monthly equivalent</span>
                  <span class="font-black text-primary">{{ formatCurrency(toMonthly(src)) }}</span>
                </div>
              </div>
            </div>

            <!-- Co-applicant toggle -->
            <div class="mt-6 bg-accent/5 rounded-2xl p-5 border border-accent/10">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-bold text-primary text-sm">Co-Applicant / Spouse Income</h3>
                  <p class="text-xs text-gray-500 mt-0.5">Combining incomes strengthens your application significantly.
                  </p>
                </div>
                <button type="button" @click="showCoApplicant = !showCoApplicant" :class="[
                  'relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none',
                  showCoApplicant ? 'bg-blue-600' : 'bg-gray-300'
                ]">
                  <span
                    class="inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out"
                    :style="{ transform: showCoApplicant ? 'translateX(1.5rem)' : 'translateX(0.25rem)' }"
                  ></span>
                </button>
              </div>
              <div v-if="showCoApplicant" class="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Co-applicant Annual Income</label>
                  <div class="relative">
                    <span class="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                    <input v-model.number="coApplicant.gross" type="number"
                      class="w-full pl-7 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 font-semibold text-sm" />
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Income Type</label>
                  <select v-model="coApplicant.type"
                    class="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm">
                    <option value="employment">Employment (T4)</option>
                    <option value="selfEmployed">Self-Employed</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="flex justify-end mt-4">
              <button @click="activeStep = 'debts'"
                class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
                Next: Debts →
              </button>
            </div>
          </div>

          <!-- ── STEP: DEBTS ── -->
          <div v-if="activeStep === 'debts'">
            <div class="mb-4">
              <h2 class="text-2xl font-black text-primary">Current Debts & Obligations</h2>
              <p class="text-sm text-gray-500 mt-0.5">Include all monthly obligations. Lenders pull your credit report —
                being
                complete here gives you an accurate picture.</p>
            </div>

            <!-- Existing Mortgages — supports Standard, Readvanceable (STEP/FlexLine), and HELOC-only -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
              <div class="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-100">
                <div class="flex items-center gap-2">
                  <span class="text-lg">🏠</span>
                  <h3 class="font-bold text-primary text-base">Existing Mortgage(s)</h3>
                </div>
                <button @click="addExistingMortgage"
                  class="px-4 py-2 text-sm font-bold text-primary border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition-colors">
                  + Add
                </button>
              </div>
              <p class="px-5 py-3 text-xs text-blue-700 bg-blue-50 border-b border-blue-100 leading-relaxed">
                Supports standard fixed/variable mortgages, readvanceable products (Scotia STEP, TD FlexLine, BMO
                Homeowner ReadiLine, etc.), and standalone HELOCs.
              </p>
              <div v-if="debts.existingMortgages.length === 0" class="px-5 py-8 text-sm text-gray-500 italic">No
                existing mortgages — great for a first-time buyer!</div>

              <div v-for="(mtg, i) in debts.existingMortgages" :key="i"
                class="px-5 py-6 border-b border-gray-100 last:border-0 last:pb-6">
                <!-- Mortgage type selector -->
                <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div class="flex flex-wrap gap-2">
                    <button v-for="mtype in mortgageTypes" :key="mtype.value" @click="mtg.mortgageType = mtype.value"
                      :class="['px-4 py-2 text-sm font-bold rounded-xl border-2 transition-all', mtg.mortgageType === mtype.value ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-primary']">
                      {{ mtype.label }}
                    </button>
                  </div>
                  <button @click="removeExistingMortgage(i)"
                    class="text-sm text-red-400 hover:text-red-600 font-medium">Remove</button>
                </div>

                <!-- TYPE: Standard Fixed / Variable -->
                <template v-if="mtg.mortgageType === 'standard'">
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Outstanding Balance</label>
                      <div class="relative">
                        <span class="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                        <input v-model.number="mtg.balance" type="number"
                          class="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Rate (%)</label>
                      <input v-model.number="mtg.rate" type="number" step="0.01"
                        class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 text-sm" />
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Monthly Payment</label>
                      <div class="relative">
                        <span class="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                        <input v-model.number="mtg.payment" type="number"
                          class="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Property Use</label>
                      <select v-model="mtg.propertyType"
                        class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm">
                        <option value="primary">Primary</option>
                        <option value="investment">Investment</option>
                        <option value="recreational">Recreational</option>
                      </select>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 mt-3">Lender uses: <span class="font-bold text-primary">{{
                    formatCurrency(mtg.payment) }}/mo</span> (your stated payment)</p>
                </template>

                <!-- TYPE: Readvanceable (e.g. STEP, FlexLine) — fixed segment + LOC segment -->
                <template v-if="mtg.mortgageType === 'readvanceable'">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Product Name (optional)</label>
                      <input v-model="mtg.label" type="text" placeholder="e.g. Scotia STEP, TD FlexLine"
                        class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Property Use</label>
                      <select v-model="mtg.propertyType"
                        class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm">
                        <option value="primary">Primary</option>
                        <option value="investment">Investment</option>
                        <option value="recreational">Recreational</option>
                      </select>
                    </div>
                  </div>

                  <!-- Fixed segment -->
                  <div class="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
                    <p class="text-xs font-black text-gray-600 uppercase tracking-wide mb-3">🔒 Fixed Mortgage Segment</p>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Balance</label>
                        <div class="relative">
                          <span class="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                          <input v-model.number="mtg.fixedBalance" type="number"
                            class="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Rate (%)</label>
                        <input v-model.number="mtg.fixedRate" type="number" step="0.01"
                          class="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
                      </div>
                      <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Monthly Payment</label>
                        <div class="relative">
                          <span class="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                          <input v-model.number="mtg.fixedPayment" type="number"
                            class="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- LOC segment -->
                  <div class="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                    <p class="text-xs font-black text-amber-800 uppercase tracking-wide mb-3">🔄 Line of Credit Segment (HELOC)</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Credit Limit</label>
                        <div class="relative">
                          <span class="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                          <input v-model.number="mtg.locLimit" type="number"
                            class="w-full pl-8 pr-4 py-2.5 bg-white border border-amber-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Outstanding Balance</label>
                        <div class="relative">
                          <span class="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                          <input v-model.number="mtg.locBalance" type="number"
                            class="w-full pl-8 pr-4 py-2.5 bg-white border border-amber-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Rate (%)</label>
                        <input v-model.number="mtg.locRate" type="number" step="0.01"
                          class="w-full px-4 py-2.5 bg-white border border-amber-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
                      </div>
                      <div class="sm:col-span-2 lg:col-span-1">
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Lender Qualifies As</label>
                        <select v-model="mtg.locQualMethod"
                          class="w-full px-4 py-2.5 bg-white border border-amber-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm">
                          <option value="limitAtStress">Limit × stress rate / 12 (conservative)</option>
                          <option value="balanceAtStress">Balance × stress rate / 12</option>
                          <option value="threePercent">3% of outstanding balance</option>
                          <option value="actualPayment">Actual payment (interest-only)</option>
                        </select>
                      </div>
                    </div>
                    <div class="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <p class="text-xs text-amber-700 leading-relaxed">
                        Most lenders qualify the LOC segment on the <strong>full limit</strong>, even if the balance is $0. This is what raises TDS.
                      </p>
                      <span class="text-sm font-bold text-amber-800 shrink-0">{{ formatCurrency(calcLocMonthlyObligation(mtg)) }}/mo used</span>
                    </div>
                  </div>

                  <div class="mt-4 flex flex-wrap justify-between gap-2 text-xs text-gray-500">
                    <span>Combined monthly obligation (lender view):</span>
                    <span class="font-bold text-primary">{{ formatCurrency((mtg.fixedPayment || 0) + calcLocMonthlyObligation(mtg)) }}/mo</span>
                  </div>
                </template>

                <!-- TYPE: Standalone HELOC -->
                <template v-if="mtg.mortgageType === 'heloc'">
                  <div class="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                    <p class="text-xs font-black text-amber-800 uppercase tracking-wide mb-3">🔄 Standalone HELOC / Home Equity Line of Credit</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Credit Limit</label>
                        <div class="relative">
                          <span class="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                          <input v-model.number="mtg.locLimit" type="number"
                            class="w-full pl-8 pr-4 py-2.5 bg-white border border-amber-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Outstanding Balance</label>
                        <div class="relative">
                          <span class="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                          <input v-model.number="mtg.locBalance" type="number"
                            class="w-full pl-8 pr-4 py-2.5 bg-white border border-amber-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Rate (%)</label>
                        <input v-model.number="mtg.locRate" type="number" step="0.01"
                          class="w-full px-4 py-2.5 bg-white border border-amber-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
                      </div>
                      <div class="sm:col-span-2 lg:col-span-1">
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Lender Qualifies As</label>
                        <select v-model="mtg.locQualMethod"
                          class="w-full px-4 py-2.5 bg-white border border-amber-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm">
                          <option value="limitAtStress">Limit × stress rate / 12 (conservative)</option>
                          <option value="balanceAtStress">Balance × stress rate / 12</option>
                          <option value="threePercent">3% of outstanding balance</option>
                          <option value="actualPayment">Actual payment (interest-only)</option>
                        </select>
                      </div>
                    </div>
                    <div class="mt-4 flex flex-wrap justify-between items-center gap-2">
                      <p class="text-xs text-amber-700">Lender TDS obligation:</p>
                      <span class="text-sm font-bold text-amber-800">{{ formatCurrency(calcLocMonthlyObligation(mtg)) }}/mo</span>
                    </div>
                  </div>
                  <div class="mt-4">
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Property Use</label>
                    <select v-model="mtg.propertyType"
                      class="w-full sm:w-48 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm">
                      <option value="primary">Primary</option>
                      <option value="investment">Investment</option>
                      <option value="recreational">Recreational</option>
                    </select>
                  </div>
                </template>

              </div>
            </div>

            <!-- Standalone Personal LOC -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
              <div class="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                <div class="flex items-center gap-2">
                  <span class="text-base">🔄</span>
                  <h3 class="font-bold text-primary text-sm">Personal Lines of Credit (Unsecured)</h3>
                </div>
                <button @click="addPersonalLOC"
                  class="text-xs font-bold text-primary hover:text-accent transition-colors">+
                  Add</button>
              </div>
              <p class="px-5 pt-3 pb-2 text-[11px] text-amber-600 bg-amber-50 border-b border-amber-100">
                Lenders typically qualify unsecured LOCs using <strong>3% of the credit limit</strong> (not the balance)
                — same
                logic as credit cards.
              </p>
              <div v-if="debts.personalLOCs.length === 0" class="px-5 py-4 text-sm text-gray-400 italic">No personal
                lines of
                credit.</div>
              <div v-for="(loc, i) in debts.personalLOCs" :key="i"
                class="px-5 py-4 border-b border-gray-50 last:border-0">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Description</label>
                    <input v-model="loc.label" type="text" placeholder="e.g. RBC LOC"
                      class="w-full px-3 py-1.5 bg-gray-50 border-none rounded-lg text-sm" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Credit Limit</label>
                    <div class="relative"><span class="absolute left-2.5 top-2 text-gray-400 text-xs">$</span>
                      <input v-model.number="loc.limit" type="number"
                        class="w-full pl-6 pr-2 py-1.5 bg-gray-50 border-none rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Balance</label>
                    <div class="relative"><span class="absolute left-2.5 top-2 text-gray-400 text-xs">$</span>
                      <input v-model.number="loc.balance" type="number"
                        class="w-full pl-6 pr-2 py-1.5 bg-gray-50 border-none rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Lender Uses</label>
                    <p class="text-xs font-bold text-primary py-1.5">{{ formatCurrency(loc.limit * 0.03) }}/mo</p>
                  </div>
                </div>
                <button @click="debts.personalLOCs.splice(i, 1)"
                  class="text-[10px] text-red-300 hover:text-red-500 mt-2 font-medium">Remove</button>
              </div>
            </div>

            <!-- Vehicle Loans -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
              <div class="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                <div class="flex items-center gap-2">
                  <span class="text-base">🚗</span>
                  <h3 class="font-bold text-primary text-sm">Vehicle Loans / Leases</h3>
                </div>
                <button @click="addDebt('vehicles')"
                  class="text-xs font-bold text-primary hover:text-accent transition-colors">+
                  Add</button>
              </div>
              <div v-if="debts.vehicles.length === 0" class="px-5 py-4 text-sm text-gray-400 italic">No vehicle loans.
              </div>
              <div v-for="(d, i) in debts.vehicles" :key="i" class="px-5 py-4 border-b border-gray-50 last:border-0">
                <DebtRow :debt="d" :show-balance="true" @remove="removeDebt('vehicles', i)" />
              </div>
            </div>

            <!-- Credit Cards -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
              <div class="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                <div class="flex items-center gap-2">
                  <span class="text-base">💳</span>
                  <h3 class="font-bold text-primary text-sm">Credit Cards</h3>
                </div>
                <button @click="addCreditCard"
                  class="text-xs font-bold text-primary hover:text-accent transition-colors">+
                  Add</button>
              </div>
              <p class="px-5 pt-3 text-[11px] text-amber-600 bg-amber-50 py-2 border-b border-amber-100">Lenders
                typically use 3%
                of your credit card balance as the monthly obligation, even if you pay in full.</p>
              <div v-if="debts.creditCards.length === 0" class="px-5 py-4 text-sm text-gray-400 italic">No credit cards
                entered.
              </div>
              <div v-for="(cc, i) in debts.creditCards" :key="i"
                class="px-5 py-4 border-b border-gray-50 last:border-0">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Card Name</label>
                    <input v-model="cc.label" type="text" placeholder="Visa / MC..."
                      class="w-full px-3 py-1.5 bg-gray-50 border-none rounded-lg text-sm" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Current Balance</label>
                    <div class="relative">
                      <span class="absolute left-2.5 top-2 text-gray-400 text-xs">$</span>
                      <input v-model.number="cc.balance" type="number"
                        class="w-full pl-6 pr-2 py-1.5 bg-gray-50 border-none rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Credit Limit</label>
                    <div class="relative">
                      <span class="absolute left-2.5 top-2 text-gray-400 text-xs">$</span>
                      <input v-model.number="cc.limit" type="number"
                        class="w-full pl-6 pr-2 py-1.5 bg-gray-50 border-none rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Lender Uses</label>
                    <p class="text-xs font-bold text-primary py-1.5">{{ formatCurrency(cc.balance * 0.03) }}/mo</p>
                  </div>
                </div>
                <button @click="removeDebt('creditCards', i)"
                  class="text-[10px] text-red-300 hover:text-red-500 mt-2 font-medium">Remove</button>
              </div>
            </div>

            <!-- Student Loans & Other Fixed-Payment Debts -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
              <div class="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                <div class="flex items-center gap-2">
                  <span class="text-base">📄</span>
                  <h3 class="font-bold text-primary text-sm">Student Loans & Other Fixed Obligations</h3>
                </div>
                <button @click="addDebt('other')"
                  class="text-xs font-bold text-primary hover:text-accent transition-colors">+
                  Add</button>
              </div>
              <p class="px-5 pt-3 pb-2 text-[11px] text-gray-500 bg-gray-50/50 border-b border-gray-100">Student loans,
                support
                payments, personal loans with fixed payments. Lenders use the actual monthly payment stated here.</p>
              <div v-if="debts.other.length === 0" class="px-5 py-4 text-sm text-gray-400 italic">No other fixed debts.
              </div>
              <div v-for="(d, i) in debts.other" :key="i" class="px-5 py-4 border-b border-gray-50 last:border-0">
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Type / Description</label>
                    <input v-model="d.label" type="text" placeholder="e.g. Student Loan, Support Payment"
                      class="w-full px-3 py-1.5 bg-gray-50 border-none rounded-lg text-sm" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Monthly Payment</label>
                    <div class="relative">
                      <span class="absolute left-2.5 top-2 text-gray-400 text-xs">$</span>
                      <input v-model.number="d.payment" type="number"
                        class="w-full pl-6 pr-2 py-1.5 bg-gray-50 border-none rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Balance (optional)</label>
                    <div class="relative">
                      <span class="absolute left-2.5 top-2 text-gray-400 text-xs">$</span>
                      <input v-model.number="d.balance" type="number"
                        class="w-full pl-6 pr-2 py-1.5 bg-gray-50 border-none rounded-lg text-sm" />
                    </div>
                  </div>
                </div>
                <button @click="removeDebt('other', i)"
                  class="text-[10px] text-red-300 hover:text-red-500 mt-2 font-medium">Remove</button>
              </div>
            </div>

            <div class="flex justify-between mt-4">
              <button @click="activeStep = 'income'"
                class="px-6 py-3 text-primary font-bold rounded-xl border-2 border-gray-100 hover:border-primary transition-colors">←
                Income</button>
              <button @click="activeStep = 'assets'"
                class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">Next:
                Assets
                →</button>
            </div>
          </div>

          <!-- ── STEP: ASSETS ── -->
          <div v-if="activeStep === 'assets'">
            <div class="mb-4">
              <h2 class="text-2xl font-black text-primary">Assets & Savings</h2>
              <p class="text-sm text-gray-500 mt-0.5">Lenders want to see enough for the down payment plus 1.5% closing
                costs.
                Investments add to your financial strength profile.</p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
              <div class="px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                <h3 class="font-bold text-primary text-sm">💰 Liquid & Near-Liquid Assets</h3>
              </div>
              <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="asset in assetFields" :key="asset.key">
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">{{ asset.label }}</label>
                  <div class="relative">
                    <span class="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                    <input v-model.number="assets[asset.key]" type="number"
                      class="w-full pl-7 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-semibold text-sm" />
                  </div>
                </div>
              </div>
              <div class="px-5 pb-4 flex justify-between items-center border-t border-gray-50 pt-3">
                <span class="text-xs text-gray-500 font-semibold uppercase tracking-wide">Total Verifiable Assets</span>
                <span class="font-black text-primary text-lg">{{ formatCurrency(totalAssets) }}</span>
              </div>
            </div>

            <!-- Gift / RRSP HBP -->
            <div class="bg-accent/5 rounded-2xl p-5 border border-accent/10 mb-4">
              <h3 class="font-bold text-primary text-sm mb-3">🎁 RRSP Home Buyer's Plan & Gifted Down Payment</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">RRSP HBP Withdrawal (max
                    $35k/person)</label>
                  <div class="relative">
                    <span class="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                    <input v-model.number="assets.rrspHBP" type="number"
                      class="w-full pl-7 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 font-semibold text-sm" />
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Gifted Down Payment
                    (documented)</label>
                  <div class="relative">
                    <span class="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                    <input v-model.number="assets.giftAmount" type="number"
                      class="w-full pl-7 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 font-semibold text-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-between mt-4">
              <button @click="activeStep = 'debts'"
                class="px-6 py-3 text-primary font-bold rounded-xl border-2 border-gray-100 hover:border-primary transition-colors">←
                Debts</button>
              <button @click="activeStep = 'property'"
                class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">Next:
                Property
                →</button>
            </div>
          </div>

          <!-- ── STEP: PROPERTY ── -->
          <div v-if="activeStep === 'property'">
            <div class="mb-4">
              <h2 class="text-2xl font-black text-primary">Target Property</h2>
              <p class="text-sm text-gray-500 mt-0.5">Details about the home you want to buy. The stress test rate is
                automatically applied for qualification.</p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
              <div class="px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                <h3 class="font-bold text-primary text-sm">🏡 Purchase Details</h3>
              </div>
              <div class="p-5 space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Purchase Price</label>
                    <div class="relative">
                      <span class="absolute left-3 top-2.5 text-gray-400">$</span>
                      <input v-model.number="property.purchasePrice" type="number"
                        class="w-full pl-7 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-semibold" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Down Payment</label>
                    <div class="flex gap-2">
                      <div class="relative flex-1">
                        <span class="absolute left-3 top-2.5 text-gray-400">$</span>
                        <input :value="downPaymentDollars" @input="setDownPaymentFromDollars($event.target.value)"
                          type="number"
                          class="w-full pl-7 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-semibold" />
                      </div>
                      <div class="relative w-24">
                        <input v-model.number="property.downPaymentPct" type="number" step="0.5" min="5" max="100"
                          class="w-full px-3 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-semibold text-center" />
                        <span class="absolute right-3 top-2.5 text-gray-400">%</span>
                      </div>
                    </div>
                    <div class="mt-1">
                      <input type="range" v-model.number="property.downPaymentPct" min="5" max="35" step="0.5"
                        class="w-full accent-primary" />
                      <div class="flex justify-between text-[10px] text-gray-400 -mt-1">
                        <span>5% (min)</span>
                        <span class="text-green-600 font-bold"
                          :class="{ 'font-black': property.downPaymentPct >= 20 }">20% (avoid
                          CMHC)</span>
                        <span>35%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Requested Rate (%)</label>
                    <input v-model.number="property.requestedRate" type="number" step="0.05"
                      class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-semibold" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Amortization</label>
                    <select v-model.number="property.amortizationYears"
                      class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-semibold">
                      <option :value="20">20 years</option>
                      <option :value="25">25 years</option>
                      <option :value="30">30 years</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Term</label>
                    <select v-model.number="property.termYears"
                      class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-semibold">
                      <option :value="1">1 year</option>
                      <option :value="2">2 years</option>
                      <option :value="3">3 years</option>
                      <option :value="4">4 years</option>
                      <option :value="5">5 years</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Frequency</label>
                    <select v-model="property.paymentFreq"
                      class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-semibold">
                      <option value="monthly">Monthly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>

                <div class="pt-4 border-t border-gray-100">
                  <p class="text-xs font-bold text-gray-500 uppercase mb-3">Property Running Costs (Monthly)</p>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Property Tax
                        (monthly)</label>
                      <div class="relative">
                        <span class="absolute left-2.5 top-2 text-gray-400 text-xs">$</span>
                        <input v-model.number="property.monthlyTax" type="number"
                          class="w-full pl-6 pr-2 py-1.5 bg-gray-50 border-none rounded-lg text-sm" />
                      </div>
                      <p class="text-[10px] text-gray-400 mt-1">Annual: {{ formatCurrency(property.monthlyTax * 12) }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Heating (monthly)</label>
                      <div class="relative">
                        <span class="absolute left-2.5 top-2 text-gray-400 text-xs">$</span>
                        <input v-model.number="property.monthlyHeating" type="number"
                          class="w-full pl-6 pr-2 py-1.5 bg-gray-50 border-none rounded-lg text-sm" />
                      </div>
                    </div>
                    <div>
                      <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Condo / Strata
                        Fees</label>
                      <div class="relative">
                        <span class="absolute left-2.5 top-2 text-gray-400 text-xs">$</span>
                        <input v-model.number="property.monthlyCondoFees" type="number"
                          class="w-full pl-6 pr-2 py-1.5 bg-gray-50 border-none rounded-lg text-sm" />
                      </div>
                      <p class="text-[10px] text-gray-400 mt-1">Lenders use 50%: {{
                        formatCurrency(property.monthlyCondoFees *
                          0.5) }}</p>
                    </div>
                  </div>
                </div>

                <div class="pt-4 border-t border-gray-100">
                  <p class="text-xs font-bold text-gray-500 uppercase mb-3">Property Profile</p>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Property Type</label>
                      <select v-model="property.type"
                        class="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm">
                        <option value="detached">Detached House</option>
                        <option value="semiDetached">Semi-Detached</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="condo">Condo / Apartment</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Usage</label>
                      <select v-model="property.usage"
                        class="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm">
                        <option value="ownerOccupied">Owner-Occupied (Primary)</option>
                        <option value="rental">Rental / Investment</option>
                        <option value="secondHome">Second Home</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stress test callout -->
            <div class="bg-primary/5 rounded-2xl p-5 border border-primary/10 mb-4">
              <div class="flex items-start gap-3">
                <span class="text-2xl">🧪</span>
                <div>
                  <h3 class="font-bold text-primary text-sm">Canadian Mortgage Stress Test</h3>
                  <p class="text-xs text-gray-600 mt-1">You must qualify at <strong>{{ formatPct(stressTestRate)
                  }}</strong> — the
                    higher of 5.25% or your contract rate + 2% ({{ formatPct(property.requestedRate + 2) }}). Your
                    actual payment
                    at {{ formatPct(property.requestedRate) }} would be <strong>{{ formatCurrency(actualMonthlyPayment)
                    }}/mo</strong>.</p>
                </div>
              </div>
            </div>

            <div class="flex justify-between mt-4">
              <button @click="activeStep = 'assets'"
                class="px-6 py-3 text-primary font-bold rounded-xl border-2 border-gray-100 hover:border-primary transition-colors">←
                Assets</button>
              <button @click="activeStep = 'results'"
                class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">View
                Results
                →</button>
            </div>
          </div>

          <!-- ── STEP: RESULTS ── -->
          <div v-if="activeStep === 'results'">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl font-black text-primary">Your Qualification Results</h2>
                <p class="text-sm text-gray-500 mt-0.5">Based on Canadian lending criteria including the stress test.
                </p>
              </div>
              <button @click="generatePDF"
                class="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm">
                <DocumentArrowDownIcon class="w-4 h-4" /> Export PDF
              </button>
            </div>

            <!-- Approval indicator -->
            <div :class="[
              'rounded-2xl p-6 mb-6 border-2',
              approvalStatus.color === 'green' ? 'bg-green-50 border-green-200' :
                approvalStatus.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-red-50 border-red-200'
            ]">
              <div class="flex items-center gap-4">
                <span class="text-4xl">{{ approvalStatus.emoji }}</span>
                <div>
                  <h3
                    :class="['text-xl font-black', approvalStatus.color === 'green' ? 'text-green-700' : approvalStatus.color === 'yellow' ? 'text-yellow-700' : 'text-red-700']">
                    {{ approvalStatus.title }}
                  </h3>
                  <p
                    :class="['text-sm mt-1', approvalStatus.color === 'green' ? 'text-green-600' : approvalStatus.color === 'yellow' ? 'text-yellow-600' : 'text-red-600']">
                    {{ approvalStatus.message }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Key metrics grid -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-bl-full"></div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gross Monthly</p>
                <h3 class="text-2xl font-black text-primary">{{ formatCurrency(grossMonthlyIncome) }}</h3>
              </div>
              <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Non-Housing Debts</p>
                <h3 class="text-2xl font-black text-primary">{{ formatCurrency(totalNonHousingDebts) }}</h3>
                <p class="text-[10px] text-gray-400 mt-0.5">Monthly obligations</p>
              </div>
              <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Max Mortgage</p>
                <h3 class="text-2xl font-black text-accent">{{ formatCurrency(maxQualifyingMortgage) }}</h3>
                <p class="text-[10px] text-gray-400 mt-0.5">@ stress test rate</p>
              </div>
              <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Max Purchase</p>
                <h3 class="text-2xl font-black text-accent">{{ formatCurrency(maxPurchasePrice) }}</h3>
                <p class="text-[10px] text-gray-400 mt-0.5">With {{ property.downPaymentPct }}% down</p>
              </div>
            </div>

            <!-- GDS / TDS Ratios -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div class="px-6 py-4 border-b border-gray-50">
                <h3 class="font-bold text-primary">GDS & TDS Ratios</h3>
                <p class="text-xs text-gray-500 mt-0.5">Calculated using the stress test rate of {{
                  formatPct(stressTestRate) }}.
                  Limits: GDS ≤ 39%, TDS ≤ 44%.</p>
              </div>
              <div class="p-6 space-y-5">
                <!-- GDS -->
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <div>
                      <span class="text-sm font-bold text-gray-700">GDS — Gross Debt Service</span>
                      <p class="text-[10px] text-gray-400">(Mortgage P+I + Tax + Heat + 50% Condo) ÷ Gross Income</p>
                    </div>
                    <div class="text-right">
                      <span :class="['text-lg font-black', gdsRatio <= 39 ? 'text-green-600' : 'text-red-600']">{{
                        formatPct(gdsRatio) }}</span>
                      <p class="text-[10px] text-gray-400">limit: 39%</p>
                    </div>
                  </div>
                  <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div :class="['h-full rounded-full transition-all', gdsRatio <= 39 ? 'bg-green-500' : 'bg-red-500']"
                      :style="{ width: Math.min(gdsRatio / 50 * 100, 100) + '%' }"></div>
                  </div>
                  <div class="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>0%</span><span class="text-green-600">39%</span><span>50%</span>
                  </div>
                </div>
                <!-- TDS -->
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <div>
                      <span class="text-sm font-bold text-gray-700">TDS — Total Debt Service</span>
                      <p class="text-[10px] text-gray-400">(GDS numerator + All other monthly debts) ÷ Gross Income</p>
                    </div>
                    <div class="text-right">
                      <span :class="['text-lg font-black', tdsRatio <= 44 ? 'text-green-600' : 'text-red-600']">{{
                        formatPct(tdsRatio) }}</span>
                      <p class="text-[10px] text-gray-400">limit: 44%</p>
                    </div>
                  </div>
                  <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div :class="['h-full rounded-full transition-all', tdsRatio <= 44 ? 'bg-green-500' : 'bg-red-500']"
                      :style="{ width: Math.min(tdsRatio / 60 * 100, 100) + '%' }"></div>
                  </div>
                  <div class="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>0%</span><span class="text-green-600">44%</span><span>60%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- LTV + CMHC -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Loan-to-Value (LTV)</p>
                <h3 class="text-2xl font-black text-primary">{{ formatPct(ltv) }}</h3>
                <p class="text-xs text-gray-500 mt-1">{{ ltv <= 80 ? '✅ Under 80% — no mortgage insurance required' :
                  `⚠️ Over 80% — CMHC insurance required (${formatCurrency(cmhcPremium)})` }}</p>
              </div>
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Down Payment Required</p>
                <h3 class="text-2xl font-black text-primary">{{ formatCurrency(downPaymentDollars) }}</h3>
                <p class="text-xs text-gray-500 mt-1">Plus closing costs ≈ {{ formatCurrency(estimatedClosingCosts) }}
                  (1.5–4%
                  est.)</p>
              </div>
            </div>

            <!-- Actual payment breakdown -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div class="px-6 py-4 border-b border-gray-50">
                <h3 class="font-bold text-primary">Estimated Monthly Costs at Contract Rate ({{
                  formatPct(property.requestedRate)
                }})</h3>
              </div>
              <div class="p-6 space-y-3">
                <div v-for="item in paymentBreakdown" :key="item.label"
                  class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">{{ item.label }}</span>
                  <span class="font-semibold text-gray-900 tabular-nums">{{ formatCurrency(item.value) }}</span>
                </div>
                <div
                  class="flex justify-between items-center text-base font-black text-primary pt-3 border-t border-gray-100">
                  <span>Total Monthly (PITH)</span>
                  <span class="tabular-nums">{{ formatCurrency(totalMonthlyPITH) }}</span>
                </div>
                <p class="text-xs text-gray-400">Note: Stress test qualification uses {{ formatPct(stressTestRate) }}
                  but your
                  actual payment uses {{ formatPct(property.requestedRate) }}.</p>
              </div>
            </div>

            <!-- Things to strengthen -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
              <div class="px-6 py-4 border-b border-gray-50">
                <h3 class="font-bold text-primary">Ways to Strengthen Your Application</h3>
              </div>
              <div class="p-6 space-y-3">
                <div v-for="tip in strengthTips" :key="tip.text" class="flex gap-3 items-start">
                  <span :class="['text-base mt-0.5', tip.type === 'good' ? 'text-green-500' : 'text-amber-500']">{{
                    tip.type ===
                      'good' ? '✅' : '💡' }}</span>
                  <p class="text-sm text-gray-700">{{ tip.text }}</p>
                </div>
              </div>
            </div>

            <div class="flex justify-between mt-4">
              <button @click="activeStep = 'property'"
                class="px-6 py-3 text-primary font-bold rounded-xl border-2 border-gray-100 hover:border-primary transition-colors">←
                Property</button>
              <button @click="generatePDF"
                class="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
                <DocumentArrowDownIcon class="w-4 h-4" /> Download PDF Summary
              </button>
            </div>
          </div>

        </div>

        <!-- ── Sticky Summary Sidebar ── -->
        <aside class="lg:col-span-4">
          <div class="sticky top-20 space-y-4">

            <!-- Live snapshot card -->
            <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 class="text-primary font-bold text-sm uppercase tracking-wide">Live Snapshot</h3>
                <span
                  class="text-[10px] bg-accent text-white px-2 py-0.5 rounded-full font-black uppercase">Real-time</span>
              </div>
              <div class="p-6">
                <SidebarRow label="Gross Monthly Income" :value="formatCurrency(grossMonthlyIncome)" highlight />
                <SidebarRow label="Non-Housing Debts / mo" :value="formatCurrency(totalNonHousingDebts)" />
                <SidebarRow label="Existing Mortgage Payments" :value="formatCurrency(totalExistingMortgagePayments)" />
                <div class="border-t border-white/10 pt-4">
                  <SidebarRow label="GDS Ratio" :value="formatPct(gdsRatio)"
                    :status="gdsRatio <= 39 ? 'good' : 'bad'" />
                  <SidebarRow label="TDS Ratio" :value="formatPct(tdsRatio)"
                    :status="tdsRatio <= 44 ? 'good' : 'bad'" />
                </div>
                <div class="border-t border-white/10 pt-4">
                  <SidebarRow label="Stress Test Rate" :value="formatPct(stressTestRate)" />
                  <SidebarRow label="Max Qualifying Mortgage" :value="formatCurrency(maxQualifyingMortgage)"
                    highlight />
                  <SidebarRow label="Max Purchase Price" :value="formatCurrency(maxPurchasePrice)" highlight />
                </div>
              </div>
            </div>

            <!-- Down payment status -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 class="text-sm font-bold text-primary mb-3">Down Payment Status</h3>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Available</span>
                  <span class="font-bold text-primary">{{ formatCurrency(totalAvailableForDownPayment) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Required ({{ formatPct(property.downPaymentPct) }})</span>
                  <span class="font-bold text-gray-700">{{ formatCurrency(downPaymentDollars) }}</span>
                </div>
                <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                  <div
                    :class="['h-full rounded-full transition-all', totalAvailableForDownPayment >= downPaymentDollars ? 'bg-green-500' : 'bg-red-400']"
                    :style="{ width: Math.min(totalAvailableForDownPayment / Math.max(downPaymentDollars, 1) * 100, 100) + '%' }">
                  </div>
                </div>
                <p v-if="totalAvailableForDownPayment < downPaymentDollars"
                  class="text-xs text-red-500 font-medium mt-1">
                  Shortfall: {{ formatCurrency(downPaymentDollars - totalAvailableForDownPayment) }}
                </p>
                <p v-else class="text-xs text-green-600 font-medium mt-1">
                  ✓ Down payment covered. Surplus: {{ formatCurrency(totalAvailableForDownPayment - downPaymentDollars)
                  }}
                </p>
              </div>
            </div>

            <!-- Requested vs Max comparison -->
            <div v-if="property.purchasePrice > 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 class="text-sm font-bold text-primary mb-3">Requested vs. Qualified</h3>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Requested Mortgage</span>
                  <span class="font-bold text-gray-700">{{ formatCurrency(requestedMortgage) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Max Qualifying</span>
                  <span class="font-bold"
                    :class="maxQualifyingMortgage >= requestedMortgage ? 'text-green-600' : 'text-red-600'">{{
                      formatCurrency(maxQualifyingMortgage) }}</span>
                </div>
                <div
                  :class="['text-center mt-3 py-2 rounded-xl text-sm font-bold', maxQualifyingMortgage >= requestedMortgage ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700']">
                  {{ maxQualifyingMortgage >= requestedMortgage ? `✓ You qualify (buffer:
                  ${formatCurrency(maxQualifyingMortgage
                    - requestedMortgage)})` : `⚠ Gap: ${formatCurrency(requestedMortgage - maxQualifyingMortgage)}` }}
                </div>
              </div>
            </div>

          </div>
        </aside>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, h, defineComponent } from 'vue'
import { ArrowLeftIcon, PlusIcon, DocumentArrowDownIcon } from '@heroicons/vue/24/outline'
import jsPDF from 'jspdf'

// ── Inline sub-components ──────────────────────────────────────────────────

const SidebarRow = defineComponent({
  name: 'SidebarRow',
  props: {
    label: String,
    value: String,
    highlight: Boolean,
    status: String // 'good' | 'bad'
  },
  setup(props) {
    return () => h('div', { class: 'flex justify-between items-center py-1' }, [
      h('span', { class: 'text-xs' }, props.label),
      h('span', {
        class: [
          'text-sm font-bold tabular-nums',
          props.highlight ? 'text-accent' :
            props.status === 'good' ? 'text-primary' :
              props.status === 'bad' ? 'text-red-400' :
                'text-gray-700'
        ].join(' ')
      }, props.value)
    ])
  }
})

const DebtRow = defineComponent({
  name: 'DebtRow',
  props: { debt: Object, showBalance: Boolean },
  emits: ['remove'],
  setup(props, { emit }) {
    return () => h('div', { class: 'grid grid-cols-2 sm:grid-cols-3 gap-3' }, [
      h('div', {}, [
        h('label', { class: 'block text-[10px] font-bold text-gray-400 uppercase mb-1' }, 'Description'),
        h('input', { class: 'w-full px-3 py-1.5 bg-gray-50 border-none rounded-lg text-sm', value: props.debt.label, onInput: (e) => { props.debt.label = e.target.value } })
      ]),
      h('div', {}, [
        h('label', { class: 'block text-[10px] font-bold text-gray-400 uppercase mb-1' }, 'Monthly Payment'),
        h('div', { class: 'relative' }, [
          h('span', { class: 'absolute left-2.5 top-2 text-gray-400 text-xs' }, '$'),
          h('input', { class: 'w-full pl-6 pr-2 py-1.5 bg-gray-50 border-none rounded-lg text-sm', type: 'number', value: props.debt.payment, onInput: (e) => { props.debt.payment = parseFloat(e.target.value) || 0 } })
        ])
      ]),
      h('div', { class: 'flex items-end gap-2' }, [
        props.showBalance ? h('div', { class: 'flex-1' }, [
          h('label', { class: 'block text-[10px] font-bold text-gray-400 uppercase mb-1' }, 'Balance'),
          h('div', { class: 'relative' }, [
            h('span', { class: 'absolute left-2.5 top-2 text-gray-400 text-xs' }, '$'),
            h('input', { class: 'w-full pl-6 pr-2 py-1.5 bg-gray-50 border-none rounded-lg text-sm', type: 'number', value: props.debt.balance, onInput: (e) => { props.debt.balance = parseFloat(e.target.value) || 0 } })
          ])
        ]) : null,
        h('button', { onClick: () => emit('remove'), class: 'mb-0.5 text-[10px] text-red-300 hover:text-red-500 font-medium whitespace-nowrap' }, 'Remove')
      ])
    ])
  }
})

// ── State ──────────────────────────────────────────────────────────────────

const activeStep = ref('income')
const steps = [
  { id: 'income', label: 'Income' },
  { id: 'debts', label: 'Debts' },
  { id: 'assets', label: 'Assets' },
  { id: 'property', label: 'Property' },
  { id: 'results', label: 'Results' }
]

const stepComplete = (id) => {
  if (id === 'income') return incomeSources.value.some(s => s.gross > 0)
  if (id === 'debts') return true
  if (id === 'assets') return totalAssets.value > 0
  if (id === 'property') return property.value.purchasePrice > 0
  return false
}

// Income
const incomeSources = ref([
  { id: 1, type: 'employment', label: '', gross: 0, frequency: 'annual', yearsInBusiness: 0, bizType: 'sole', rentalOffset: 0.5 }
])

const showCoApplicant = ref(false)
const coApplicant = ref({ gross: 0, type: 'employment' })

let incomeIdCounter = 2

const addIncomeSource = () => {
  incomeSources.value.push({ id: incomeIdCounter++, type: 'employment', label: '', gross: 0, frequency: 'annual', yearsInBusiness: 0, bizType: 'sole', rentalOffset: 0.5 })
}

const removeIncomeSource = (i) => {
  if (incomeSources.value.length > 1) incomeSources.value.splice(i, 1)
}

const loadExampleData = () => {
  incomeSources.value = [{ id: 1, type: 'employment', label: 'Example job', gross: 120000, frequency: 'annual', yearsInBusiness: 0, bizType: 'sole', rentalOffset: 0.5 }]
  incomeIdCounter = 2
  showCoApplicant.value = false
  coApplicant.value = { gross: 0, type: 'employment' }
  // Example debts so qualification reflects TDS (lenders use 3% of CC balance, 3% of LOC limit, stated payments for rest)
  debts.value = {
    existingMortgages: [
      { mortgageType: 'standard', label: '', propertyType: 'primary', balance: 200000, rate: 5, payment: 1200 }
    ],
    vehicles: [
      { label: 'Car loan', payment: 350, balance: 0 }
    ],
    creditCards: [
      { label: 'Visa', balance: 5000, limit: 10000 }
    ],
    personalLOCs: [
      { label: 'Bank LOC', limit: 15000, balance: 2000 }
    ],
    other: [
      { label: 'Student loan', payment: 150, balance: 0 }
    ]
  }
  assets.value = { chequing: 10000, savings: 90000, tfsa: 0, rrsp: 0, investments: 0, other: 0, rrspHBP: 0, giftAmount: 0 }
  property.value.purchasePrice = 500000
  property.value.downPaymentPct = 20
  property.value.requestedRate = 5.5
  property.value.amortizationYears = 25
  property.value.monthlyTax = 350
  property.value.monthlyHeating = 150
  property.value.monthlyCondoFees = 0
  activeStep.value = 'results'
}

const incomeTypeEmoji = (type) => ({
  employment: '💼', selfEmployed: '🏢', rental: '🏠', dividends: '📈',
  investments: '💹', pension: '🏦', child: '👨‍👩‍👧', other: '💰'
})[type] || '💰'

const toMonthly = (src) => {
  const raw = src.gross || 0
  const divisor = { annual: 12, monthly: 1, biweekly: 26 / 12, weekly: 52 / 12 }
  const monthly = raw / (divisor[src.frequency] || 12)
  if (src.type === 'rental') return monthly * (src.rentalOffset || 0.5)
  if (src.type === 'selfEmployed' && src.yearsInBusiness < 2) return monthly * 0.9
  return monthly
}

// Debts
const debts = ref({
  existingMortgages: [],
  vehicles: [],
  creditCards: [],
  personalLOCs: [],
  other: []
})

const mortgageTypes = [
  { value: 'standard', label: '🔒 Standard Fixed/Variable' },
  { value: 'readvanceable', label: '🔄 Readvanceable (STEP / FlexLine)' },
  { value: 'heloc', label: '💳 Standalone HELOC' }
]

const addExistingMortgage = () => {
  debts.value.existingMortgages.push({
    mortgageType: 'standard',
    label: '',
    propertyType: 'investment',
    // standard fields
    balance: 0, rate: 5, payment: 0,
    // readvanceable: fixed segment
    fixedBalance: 0, fixedRate: 5, fixedPayment: 0,
    // readvanceable + heloc: LOC segment
    locLimit: 0, locBalance: 0, locRate: 6.7, locQualMethod: 'limitAtStress'
  })
}
const removeExistingMortgage = (i) => debts.value.existingMortgages.splice(i, 1)
const addDebt = (key) => debts.value[key].push({ label: '', payment: 0, balance: 0 })
const removeDebt = (key, i) => debts.value[key].splice(i, 1)
const addCreditCard = () => debts.value.creditCards.push({ label: '', balance: 0, limit: 0 })
const addPersonalLOC = () => debts.value.personalLOCs.push({ label: '', limit: 0, balance: 0 })

// Calculate the monthly obligation a lender assigns to a LOC/HELOC segment
const calcLocMonthlyObligation = (mtg) => {
  const stressRate = stressTestRate.value / 100 / 12
  switch (mtg.locQualMethod) {
    case 'limitAtStress': return (mtg.locLimit || 0) * stressRate
    case 'balanceAtStress': return (mtg.locBalance || 0) * stressRate
    case 'threePercent': return (mtg.locBalance || 0) * 0.03
    case 'actualPayment': return (mtg.locBalance || 0) * ((mtg.locRate || 6.7) / 100 / 12)
    default: return (mtg.locLimit || 0) * stressRate
  }
}

// Assets
const assetFields = [
  { key: 'chequing', label: 'Chequing Account' },
  { key: 'savings', label: 'Savings Account' },
  { key: 'tfsa', label: 'TFSA' },
  { key: 'rrsp', label: 'RRSP' },
  { key: 'investments', label: 'Non-Registered Investments' },
  { key: 'other', label: 'Other Assets' }
]

const assets = ref({ chequing: 0, savings: 0, tfsa: 0, rrsp: 0, investments: 0, other: 0, rrspHBP: 0, giftAmount: 0 })

// Property
const property = ref({
  purchasePrice: 0,
  downPaymentPct: 20,
  requestedRate: 5.5,
  amortizationYears: 25,
  termYears: 5,
  paymentFreq: 'monthly',
  monthlyTax: 350,
  monthlyHeating: 150,
  monthlyCondoFees: 0,
  type: 'detached',
  usage: 'ownerOccupied'
})

// ── Helpers ────────────────────────────────────────────────────────────────

const formatCurrency = (v) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v || 0)
const formatPct = (v) => (v || 0).toFixed(2) + '%'

// Monthly payment formula
const calcMonthlyPayment = (principal, annualRate, amortYears) => {
  if (!principal || !annualRate || !amortYears) return 0
  const r = annualRate / 100 / 12
  const n = amortYears * 12
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

// Solve for max loan given monthly payment
const calcMaxLoan = (monthlyPayment, annualRate, amortYears) => {
  if (!monthlyPayment || !annualRate || !amortYears) return 0
  const r = annualRate / 100 / 12
  const n = amortYears * 12
  return monthlyPayment * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n))
}

// ── Computed ───────────────────────────────────────────────────────────────

const grossMonthlyIncome = computed(() => {
  const own = incomeSources.value.reduce((s, src) => s + toMonthly(src), 0)
  const co = showCoApplicant.value ? (coApplicant.value.gross || 0) / 12 : 0
  return own + co
})

const totalExistingMortgagePayments = computed(() =>
  debts.value.existingMortgages.reduce((s, m) => {
    if (m.mortgageType === 'standard') return s + (m.payment || 0)
    if (m.mortgageType === 'readvanceable') return s + (m.fixedPayment || 0) + calcLocMonthlyObligation(m)
    if (m.mortgageType === 'heloc') return s + calcLocMonthlyObligation(m)
    return s + (m.payment || 0)
  }, 0)
)

const totalNonHousingDebts = computed(() => {
  const vehicles = debts.value.vehicles.reduce((s, d) => s + (d.payment || 0), 0)
  const cc = debts.value.creditCards.reduce((s, cc) => s + (cc.balance || 0) * 0.03, 0)
  // Personal LOCs: lenders use 3% of LIMIT (not balance), same as credit cards
  const personalLOCs = debts.value.personalLOCs.reduce((s, loc) => s + (loc.limit || 0) * 0.03, 0)
  const other = debts.value.other.reduce((s, d) => s + (d.payment || 0), 0)
  return vehicles + cc + personalLOCs + other + totalExistingMortgagePayments.value
})

const totalAssets = computed(() =>
  Object.entries(assets.value)
    .filter(([k]) => !['rrspHBP', 'giftAmount'].includes(k))
    .reduce((s, [, v]) => s + (v || 0), 0)
)

const totalAvailableForDownPayment = computed(() =>
  (assets.value.chequing || 0) +
  (assets.value.savings || 0) +
  (assets.value.tfsa || 0) +
  (assets.value.rrspHBP || 0) +
  (assets.value.giftAmount || 0)
)

const downPaymentDollars = computed(() => (property.value.purchasePrice || 0) * (property.value.downPaymentPct || 20) / 100)
const setDownPaymentFromDollars = (val) => {
  const dollars = parseFloat(val) || 0
  if (property.value.purchasePrice > 0) property.value.downPaymentPct = Math.round((dollars / property.value.purchasePrice) * 1000) / 10
}

const requestedMortgage = computed(() => Math.max(0, (property.value.purchasePrice || 0) - downPaymentDollars.value))

const stressTestRate = computed(() => Math.max(5.25, (property.value.requestedRate || 0) + 2))

const ltv = computed(() => {
  if (!property.value.purchasePrice) return 0
  return (requestedMortgage.value / property.value.purchasePrice) * 100
})

const cmhcRate = computed(() => {
  const ltv_ = ltv.value
  if (ltv_ <= 80) return 0
  if (ltv_ <= 85) return 0.028
  if (ltv_ <= 90) return 0.031
  return 0.04
})

const cmhcPremium = computed(() => requestedMortgage.value * cmhcRate.value)

const actualMonthlyPayment = computed(() => calcMonthlyPayment(requestedMortgage.value, property.value.requestedRate, property.value.amortizationYears))

const stressMonthlyPayment = computed(() => calcMonthlyPayment(requestedMortgage.value, stressTestRate.value, property.value.amortizationYears))

// GDS and TDS using stress test rate
const housingCostsMonthly = computed(() =>
  stressMonthlyPayment.value +
  (property.value.monthlyTax || 0) +
  (property.value.monthlyHeating || 0) +
  (property.value.monthlyCondoFees || 0) * 0.5
)

const gdsRatio = computed(() => {
  if (!grossMonthlyIncome.value) return 0
  return (housingCostsMonthly.value / grossMonthlyIncome.value) * 100
})

const tdsRatio = computed(() => {
  if (!grossMonthlyIncome.value) return 0
  return ((housingCostsMonthly.value + totalNonHousingDebts.value) / grossMonthlyIncome.value) * 100
})

const maxQualifyingMortgage = computed(() => {
  if (!grossMonthlyIncome.value) return 0
  const nonPITH = (property.value.monthlyTax || 0) + (property.value.monthlyHeating || 0) + (property.value.monthlyCondoFees || 0) * 0.5
  // From GDS (39%)
  const maxPITH_GDS = grossMonthlyIncome.value * 0.39
  const maxPI_GDS = Math.max(0, maxPITH_GDS - nonPITH)
  // From TDS (44%)
  const maxPITH_TDS = grossMonthlyIncome.value * 0.44 - totalNonHousingDebts.value
  const maxPI_TDS = Math.max(0, maxPITH_TDS - nonPITH)

  const maxPI = Math.min(maxPI_GDS, maxPI_TDS)
  return calcMaxLoan(maxPI, stressTestRate.value, property.value.amortizationYears)
})

const maxPurchasePrice = computed(() => {
  const pct = (property.value.downPaymentPct || 20) / 100
  return maxQualifyingMortgage.value / (1 - pct)
})

const estimatedClosingCosts = computed(() => (property.value.purchasePrice || 0) * 0.025)

const totalMonthlyPITH = computed(() =>
  actualMonthlyPayment.value +
  (property.value.monthlyTax || 0) +
  (property.value.monthlyHeating || 0) +
  (property.value.monthlyCondoFees || 0) * 0.5
)

const paymentBreakdown = computed(() => [
  { label: `Principal & Interest (${formatPct(property.value.requestedRate)})`, value: actualMonthlyPayment.value },
  { label: 'Property Tax', value: property.value.monthlyTax || 0 },
  { label: 'Heating / Utilities', value: property.value.monthlyHeating || 0 },
  ...(property.value.monthlyCondoFees > 0 ? [{ label: 'Condo Fees (50% used)', value: property.value.monthlyCondoFees * 0.5 }] : [])
])

const approvalStatus = computed(() => {
  const hasIncome = grossMonthlyIncome.value > 0
  const gds = gdsRatio.value
  const tds = tdsRatio.value
  const downOk = totalAvailableForDownPayment.value >= downPaymentDollars.value || downPaymentDollars.value === 0
  const qualifies = requestedMortgage.value <= maxQualifyingMortgage.value

  if (!hasIncome) return { color: 'yellow', emoji: '📝', title: 'Enter Your Details', message: 'Fill in your income, debts, and property details to see your qualification status.' }
  if (gds <= 39 && tds <= 44 && qualifies && downOk) return { color: 'green', emoji: '🎉', title: 'Strong Qualifier', message: `You appear to qualify. GDS ${formatPct(gds)} and TDS ${formatPct(tds)} are within limits. Great position to approach a lender.` }
  if (gds <= 39 && tds <= 44 && !qualifies) return { color: 'yellow', emoji: '⚠️', title: 'Ratios OK — Price Needs Adjustment', message: `Your debt ratios pass but the requested mortgage exceeds your max of ${formatCurrency(maxQualifyingMortgage.value)}.` }
  if (!downOk) return { color: 'yellow', emoji: '💰', title: 'Down Payment Shortfall', message: `You need ${formatCurrency(downPaymentDollars.value - totalAvailableForDownPayment.value)} more for the down payment.` }
  return { color: 'red', emoji: '🚧', title: 'Ratios Exceed Limits', message: `GDS is ${formatPct(gds)} (limit 39%) or TDS is ${formatPct(tds)} (limit 44%). Reducing debts or increasing income will help.` }
})

const strengthTips = computed(() => {
  const tips = []
  if (tdsRatio.value <= 44) tips.push({ type: 'good', text: `TDS ratio of ${formatPct(tdsRatio.value)} is within the 44% limit — lenders will view this favourably.` })
  if (gdsRatio.value <= 39) tips.push({ type: 'good', text: `GDS ratio of ${formatPct(gdsRatio.value)} is within the 39% limit.` })
  if (property.value.downPaymentPct >= 20) tips.push({ type: 'good', text: 'Down payment is 20%+ — you avoid CMHC insurance, saving thousands.' })
  if (property.value.downPaymentPct < 20) tips.push({ type: 'tip', text: `Increasing your down payment to 20% (${formatCurrency(property.value.purchasePrice * 0.2)}) eliminates CMHC insurance.` })
  if (debts.value.creditCards.length > 0) {
    const ccDebt = debts.value.creditCards.reduce((s, cc) => s + (cc.balance || 0), 0)
    if (ccDebt > 0) tips.push({ type: 'tip', text: `Paying down ${formatCurrency(ccDebt)} in credit card balances reduces your TDS by ${formatPct(ccDebt * 0.03 / Math.max(grossMonthlyIncome.value, 1) * 100)}.` })
  }
  if (showCoApplicant.value && coApplicant.value.gross > 0) tips.push({ type: 'good', text: 'Co-applicant income is included — this significantly boosts your qualifying amount.' })
  if (!showCoApplicant.value) tips.push({ type: 'tip', text: 'If you have a spouse or partner, adding their income as a co-applicant can substantially increase your maximum.' })
  if (tdsRatio.value > 44) tips.push({ type: 'tip', text: `Reduce monthly debts by ${formatCurrency((tdsRatio.value - 44) / 100 * grossMonthlyIncome.value)} to bring TDS to 44%.` })
  return tips
})

// ── PDF Export ─────────────────────────────────────────────────────────────

const PDF = {
  primary: [15, 23, 42],
  primaryLight: [51, 65, 85],
  muted: [100, 116, 139],
  accent: [16, 185, 129],
  danger: [220, 38, 38],
  bgSection: [248, 250, 252],
  border: [226, 232, 240],
  disclaimer: [100, 116, 139]   // darker for readability
}

const generatePDF = () => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210
  const M = 16
  const CW = W - M * 2
  let y = 0

  const ln = (n = 1) => { y += n }
  const setY = (val) => { y = val }

  const row = (label, value, accent = false) => {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...PDF.muted)
    doc.text(label, M + 2, y)
    doc.setFont('helvetica', accent ? 'bold' : 'normal')
    doc.setTextColor(...(accent ? PDF.accent : PDF.primary))
    doc.text(String(value), W - M - 2, y, { align: 'right' })
    ln(6.5)
  }

  const sectionBox = (title, startY, drawContent) => {
    const titleH = 7
    // Accent bar (left) + title bar
    // doc.setFillColor(...PDF.accent)
    // doc.rect(M, startY, 3, titleH, 'F')
    doc.setFillColor(...PDF.bgSection)
    doc.setDrawColor(...PDF.border)
    doc.setLineWidth(0.2)
    doc.rect(M + 1, startY, CW - 2, titleH, 'FD')
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...PDF.primary)
    doc.text(title, M + 3, startY + 4.8)
    setY(startY + titleH + 4)
    drawContent()
    setY(y + 1)
  }

  // ── Header ──
  doc.setFillColor(...PDF.primary)
  doc.rect(0, 0, W, 36, 'F')
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('Mortgage Qualification Summary', M, 16)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(203, 213, 225)
  doc.text(`Generated ${new Date().toLocaleDateString('en-CA', { dateStyle: 'full' })}  ·  For personal reference only — not a lender approval`, M, 24)
  setY(44)

  // ── At a glance: 4 equal columns with dividers ──
  const colW = CW / 4
  const boxH = 22
  doc.setFillColor(255, 255, 255)
  doc.setDrawColor(...PDF.border)
  doc.setLineWidth(0.25)
  doc.rect(M, y, CW, boxH, 'FD')
  doc.rect(M, y, CW, boxH, 'S')
  for (let c = 1; c < 4; c++) {
    doc.setDrawColor(...PDF.border)
    doc.line(M + c * colW, y, M + c * colW, y + boxH)
  }
  const colCenter = (i) => M + (i + 0.5) * colW
  const labelY = y + 5
  const valueY = y + 15
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...PDF.muted)
  doc.text('GDS (limit 39%)', colCenter(0), labelY, { align: 'center' })
  doc.text('TDS (limit 44%)', colCenter(1), labelY, { align: 'center' })
  doc.text('Max qualifying mortgage', colCenter(2), labelY, { align: 'center' })
  doc.text('Status', colCenter(3), labelY, { align: 'center' })
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...(gdsRatio.value <= 39 ? PDF.accent : PDF.danger))
  doc.text(formatPct(gdsRatio.value), colCenter(0), valueY, { align: 'center' })
  doc.setTextColor(...(tdsRatio.value <= 44 ? PDF.accent : PDF.danger))
  doc.text(formatPct(tdsRatio.value), colCenter(1), valueY, { align: 'center' })
  doc.setTextColor(...PDF.primary)
  const qualifies = requestedMortgage.value <= maxQualifyingMortgage.value
  doc.setTextColor(...(qualifies ? PDF.accent : PDF.primary))
  doc.text(formatCurrency(maxQualifyingMortgage.value), colCenter(2), valueY, { align: 'center' })
  const statusOk = gdsRatio.value <= 39 && tdsRatio.value <= 44 && qualifies
  doc.setTextColor(...(statusOk ? PDF.accent : PDF.danger))
  doc.setFontSize(9)
  doc.text(approvalStatus.value.title, colCenter(3), valueY, { align: 'center' })
  setY(y + boxH + 5)

  // ── Income ──
  sectionBox('Income', y, () => {
    incomeSources.value.forEach(src => {
      if (src.gross > 0) row(`${src.label || src.type} (${src.frequency})`, formatCurrency(toMonthly(src)) + '/mo')
    })
    if (showCoApplicant.value && coApplicant.value.gross > 0) row('Co-Applicant', formatCurrency(coApplicant.value.gross / 12) + '/mo')
    row('Total gross monthly income', formatCurrency(grossMonthlyIncome.value), true)
  })

  // ── Debts ──
  sectionBox('Debts & obligations', y, () => {
    debts.value.existingMortgages.forEach((m, i) => {
      if (m.mortgageType === 'standard') row(`Existing mortgage ${i + 1} (${m.propertyType})`, formatCurrency(m.payment) + '/mo')
      else if (m.mortgageType === 'readvanceable') {
        row(`Readvanceable – fixed (${m.label || 'Mtg ' + (i + 1)})`, formatCurrency(m.fixedPayment) + '/mo')
        row('Readvanceable – LOC (lender qual.)', formatCurrency(calcLocMonthlyObligation(m)) + '/mo')
      } else if (m.mortgageType === 'heloc') row(`HELOC (limit ${formatCurrency(m.locLimit)})`, formatCurrency(calcLocMonthlyObligation(m)) + '/mo')
    })
    row('Vehicle loans / leases', formatCurrency(debts.value.vehicles.reduce((s, d) => s + (d.payment || 0), 0)) + '/mo')
    row('Credit cards (3% of balance)', formatCurrency(debts.value.creditCards.reduce((s, cc) => s + (cc.balance || 0) * 0.03, 0)) + '/mo')
    row('Personal LOCs (3% of limit)', formatCurrency(debts.value.personalLOCs.reduce((s, loc) => s + (loc.limit || 0) * 0.03, 0)) + '/mo')
    row('Student / other loans', formatCurrency(debts.value.other.reduce((s, d) => s + (d.payment || 0), 0)) + '/mo')
    row('Total non-housing debts', formatCurrency(totalNonHousingDebts.value), true)
  })

  // ── Property ──
  sectionBox('Property details', y, () => {
    row('Purchase price', formatCurrency(property.value.purchasePrice))
    row(`Down payment (${formatPct(property.value.downPaymentPct)})`, formatCurrency(downPaymentDollars.value))
    row('Requested mortgage', formatCurrency(requestedMortgage.value))
    row('Contract rate', formatPct(property.value.requestedRate))
    row('Stress test rate', formatPct(stressTestRate.value))
    row('Amortization', property.value.amortizationYears + ' years')
    row('Property tax (monthly)', formatCurrency(property.value.monthlyTax))
    row('Heating (monthly)', formatCurrency(property.value.monthlyHeating))
  })

  // ── Qualification results ──
  sectionBox('Qualification results', y, () => {
    row('GDS ratio (limit 39%)', formatPct(gdsRatio.value), gdsRatio.value <= 39)
    row('TDS ratio (limit 44%)', formatPct(tdsRatio.value), tdsRatio.value <= 44)
    row('LTV ratio', formatPct(ltv.value))
    if (cmhcPremium.value > 0) row('CMHC premium', formatCurrency(cmhcPremium.value))
    row('Max qualifying mortgage', formatCurrency(maxQualifyingMortgage.value), true)
    row('Max purchase price (20% down)', formatCurrency(maxPurchasePrice.value), true)
    row('Actual monthly payment (P+I)', formatCurrency(actualMonthlyPayment.value))
    row('Total monthly PITH', formatCurrency(totalMonthlyPITH.value))
  })

  // ── Disclaimer ──
  ln(1)
  doc.setDrawColor(...PDF.border)
  doc.setLineWidth(0.4)
  doc.line(M, y, M + CW, y)
  ln(1)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...PDF.disclaimer)
  const disclaimer = 'This report is for educational and planning purposes only. It does not constitute a mortgage pre-approval or commitment from any lender. Actual qualification is determined by a licensed mortgage broker or lender based on your full application, credit history, and current guidelines. Consult a qualified mortgage professional for advice.'
  const lines = doc.splitTextToSize(disclaimer, CW)
  const lineHeight = 5
  const disclaimerStartY = y
  lines.forEach((line, i) => {
    doc.text(line, M, disclaimerStartY + (i + 1) * lineHeight)
  })
  const disclaimerEndY = disclaimerStartY + lines.length * lineHeight
  setY(disclaimerEndY + 8)

  // Footer (always below disclaimer to avoid overlap)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...PDF.muted)
  doc.text('Prishan Fernando.com — Mortgage Qualifier Tool', M, y)
  doc.text('For personal reference only', W - M, y, { align: 'right' })

  doc.save('mortgage-qualification.pdf')
}
</script>

<style>
.bg-grid-pattern {
  background-image: radial-gradient(circle, #ffffff 1px, transparent 1px);
  background-size: 30px 30px;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

input[type="range"] {
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #e2e8f0;
  border-radius: 99px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #0F172A;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}
</style>