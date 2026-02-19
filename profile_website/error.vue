<template>
  <div class="min-h-screen flex flex-col font-sans text-gray-800 bg-inverse">
    <LayoutHeader />
    <main class="flex-grow">
      <section class="relative bg-gradient-to-br from-white via-inverse to-secondary/10 py-16 md:py-24 overflow-hidden">
        <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-2xl mx-auto text-center">
            <!-- Status badge -->
            <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span class="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span>{{ is404 ? 'Page not found' : 'Something went wrong' }}</span>
            </div>

            <!-- Big status number -->
            <p class="text-8xl md:text-9xl font-black text-primary/20 mb-4 tracking-tighter leading-none">
              {{ error?.statusCode || 500 }}
            </p>

            <h1 class="text-4xl md:text-5xl font-black text-primary mb-6 tracking-tight">
              {{ is404 ? 'Page not found' : 'Oops!' }}
            </h1>

            <p class="text-xl text-gray-600 mb-10 max-w-md mx-auto">
              {{ is404
                ? "The page you're looking for doesn't exist or has been moved."
                : (error?.message || 'An unexpected error occurred. Please try again.') }}
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <NuxtLink
                to="/"
                class="group inline-flex items-center px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
              >
                Back to Home
                <svg class="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </NuxtLink>
              <button
                v-if="!is404"
                type="button"
                class="inline-flex items-center px-8 py-4 bg-white text-primary border border-gray-100 font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-inverse transition-all duration-300"
                @click="handleTryAgain"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
    <LayoutFooter />
  </div>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: null
  }
})

const is404 = computed(() => props.error?.statusCode === 404)

function handleTryAgain() {
  clearError({ redirect: '/' })
}
</script>
