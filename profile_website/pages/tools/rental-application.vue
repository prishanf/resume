<template>
  <div class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="relative pt-12 pb-12 overflow-hidden bg-inverse/85">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NuxtLink
          to="/tools"
          class="inline-flex items-center text-xs font-bold text-accent uppercase tracking-[0.3em] mb-8 hover:text-primary transition-colors group"
        >
          <ArrowLeftIcon class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Tools
        </NuxtLink>
        <h1 class="text-4xl md:text-5xl font-black text-primary mb-4 tracking-tighter">
          Residential Rental Application
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl">
          Complete all sections accurately. Progress is saved in your browser. You can generate a PDF when finished.
        </p>
      </div>
    </section>

    <!-- Form -->
    <section class="py-8 pb-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClientOnly>
          <!-- Progress -->
          <div class="mb-8">
            <p class="text-center text-sm text-gray-500 mb-2">
              Step {{ currentStep }} of {{ totalSteps }} — {{ progressPercent }}% complete
            </p>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-primary rounded-full transition-all duration-300"
                :style="{ width: progressPercent + '%' }"
              />
            </div>
            <div class="flex flex-wrap justify-between gap-2 mt-4">
              <button
                v-for="(title, i) in stepTitles"
                :key="i"
                type="button"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                :class="
                  i + 1 === currentStep
                    ? 'bg-primary text-white'
                    : i + 1 < currentStep
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'text-gray-400'
                "
                :disabled="i + 1 > highestCompletedStep"
                @click="i + 1 <= highestCompletedStep && goToStep(i + 1)"
              >
                <span
                  class="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                  :class="
                    i + 1 === currentStep
                      ? 'bg-white/20'
                      : i + 1 < currentStep
                        ? 'bg-primary text-white'
                        : 'bg-gray-200'
                  "
                >
                  {{ i + 1 }}
                </span>
                {{ title }}
              </button>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 sm:p-8">
            <p class="text-sm text-gray-600 bg-gray-50 border-l-4 border-primary p-4 mb-6 rounded-r">
              <strong>Required:</strong> Two (2) pieces of government-issued ID. Incomplete applications will not be processed.
            </p>

            <form id="rental-form" @submit.prevent="onSubmit">
              <!-- Step 1: Property & Personal -->
              <div v-show="currentStep === 1" class="space-y-6">
                <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-900 pb-2">
                  Property information
                </h2>
                <div class="grid gap-4 sm:grid-cols-1">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Property address applying for *</label>
                    <input
                      v-model="form.property_address"
                      type="text"
                      class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      :class="{ 'border-red-500': errors.property_address }"
                    />
                    <p v-if="errors.property_address" class="text-red-500 text-xs mt-1">{{ errors.property_address }}</p>
                  </div>
                  <div class="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Desired move-in date</label>
                      <input v-model="form.move_in_date" type="month" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Lease term (1, 2, or 3 years)</label>
                      <input v-model="form.lease_term" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                  </div>
                </div>

                <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-900 pb-2 mt-8">
                  Personal information — primary applicant
                </h2>
                <div class="grid gap-4 sm:grid-cols-1">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Full legal name *</label>
                    <input
                      v-model="form.full_name"
                      type="text"
                      class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      :class="{ 'border-red-500': errors.full_name }"
                    />
                    <p v-if="errors.full_name" class="text-red-500 text-xs mt-1">{{ errors.full_name }}</p>
                  </div>
                  <div class="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
                      <input v-model="form.birthdate" type="date" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Marital status</label>
                      <input v-model="form.marital_status" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                  </div>
                  <div class="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Primary phone</label>
                      <input v-model="form.phone" type="tel" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Alternate phone</label>
                      <input v-model="form.cell" type="tel" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input v-model="form.email" type="email" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div class="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Driver's licence / ID number</label>
                      <input v-model="form.license" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Province/state of issue</label>
                      <input v-model="form.license_province" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Residence history -->
              <div v-show="currentStep === 2" class="space-y-6">
                <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-900 pb-2">Current residence</h2>
                <div class="grid gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Current address</label>
                    <input v-model="form.current_address" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div class="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input v-model="form.current_city" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Province</label>
                      <input v-model="form.current_province" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
                      <input v-model="form.current_postal" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                  </div>
                  <div class="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Landlord / property manager</label>
                      <input v-model="form.current_landlord" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Landlord phone</label>
                      <input v-model="form.current_landlord_phone" type="tel" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                  </div>
                  <div class="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Monthly rent</label>
                      <input v-model="form.current_rent" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Move-in date</label>
                      <input v-model="form.current_start" type="date" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Move-out date</label>
                      <input v-model="form.current_end" type="date" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Reason for leaving</label>
                    <input v-model="form.reason_leaving" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                </div>

                <h3 class="text-base font-bold text-gray-800 mt-6 border-b border-gray-300 pb-1">Previous address #1</h3>
                <ResidenceBlock v-model:address="form.prev_address_1" v-model:city="form.prev_city_1" v-model:province="form.prev_province_1" v-model:postal="form.prev_postal_1" v-model:landlord="form.prev_landlord_1" v-model:landlord_phone="form.prev_landlord_phone_1" v-model:rent="form.prev_rent_1" v-model:start="form.prev_start_1" v-model:end="form.prev_end_1" />

                <h3 class="text-base font-bold text-gray-800 mt-6 border-b border-gray-300 pb-1">Previous address #2</h3>
                <ResidenceBlock v-model:address="form.prev_address_2" v-model:city="form.prev_city_2" v-model:province="form.prev_province_2" v-model:postal="form.prev_postal_2" v-model:landlord="form.prev_landlord_2" v-model:landlord_phone="form.prev_landlord_phone_2" v-model:rent="form.prev_rent_2" v-model:start="form.prev_start_2" v-model:end="form.prev_end_2" />
              </div>

              <!-- Step 3: Employment -->
              <div v-show="currentStep === 3" class="space-y-6">
                <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-900 pb-2">Employment & income</h2>
                <h3 class="text-base font-bold text-gray-800 border-b border-gray-300 pb-1">Current employment</h3>
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Employer name</label>
                    <input v-model="form.employer" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Occupation / position</label>
                    <input v-model="form.occupation" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Employer address</label>
                  <input v-model="form.employer_address" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Supervisor name</label>
                    <input v-model="form.supervisor" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Employer phone</label>
                    <input v-model="form.employer_phone" type="tel" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Employment start date</label>
                    <input v-model="form.employment_start" type="month" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Gross monthly income</label>
                    <input v-model="form.monthly_income" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Employment type (e.g. Full-Time, Part-Time, Self-Employed)</label>
                  <input v-model="form.employment_type" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>

                <h3 class="text-base font-bold text-gray-800 mt-6 border-b border-gray-300 pb-1">Previous employment</h3>
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Employer name</label>
                    <input v-model="form.prev_employer" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Occupation / position</label>
                    <input v-model="form.prev_occupation" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                </div>
                <div class="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Employer phone</label>
                    <input v-model="form.prev_employer_phone" type="tel" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">From date</label>
                    <input v-model="form.prev_employment_start" type="month" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">To date</label>
                    <input v-model="form.prev_employment_end" type="month" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                </div>

                <h3 class="text-base font-bold text-gray-800 mt-6 border-b border-gray-300 pb-1">Additional income</h3>
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Other income (pension, investments, etc.)</label>
                    <input v-model="form.other_income_source" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Monthly amount</label>
                    <input v-model="form.other_income_amount" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                </div>
              </div>

              <!-- Step 4: Household -->
              <div v-show="currentStep === 4" class="space-y-6">
                <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-900 pb-2">Vehicle information</h2>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Do you own a vehicle?</label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2">
                      <input v-model="form.vehicle_owned" type="radio" value="yes" class="rounded-full border-gray-300 text-primary focus:ring-primary" />
                      <span>Yes</span>
                    </label>
                    <label class="flex items-center gap-2">
                      <input v-model="form.vehicle_owned" type="radio" value="no" class="rounded-full border-gray-300 text-primary focus:ring-primary" />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                <div class="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Make / model</label>
                    <input v-model="form.vehicle_make" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input v-model="form.vehicle_year" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">License plate</label>
                    <input v-model="form.vehicle_plate" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                </div>

                <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-900 pb-2 mt-8">Spouse / co-applicant</h2>
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                    <input v-model="form.spouse_name" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
                    <input v-model="form.spouse_dob" type="date" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input v-model="form.spouse_phone" type="tel" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input v-model="form.spouse_email" type="email" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Employer</label>
                    <input v-model="form.spouse_employer" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                    <input v-model="form.spouse_occupation" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Employer phone</label>
                    <input v-model="form.spouse_employer_phone" type="tel" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Gross monthly income</label>
                    <input v-model="form.spouse_income" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                </div>

                <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-900 pb-2 mt-8">Other occupants</h2>
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Number of adults (18+)</label>
                    <input v-model.number="form.num_adults" type="number" min="0" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Number of children (under 18)</label>
                    <input v-model.number="form.num_children" type="number" min="0" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                </div>
                <div class="space-y-4">
                  <div v-for="n in 3" :key="n" class="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Occupant {{ n }} name</label>
                      <input v-model="form[`occupant${n}_name`]" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                      <input v-model="form[`occupant${n}_relationship`]" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input v-model="form[`occupant${n}_age`]" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    </div>
                  </div>
                </div>

                <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-900 pb-2 mt-8">Pets & smoking</h2>
                <div class="flex flex-wrap gap-8">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Pets?</label>
                    <div class="flex gap-4">
                      <label class="flex items-center gap-2"><input v-model="form.pets" type="radio" value="yes" class="rounded-full border-gray-300 text-primary focus:ring-primary" /> Yes</label>
                      <label class="flex items-center gap-2"><input v-model="form.pets" type="radio" value="no" class="rounded-full border-gray-300 text-primary focus:ring-primary" /> No</label>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Smokers?</label>
                    <div class="flex gap-4">
                      <label class="flex items-center gap-2"><input v-model="form.smokers" type="radio" value="yes" class="rounded-full border-gray-300 text-primary focus:ring-primary" /> Yes</label>
                      <label class="flex items-center gap-2"><input v-model="form.smokers" type="radio" value="no" class="rounded-full border-gray-300 text-primary focus:ring-primary" /> No</label>
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Pet details (type, breed, weight, age)</label>
                  <textarea v-model="form.pet_details" rows="3" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
              </div>

              <!-- Step 5: Contacts & references -->
              <div v-show="currentStep === 5" class="space-y-6">
                <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-900 pb-2">Emergency contact</h2>
                <div class="grid gap-4 sm:grid-cols-2">
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Name</label><input v-model="form.emergency_name" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" /></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Relationship</label><input v-model="form.emergency_relationship" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" /></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Phone</label><input v-model="form.emergency_phone" type="tel" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" /></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Alternate phone</label><input v-model="form.emergency_alt_phone" type="tel" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" /></div>
                </div>
                <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-900 pb-2 mt-8">References (3, not family)</h2>
                <div v-for="r in 3" :key="r" class="space-y-4 mt-4">
                  <h3 class="text-base font-bold text-gray-700">Reference {{ r }}</h3>
                  <div class="grid gap-4 sm:grid-cols-2">
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Name</label><input v-model="form[`ref${r}_name`]" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" /></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Relationship</label><input v-model="form[`ref${r}_relationship`]" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" /></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Phone</label><input v-model="form[`ref${r}_phone`]" type="tel" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" /></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Email</label><input v-model="form[`ref${r}_email`]" type="email" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" /></div>
                  </div>
                </div>
              </div>

              <!-- Step 6: Additional info -->
              <div v-show="currentStep === 6" class="space-y-6">
                <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-900 pb-2">Additional questions</h2>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Ever been evicted?</label>
                    <div class="flex gap-4 mb-2">
                      <label class="flex items-center gap-2"><input v-model="form.evicted" type="radio" value="yes" class="rounded-full border-gray-300 text-primary focus:ring-primary" /> Yes</label>
                      <label class="flex items-center gap-2"><input v-model="form.evicted" type="radio" value="no" class="rounded-full border-gray-300 text-primary focus:ring-primary" /> No</label>
                    </div>
                    <textarea v-model="form.evicted_explanation" placeholder="If yes, explain" rows="2" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Ever broken a lease?</label>
                    <div class="flex gap-4 mb-2">
                      <label class="flex items-center gap-2"><input v-model="form.broken_lease" type="radio" value="yes" class="rounded-full border-gray-300 text-primary focus:ring-primary" /> Yes</label>
                      <label class="flex items-center gap-2"><input v-model="form.broken_lease" type="radio" value="no" class="rounded-full border-gray-300 text-primary focus:ring-primary" /> No</label>
                    </div>
                    <textarea v-model="form.broken_lease_explanation" placeholder="If yes, explain" rows="2" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Ever filed for bankruptcy?</label>
                    <div class="flex gap-4 mb-2">
                      <label class="flex items-center gap-2"><input v-model="form.bankruptcy" type="radio" value="yes" class="rounded-full border-gray-300 text-primary focus:ring-primary" /> Yes</label>
                      <label class="flex items-center gap-2"><input v-model="form.bankruptcy" type="radio" value="no" class="rounded-full border-gray-300 text-primary focus:ring-primary" /> No</label>
                    </div>
                    <input v-model="form.bankruptcy_details" type="text" placeholder="If yes, when and status" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Ever convicted of a criminal offense?</label>
                    <div class="flex gap-4 mb-2">
                      <label class="flex items-center gap-2"><input v-model="form.criminal" type="radio" value="yes" class="rounded-full border-gray-300 text-primary focus:ring-primary" /> Yes</label>
                      <label class="flex items-center gap-2"><input v-model="form.criminal" type="radio" value="no" class="rounded-full border-gray-300 text-primary focus:ring-primary" /> No</label>
                    </div>
                    <textarea v-model="form.criminal_explanation" placeholder="If yes, explain" rows="2" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Renters insurance?</label>
                    <div class="flex flex-wrap gap-4">
                      <label class="flex items-center gap-2"><input v-model="form.insurance" type="radio" value="yes" class="rounded-full border-gray-300 text-primary focus:ring-primary" /> Yes</label>
                      <label class="flex items-center gap-2"><input v-model="form.insurance" type="radio" value="no" class="rounded-full border-gray-300 text-primary focus:ring-primary" /> No</label>
                      <label class="flex items-center gap-2"><input v-model="form.insurance" type="radio" value="will_obtain" class="rounded-full border-gray-300 text-primary focus:ring-primary" /> Will obtain</label>
                    </div>
                  </div>
                </div>
                <div class="mt-6">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Any other information you’d like to provide?</label>
                  <textarea v-model="form.additional_info" rows="4" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
              </div>

              <!-- Step 7: Signatures -->
              <div v-show="currentStep === 7" class="space-y-6">
                <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-900 pb-2">Declarations and authorization</h2>
                <div class="text-sm text-gray-700 space-y-2 max-h-48 overflow-y-auto rounded border border-gray-100 p-4 bg-gray-50">
                  <p><strong>I/We declare and certify that:</strong></p>
                  <ul class="list-disc pl-5 space-y-1">
                    <li>All information provided is true, accurate, and complete.</li>
                    <li>I/We authorize verification of all information, including employment, income, rental history, and references.</li>
                    <li>I/We authorize credit reports, criminal background checks, and eviction history searches.</li>
                    <li>False or incomplete information may result in rejection or termination of tenancy (Residential Tenancy Act, BC).</li>
                    <li>I/We consent to collection, use, and disclosure of personal information per PIPA (BC).</li>
                    <li>This application is an offer to rent; the landlord may accept or reject it.</li>
                    <li>Any application fee paid is non-refundable.</li>
                  </ul>
                </div>

                <h3 class="text-base font-bold text-gray-800 mt-6">Primary applicant signature</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
                    <input
                      v-model="form.primary_signature_name"
                      type="text"
                      class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      :class="{ 'border-red-500': errors.primary_signature_name }"
                    />
                    <p v-if="errors.primary_signature_name" class="text-red-500 text-xs mt-1">{{ errors.primary_signature_name }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Draw signature or type below *</label>
                    <div ref="primaryPadWrap" class="border border-gray-200 rounded-lg overflow-hidden bg-white" style="max-width: 400px;">
                      <canvas ref="primaryCanvas" width="400" height="150" class="w-full touch-none" />
                    </div>
                    <div class="mt-2 flex gap-2">
                      <button type="button" class="text-sm px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200" @click="clearPrimarySig">
                        Clear signature
                      </button>
                    </div>
                    <input
                      v-model="form.primary_typed_signature"
                      type="text"
                      placeholder="Or type full legal name"
                      class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary max-w-md"
                      :class="{ 'border-red-500': errors.primary_signature }"
                    />
                    <p v-if="errors.primary_signature" class="text-red-500 text-xs mt-1">{{ errors.primary_signature }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input v-model="form.primary_signature_date" type="date" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary max-w-xs" />
                  </div>
                </div>

                <h3 class="text-base font-bold text-gray-800 mt-8">Co-applicant signature (if applicable)</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                    <input v-model="form.co_signature_name" type="text" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Draw signature or type below</label>
                    <div ref="coPadWrap" class="border border-gray-200 rounded-lg overflow-hidden bg-white" style="max-width: 400px;">
                      <canvas ref="coCanvas" width="400" height="150" class="w-full touch-none" />
                    </div>
                    <div class="mt-2 flex gap-2">
                      <button type="button" class="text-sm px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200" @click="clearCoSig">
                        Clear signature
                      </button>
                    </div>
                    <input v-model="form.co_typed_signature" type="text" placeholder="Or type full legal name" class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary max-w-md" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input v-model="form.co_signature_date" type="date" class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary max-w-xs" />
                  </div>
                </div>
              </div>

              <!-- Navigation -->
              <div class="flex flex-wrap items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-100">
                <button
                  v-if="currentStep > 1"
                  type="button"
                  class="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-medium"
                  @click="previousStep"
                >
                  Previous
                </button>
                <div v-else />
                <div class="flex gap-3">
                  <button
                    type="button"
                    class="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
                    @click="saveProgress"
                  >
                    Save progress
                  </button>
                  <button
                    v-if="currentStep < totalSteps"
                    type="button"
                    class="px-5 py-2.5 rounded-lg bg-primary text-white hover:opacity-90 font-medium"
                    @click="nextStep"
                  >
                    Next
                  </button>
                  <button
                    v-else
                    type="submit"
                    class="px-5 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium"
                    :disabled="generatingPdf"
                  >
                    {{ generatingPdf ? 'Generating…' : 'Generate & download PDF' }}
                  </button>
                </div>
              </div>
            </form>

            <div class="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                class="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                @click="loadSampleData"
              >
                Load sample data
              </button>
              <button
                type="button"
                class="text-sm px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                @click="clearForm"
              >
                Clear form
              </button>
            </div>
          </div>
        </ClientOnly>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { reactive, ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import ResidenceBlock from '~/components/tools/ResidenceBlock.vue'

useSeoMeta({
  title: 'Rental Application - Tools - Prishan Fernando',
  description: 'Multi-step residential rental application form. Save progress in browser and generate a PDF when complete.'
})

const STORAGE_KEY = 'rentalApplicationProgress'
const totalSteps = 7
const stepTitles = [
  'Property & Personal',
  'Residence History',
  'Employment & Income',
  'Household Info',
  'Contacts & References',
  'Additional Info',
  'Review & Sign'
]

const defaultForm = () => ({
  property_address: '', move_in_date: '', lease_term: '',
  full_name: '', birthdate: '', marital_status: '', phone: '', cell: '', email: '', license: '', license_province: '',
  current_address: '', current_city: '', current_province: '', current_postal: '', current_landlord: '', current_landlord_phone: '', current_rent: '', current_start: '', current_end: '', reason_leaving: '',
  prev_address_1: '', prev_city_1: '', prev_province_1: '', prev_postal_1: '', prev_landlord_1: '', prev_landlord_phone_1: '', prev_rent_1: '', prev_start_1: '', prev_end_1: '',
  prev_address_2: '', prev_city_2: '', prev_province_2: '', prev_postal_2: '', prev_landlord_2: '', prev_landlord_phone_2: '', prev_rent_2: '', prev_start_2: '', prev_end_2: '',
  employer: '', occupation: '', employer_address: '', supervisor: '', employer_phone: '', employment_start: '', monthly_income: '', employment_type: '',
  prev_employer: '', prev_occupation: '', prev_employer_phone: '', prev_employment_start: '', prev_employment_end: '',
  other_income_source: '', other_income_amount: '',
  vehicle_owned: 'no', vehicle_make: '', vehicle_year: '', vehicle_plate: '',
  spouse_name: '', spouse_dob: '', spouse_phone: '', spouse_email: '', spouse_employer: '', spouse_occupation: '', spouse_employer_phone: '', spouse_income: '',
  num_adults: 0, num_children: 0,
  occupant1_name: '', occupant1_relationship: '', occupant1_age: '', occupant2_name: '', occupant2_relationship: '', occupant2_age: '', occupant3_name: '', occupant3_relationship: '', occupant3_age: '',
  pets: 'no', pet_details: '', smokers: 'no',
  emergency_name: '', emergency_relationship: '', emergency_phone: '', emergency_alt_phone: '',
  ref1_name: '', ref1_relationship: '', ref1_phone: '', ref1_email: '', ref2_name: '', ref2_relationship: '', ref2_phone: '', ref2_email: '', ref3_name: '', ref3_relationship: '', ref3_phone: '', ref3_email: '',
  evicted: 'no', evicted_explanation: '', broken_lease: 'no', broken_lease_explanation: '', bankruptcy: 'no', bankruptcy_details: '', criminal: 'no', criminal_explanation: '', insurance: 'yes', additional_info: '',
  primary_signature_name: '', primary_typed_signature: '', primary_signature_date: '', co_signature_name: '', co_typed_signature: '', co_signature_date: ''
})

const form = reactive(defaultForm())
const currentStep = ref(1)
const errors = reactive({})
const primaryCanvas = ref(null)
const coCanvas = ref(null)
const primarySigPad = ref(null)
const coSigPad = ref(null)
const primarySignatureData = ref(null)
const coSignatureData = ref(null)
const generatingPdf = ref(false)

const progressPercent = computed(() => Math.round((currentStep.value / totalSteps) * 100))

const stepHasData = (step) => {
  const stepIds = {
    1: ['property_address', 'full_name', 'move_in_date', 'lease_term', 'phone', 'email'],
    2: ['current_address', 'current_city', 'prev_address_1'],
    3: ['employer', 'occupation', 'monthly_income'],
    4: ['vehicle_owned', 'spouse_name', 'pets', 'smokers'],
    5: ['emergency_name', 'ref1_name'],
    6: ['evicted', 'broken_lease', 'insurance'],
    7: ['primary_signature_name', 'primary_typed_signature']
  }
  const ids = stepIds[step] || []
  return ids.some(id => {
    const v = form[id]
    return v !== undefined && v !== null && String(v).trim() !== ''
  })
}

const highestCompletedStep = computed(() => {
  let h = 1
  for (let i = 1; i <= totalSteps; i++) {
    if (stepHasData(i)) h = i
  }
  return h
})

function goToStep(step) {
  if (step < 1 || step > totalSteps) return
  currentStep.value = step
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  if (step === 7) initSignaturePads()
  saveProgress()
}

function validateStep(step) {
  const err = {}
  if (step === 1) {
    if (!String(form.full_name || '').trim()) err.full_name = 'Full legal name is required'
    if (!String(form.property_address || '').trim()) err.property_address = 'Property address is required'
  }
  if (step === 7) {
    if (!String(form.primary_signature_name || '').trim()) err.primary_signature_name = 'Primary applicant full name is required'
    const hasSig = (primarySigPad.value && !primarySigPad.value.isEmpty()) || String(form.primary_typed_signature || '').trim()
    if (!hasSig) err.primary_signature = 'Signature is required (draw or type)'
  }
  Object.keys(errors).forEach(k => delete errors[k])
  Object.assign(errors, err)
  return Object.keys(err).length === 0
}

function nextStep() {
  if (!validateStep(currentStep.value)) return
  if (currentStep.value < totalSteps) goToStep(currentStep.value + 1)
}

function previousStep() {
  if (currentStep.value > 1) goToStep(currentStep.value - 1)
}

function saveProgress() {
  if (typeof localStorage === 'undefined') return
  const data = { ...form, currentStep: currentStep.value }
  if (primarySigPad.value && !primarySigPad.value.isEmpty()) {
    data.primarySignatureData = primarySigPad.value.toDataURL()
  }
  if (coSigPad.value && !coSigPad.value.isEmpty()) {
    data.coSignatureData = coSigPad.value.toDataURL()
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function loadProgress() {
  if (typeof localStorage === 'undefined') return
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return
  try {
    const data = JSON.parse(raw)
    const step = data.currentStep
    Object.keys(defaultForm()).forEach(key => {
      if (key in data && !['currentStep', 'primarySignatureData', 'coSignatureData'].includes(key)) {
        form[key] = data[key] ?? defaultForm()[key]
      }
    })
    if (data.primarySignatureData) primarySignatureData.value = data.primarySignatureData
    if (data.coSignatureData) coSignatureData.value = data.coSignatureData
    if (step && step >= 1 && step <= totalSteps) currentStep.value = step
  } catch (_) {}
}

let saveDebounce
watch(form, () => {
  clearTimeout(saveDebounce)
  saveDebounce = setTimeout(saveProgress, 1000)
}, { deep: true })

function initSignaturePads() {
  if (typeof window === 'undefined') return
  import('signature_pad').then(({ default: SignaturePad }) => {
    if (primaryCanvas.value && !primarySigPad.value) {
      const canvas = primaryCanvas.value
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      const w = rect.width || 400
      const h = rect.height || 150
      canvas.width = w * dpr
      canvas.height = h * dpr
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)
      primarySigPad.value = new SignaturePad(canvas, { backgroundColor: 'rgb(255,255,255)', penColor: 'rgb(0,0,0)' })
      primarySigPad.value.addEventListener('endStroke', saveProgress)
      if (primarySignatureData.value) {
        try { primarySigPad.value.fromDataURL(primarySignatureData.value) } catch (_) {}
      }
    }
    if (coCanvas.value && !coSigPad.value) {
      const canvas = coCanvas.value
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      const w = rect.width || 400
      const h = rect.height || 150
      canvas.width = w * dpr
      canvas.height = h * dpr
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)
      coSigPad.value = new SignaturePad(canvas, { backgroundColor: 'rgb(255,255,255)', penColor: 'rgb(0,0,0)' })
      coSigPad.value.addEventListener('endStroke', saveProgress)
      if (coSignatureData.value) {
        try { coSigPad.value.fromDataURL(coSignatureData.value) } catch (_) {}
      }
    }
  })
}

function clearPrimarySig() {
  if (primarySigPad.value) {
    primarySigPad.value.clear()
    saveProgress()
  }
}

function clearCoSig() {
  if (coSigPad.value) {
    coSigPad.value.clear()
    saveProgress()
  }
}

const sampleData = {
  property_address: '10488 138A St, Surrey, BC V3T 4L3', move_in_date: '2026-02', lease_term: '2',
  full_name: 'John Michael Smith', birthdate: '1985-06-15', marital_status: 'Married', phone: '778-233-0176', cell: '604-555-1234', email: 'john.smith@email.com', license: 'DL12345678', license_province: 'BC',
  current_address: '123 Main Street, Apt 4B', current_city: 'Vancouver', current_province: 'BC', current_postal: 'V6B 1A1', current_landlord: 'ABC Property Management', current_landlord_phone: '604-555-0100', current_rent: '1850', current_start: '2020-03-01', current_end: '2026-01-31', reason_leaving: 'Looking for larger space closer to work',
  prev_address_1: '456 Oak Avenue', prev_city_1: 'Burnaby', prev_province_1: 'BC', prev_postal_1: 'V5H 2K3', prev_landlord_1: 'Jane Doe', prev_landlord_phone_1: '604-555-0200', prev_rent_1: '1650', prev_start_1: '2017-05-01', prev_end_1: '2020-02-28',
  prev_address_2: '789 Pine Street, Unit 12', prev_city_2: 'Richmond', prev_province_2: 'BC', prev_postal_2: 'V7E 3M5', prev_landlord_2: 'XYZ Rentals Inc.', prev_landlord_phone_2: '604-555-0300', prev_rent_2: '1500', prev_start_2: '2014-08-01', prev_end_2: '2017-04-30',
  employer: 'Tech Solutions Inc.', occupation: 'Software Engineer', employer_address: '1000 Tech Boulevard, Vancouver, BC V6B 2C3', supervisor: 'Sarah Johnson', employer_phone: '604-555-0400', employment_start: '2019-03', monthly_income: '7500', employment_type: 'Full-Time',
  prev_employer: 'Digital Innovations Ltd.', prev_occupation: 'Junior Developer', prev_employer_phone: '604-555-0500', prev_employment_start: '2016-06', prev_employment_end: '2019-02',
  other_income_source: 'Investment dividends', other_income_amount: '500',
  vehicle_owned: 'yes', vehicle_make: 'Honda Civic', vehicle_year: '2020', vehicle_plate: 'ABC 123',
  spouse_name: 'Jane Marie Smith', spouse_dob: '1987-09-22', spouse_phone: '778-233-0177', spouse_email: 'jane.smith@email.com', spouse_employer: 'Healthcare Services BC', spouse_occupation: 'Registered Nurse', spouse_employer_phone: '604-555-0600', spouse_income: '6200',
  num_adults: 0, num_children: 2, occupant1_name: 'Emily Smith', occupant1_relationship: 'Daughter', occupant1_age: '8', occupant2_name: 'Michael Smith', occupant2_relationship: 'Son', occupant2_age: '5', occupant3_name: '', occupant3_relationship: '', occupant3_age: '',
  pets: 'yes', pet_details: '1 dog - Golden Retriever, 3 years old, 65 lbs, well-trained and housebroken', smokers: 'no',
  emergency_name: 'Robert Anderson', emergency_relationship: 'Brother', emergency_phone: '604-555-0700', emergency_alt_phone: '778-555-0800',
  ref1_name: 'David Chen', ref1_relationship: 'Former Colleague', ref1_phone: '604-555-0900', ref1_email: 'david.chen@email.com',
  ref2_name: 'Lisa Williams', ref2_relationship: 'Friend', ref2_phone: '604-555-1000', ref2_email: 'lisa.williams@email.com',
  ref3_name: 'Mark Thompson', ref3_relationship: 'Former Neighbor', ref3_phone: '604-555-1100', ref3_email: 'mark.thompson@email.com',
  evicted: 'no', evicted_explanation: '', broken_lease: 'no', broken_lease_explanation: '', bankruptcy: 'no', bankruptcy_details: '', criminal: 'no', criminal_explanation: '', insurance: 'yes',
  additional_info: 'We are a responsible family looking for a long-term rental. We have excellent rental history and references.',
  primary_signature_name: 'John Michael Smith', primary_typed_signature: 'John Michael Smith', primary_signature_date: new Date().toISOString().split('T')[0],
  co_signature_name: 'Jane Marie Smith', co_typed_signature: 'Jane Marie Smith', co_signature_date: new Date().toISOString().split('T')[0]
}

function loadSampleData() {
  Object.assign(form, sampleData)
  saveProgress()
}

function clearForm() {
  if (typeof window !== 'undefined' && !window.confirm('Clear all form data?')) return
  Object.assign(form, defaultForm())
  const today = new Date().toISOString().split('T')[0]
  form.primary_signature_date = today
  form.co_signature_date = today
  if (primarySigPad.value) primarySigPad.value.clear()
  if (coSigPad.value) coSigPad.value.clear()
  primarySignatureData.value = null
  coSignatureData.value = null
  currentStep.value = 1
  if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY)
}

function formatDate(val) {
  if (!val || !String(val).trim()) return ''
  const s = String(val).trim()
  if (/^\d{4}-\d{2}$/.test(s)) {
    const [y, m] = s.split('-')
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return `${months[parseInt(m) - 1]} ${y}`
  }
  try {
    return new Date(s).toLocaleDateString('en-CA')
  } catch {
    return s
  }
}

function getVal(key) {
  const v = form[key]
  return v !== undefined && v !== null ? String(v).trim() : ''
}

function getRadio(key) {
  const v = form[key]
  return v ? String(v) : ''
}

async function generatePdf() {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable')
  ])
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPos = 15
  const margin = 12
  const topMargin = 15
  const bottomMargin = 25

  function checkPageBreak(required = 20) {
    if (yPos + required > pageHeight - bottomMargin) {
      doc.addPage()
      yPos = topMargin
    }
  }

  function sectionHeader(title) {
    checkPageBreak(12)
    yPos += 3
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.setFillColor(240, 240, 240)
    doc.rect(margin, yPos - 3, pageWidth - 2 * margin, 7, 'F')
    doc.setTextColor(44, 62, 80)
    doc.text(title, margin + 3, yPos + 2)
    yPos += 10
    doc.setFontSize(9)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(0, 0, 0)
  }

  function addTable(body, startY) {
    const rows = body.map(r => [r[0], r[1] || '']).filter(r => r[1] || r[0])
    if (!rows.length) return startY
    autoTable(doc, {
      startY,
      body: rows,
      styles: { fontSize: 8.5, cellPadding: 2.5, lineColor: [200, 200, 200] },
      columnStyles: { 0: { cellWidth: 75, fontStyle: 'bold' }, 1: { cellWidth: 'auto' } },
      margin: { left: margin, right: margin },
      showHead: false
    })
    return doc.lastAutoTable.finalY + 3
  }

  doc.setFontSize(18)
  doc.setFont(undefined, 'bold')
  doc.setTextColor(44, 62, 80)
  doc.text('RESIDENTIAL RENTAL APPLICATION', pageWidth / 2, yPos, { align: 'center' })
  yPos += 10
  doc.setFontSize(9)
  doc.setFont(undefined, 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text('Please complete all sections accurately and legibly', pageWidth / 2, yPos, { align: 'center' })
  yPos += 14

  sectionHeader('PROPERTY INFORMATION')
  yPos = addTable([
    ['Property Address', getVal('property_address')],
    ['Move-In Date', formatDate(getVal('move_in_date'))],
    ['Lease Term', getVal('lease_term') ? getVal('lease_term') + ' year(s)' : '']
  ], yPos)

  sectionHeader('PERSONAL INFORMATION - PRIMARY APPLICANT')
  yPos = addTable([
    ['Full Legal Name', getVal('full_name')], ['Date of Birth', formatDate(getVal('birthdate'))], ['Marital Status', getVal('marital_status')],
    ['Primary Phone', getVal('phone')], ['Alternate Phone', getVal('cell')], ['Email', getVal('email')],
    ["Driver's License / ID", getVal('license')], ['Province/State', getVal('license_province')]
  ], yPos)

  sectionHeader('RESIDENCE HISTORY - Current')
  yPos = addTable([
    ['Address', getVal('current_address')],
    ['City, Province, Postal', [getVal('current_city'), getVal('current_province'), getVal('current_postal')].filter(Boolean).join(', ')],
    ['Landlord', getVal('current_landlord')], ['Landlord Phone', getVal('current_landlord_phone')],
    ['Monthly Rent', getVal('current_rent') ? '$' + getVal('current_rent') : ''], ['Move-In', formatDate(getVal('current_start'))], ['Move-Out', formatDate(getVal('current_end'))],
    ['Reason for Leaving', getVal('reason_leaving')]
  ], yPos)

  sectionHeader('Previous Address #1')
  yPos = addTable([
    ['Address', getVal('prev_address_1')],
    ['City, Province, Postal', [getVal('prev_city_1'), getVal('prev_province_1'), getVal('prev_postal_1')].filter(Boolean).join(', ')],
    ['Landlord', getVal('prev_landlord_1')], ['Phone', getVal('prev_landlord_phone_1')],
    ['Rent', getVal('prev_rent_1') ? '$' + getVal('prev_rent_1') : ''], ['From', formatDate(getVal('prev_start_1'))], ['To', formatDate(getVal('prev_end_1'))]
  ], yPos)

  sectionHeader('Previous Address #2')
  yPos = addTable([
    ['Address', getVal('prev_address_2')],
    ['City, Province, Postal', [getVal('prev_city_2'), getVal('prev_province_2'), getVal('prev_postal_2')].filter(Boolean).join(', ')],
    ['Landlord', getVal('prev_landlord_2')], ['Phone', getVal('prev_landlord_phone_2')],
    ['Rent', getVal('prev_rent_2') ? '$' + getVal('prev_rent_2') : ''], ['From', formatDate(getVal('prev_start_2'))], ['To', formatDate(getVal('prev_end_2'))]
  ], yPos)

  sectionHeader('EMPLOYMENT & INCOME')
  yPos = addTable([
    ['Employer', getVal('employer')], ['Occupation', getVal('occupation')], ['Employer Address', getVal('employer_address')],
    ['Supervisor', getVal('supervisor')], ['Employer Phone', getVal('employer_phone')],
    ['Start Date', formatDate(getVal('employment_start'))], ['Gross Monthly Income', getVal('monthly_income') ? '$' + getVal('monthly_income') : ''], ['Type', getVal('employment_type')]
  ], yPos)
  yPos = addTable([
    ['Previous Employer', getVal('prev_employer')], ['Occupation', getVal('prev_occupation')],
    ['Phone', getVal('prev_employer_phone')], ['From', formatDate(getVal('prev_employment_start'))], ['To', formatDate(getVal('prev_employment_end'))]
  ], yPos)
  yPos = addTable([
    ['Other Income', getVal('other_income_source')], ['Monthly Amount', getVal('other_income_amount') ? '$' + getVal('other_income_amount') : '']
  ], yPos)

  sectionHeader('VEHICLE & OCCUPANTS')
  yPos = addTable([
    ['Own Vehicle', getRadio('vehicle_owned') ? getRadio('vehicle_owned').charAt(0).toUpperCase() + getRadio('vehicle_owned').slice(1) : ''],
    ['Make/Model', getVal('vehicle_make')], ['Year', getVal('vehicle_year')], ['Plate', getVal('vehicle_plate')]
  ], yPos)
  yPos = addTable([
    ['Spouse Name', getVal('spouse_name')], ['DOB', formatDate(getVal('spouse_dob'))], ['Phone', getVal('spouse_phone')], ['Email', getVal('spouse_email')],
    ['Employer', getVal('spouse_employer')], ['Occupation', getVal('spouse_occupation')], ['Income', getVal('spouse_income') ? '$' + getVal('spouse_income') : '']
  ], yPos)
  yPos = addTable([
    ['Adults (18+)', String(form.num_adults)], ['Children', String(form.num_children)]
  ], yPos)
  for (let i = 1; i <= 3; i++) {
    const name = getVal(`occupant${i}_name`)
    if (name) yPos = addTable([['Occupant ' + i, `${name} (${getVal(`occupant${i}_relationship`)}, Age: ${getVal(`occupant${i}_age`)})`]], yPos)
  }
  sectionHeader('PETS & SMOKING')
  yPos = addTable([
    ['Pets', getRadio('pets') ? getRadio('pets').charAt(0).toUpperCase() + getRadio('pets').slice(1) : ''],
    ['Pet Details', getVal('pet_details')],
    ['Smokers', getRadio('smokers') ? getRadio('smokers').charAt(0).toUpperCase() + getRadio('smokers').slice(1) : '']
  ], yPos)

  sectionHeader('EMERGENCY & REFERENCES')
  yPos = addTable([
    ['Name', getVal('emergency_name')], ['Relationship', getVal('emergency_relationship')],
    ['Phone', getVal('emergency_phone')], ['Alt Phone', getVal('emergency_alt_phone')]
  ], yPos)
  for (let i = 1; i <= 3; i++) {
    yPos = addTable([
      ['Ref ' + i + ' Name', getVal(`ref${i}_name`)], ['Relationship', getVal(`ref${i}_relationship`)],
      ['Phone', getVal(`ref${i}_phone`)], ['Email', getVal(`ref${i}_email`)]
    ], yPos)
  }

  sectionHeader('ADDITIONAL QUESTIONS')
  yPos = addTable([
    ['Evicted?', getRadio('evicted')], ['Eviction Explain', getVal('evicted_explanation')],
    ['Broken Lease?', getRadio('broken_lease')], ['Broken Lease Explain', getVal('broken_lease_explanation')],
    ['Bankruptcy?', getRadio('bankruptcy')], ['Bankruptcy Details', getVal('bankruptcy_details')],
    ['Criminal?', getRadio('criminal')], ['Criminal Explain', getVal('criminal_explanation')],
    ['Insurance', getRadio('insurance') ? getRadio('insurance').replace('_', ' ') : '']
  ], yPos)
  checkPageBreak(15)
  doc.setFontSize(8.5)
  const addInfo = getVal('additional_info')
  if (addInfo) {
    const lines = doc.splitTextToSize(addInfo, pageWidth - 2 * margin)
    doc.text(lines, margin, yPos)
    yPos += lines.length * 4.5
  } else {
    doc.text('No additional information.', margin, yPos)
    yPos += 6
  }

  sectionHeader('SIGNATURES')
  yPos += 6
  doc.setFontSize(10)
  doc.setFont(undefined, 'bold')
  doc.text('Primary Applicant: ' + getVal('primary_signature_name'), margin, yPos)
  yPos += 8
  if (primarySigPad.value && !primarySigPad.value.isEmpty()) {
    try {
      doc.addImage(primarySigPad.value.toDataURL(), 'PNG', margin, yPos, 70, 25)
      yPos += 30
    } catch {
      doc.setFont(undefined, 'italic')
      doc.text(getVal('primary_typed_signature') || 'Signature', margin, yPos + 6)
      yPos += 12
    }
  } else {
    doc.setFont(undefined, 'italic')
    doc.text(getVal('primary_typed_signature') || 'Signature', margin, yPos + 6)
    yPos += 12
  }
  doc.setFont(undefined, 'normal')
  doc.setFontSize(8.5)
  doc.text('Date: ' + (formatDate(getVal('primary_signature_date')) || new Date().toLocaleDateString()), margin, yPos)

  if (getVal('co_signature_name') || (coSigPad.value && !coSigPad.value.isEmpty()) || getVal('co_typed_signature')) {
    checkPageBreak(40)
    yPos += 14
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text('Co-Applicant: ' + getVal('co_signature_name'), margin, yPos)
    yPos += 8
    if (coSigPad.value && !coSigPad.value.isEmpty()) {
      try {
        doc.addImage(coSigPad.value.toDataURL(), 'PNG', margin, yPos, 70, 25)
        yPos += 30
      } catch {
        doc.setFont(undefined, 'italic')
        doc.text(getVal('co_typed_signature') || 'Signature', margin, yPos + 6)
        yPos += 12
      }
    } else {
      doc.setFont(undefined, 'italic')
      doc.text(getVal('co_typed_signature') || 'Signature', margin, yPos + 6)
      yPos += 12
    }
    doc.setFont(undefined, 'normal')
    doc.setFontSize(8.5)
    doc.text('Date: ' + (formatDate(getVal('co_signature_date')) || new Date().toLocaleDateString()), margin, yPos)
  }

  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text('Page ' + i + ' of ' + totalPages, pageWidth / 2, pageHeight - 10, { align: 'center' })
    doc.setTextColor(0, 0, 0)
  }

  doc.save('Residential-Rental-Application.pdf')
  if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY)
}

async function onSubmit() {
  for (let s = 1; s <= totalSteps; s++) {
    if (!validateStep(s)) {
      goToStep(s)
      return
    }
  }
  generatingPdf.value = true
  try {
    await generatePdf()
    if (typeof window !== 'undefined') window.alert('PDF generated successfully.')
  } finally {
    generatingPdf.value = false
  }
}

onMounted(() => {
  const today = new Date().toISOString().split('T')[0]
  if (!form.primary_signature_date) form.primary_signature_date = today
  if (!form.co_signature_date) form.co_signature_date = today
  loadProgress()
  if (currentStep.value === 7) initSignaturePads()
})
</script>
