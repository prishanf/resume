<template>
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="text-2xl font-bold text-primary flex justify-center items-center size-12 bg-primary rounded-full text-white">PF</span> <span class="text-2xl font-bold text-primary flex items-center">Prishan Fernando</span>
        </NuxtLink>
        
        <div class="hidden md:flex items-center space-x-8">
          <template v-for="item in navigation" :key="item.name">
            <!-- Item with submenu -->
            <div v-if="item.children?.length" class="relative group">
              <NuxtLink
                :to="item.href"
                class="flex items-center text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
                :class="{ 'text-primary': isToolsActive(item) }"
              >
                {{ item.name }}
                <ChevronDownIcon class="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" />
              </NuxtLink>
              <div class="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div class="py-2 rounded-lg bg-white border border-gray-100 shadow-lg min-w-[220px]">
                  <NuxtLink
                    v-for="child in item.children"
                    :key="child.href"
                    :to="child.href"
                    class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md mx-1"
                    active-class="!bg-primary/10 !text-primary font-medium"
                  >
                    {{ child.name }}
                  </NuxtLink>
                </div>
              </div>
            </div>
            <!-- Regular link -->
            <NuxtLink
              v-else-if="!item.download"
              :to="item.href"
              class="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
              active-class="text-primary"
            >
              {{ item.name }}
            </NuxtLink>
            <!-- Download link -->
            <a
              v-else
              :href="item.href"
              download
              class="text-gray-700 hover:text-primary transition-colors duration-200 font-medium flex items-center"
            >
              <ArrowDownTrayIcon class="w-4 h-4 mr-1.5" />
              {{ item.name }}
            </a>
          </template>
        </div>
        
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
          aria-label="Toggle menu"
        >
          <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6" />
          <XMarkIcon v-else class="w-6 h-6" />
        </button>
      </div>
      
      <!-- Mobile menu -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden pb-4 space-y-1"
      >
        <template v-for="item in navigation" :key="item.name">
          <!-- Item with submenu (mobile) -->
          <div v-if="item.children?.length">
            <NuxtLink
              :to="item.href"
              class="block px-3 py-2 rounded-md text-gray-700 font-medium"
              @click="mobileMenuOpen = false"
            >
              {{ item.name }}
            </NuxtLink>
            <div class="pl-4 space-y-1 border-l-2 border-gray-100 ml-3">
              <NuxtLink
                v-for="child in item.children"
                :key="child.href"
                :to="child.href"
                class="block px-3 py-2 rounded-md text-gray-600 hover:bg-secondary transition-colors text-sm"
                @click="mobileMenuOpen = false"
              >
                {{ child.name }}
              </NuxtLink>
            </div>
          </div>
          <!-- Regular link -->
          <NuxtLink
            v-else-if="!item.download"
            :to="item.href"
            class="block px-3 py-2 rounded-md text-gray-700 hover:bg-secondary transition-colors"
            @click="mobileMenuOpen = false"
          >
            {{ item.name }}
          </NuxtLink>
          <!-- Download link -->
          <a
            v-else
            :href="item.href"
            download
            class="block px-3 py-2 rounded-md text-gray-700 hover:bg-secondary transition-colors font-medium flex items-center"
            @click="mobileMenuOpen = false"
          >
            <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
            {{ item.name }}
          </a>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { Bars3Icon, XMarkIcon, ArrowDownTrayIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const mobileMenuOpen = ref(false)

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Experience', href: '/experience' },
  { name: 'Education', href: '/education' },
  { name: 'Certifications', href: '/certifications' },
  {
    name: 'Tools',
    href: '/tools',
    children: [
      { name: 'HELOC vs Mortgage Calculator', href: '/tools/heloc-mortgage-calculator' },
      { name: 'Canadian Tax Calculator', href: '/tools/canadian-tax-calculator' },
      { name: 'Mortgage Calculator', href: '/tools/mortgage-calculator' },
      { name: 'Rental Application', href: '/tools/rental-application' }
    ]
  },
  {
    name: 'Blog',
    href: '',
    children: [
      { name: 'Posts', href: '/posts' },
      { name: 'Book Summaries', href: '/book-summaries' },
    ]
  },
  

]

function isToolsActive (item) {
  if (!item.href || item.href === '/') return false
  return route.path.startsWith(item.href)
}
</script>
