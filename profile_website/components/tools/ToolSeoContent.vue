<template>
  <section v-if="seo" class="py-16 border-t border-gray-100 bg-white">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-bold text-primary mb-6 tracking-tight">{{ seo.heading }}</h2>
      <div class="space-y-5 text-gray-700 leading-relaxed">
        <p v-for="(paragraph, index) in seo.paragraphs" :key="index">{{ paragraph }}</p>
      </div>

      <div v-if="seo.relatedPosts.length" class="mt-12">
        <h3 class="text-lg font-bold text-primary mb-4">Related reading</h3>
        <ul class="space-y-2">
          <li v-for="post in seo.relatedPosts" :key="post.path">
            <NuxtLink
              :to="post.path"
              class="font-semibold text-primary hover:underline"
            >
              {{ post.title }} →
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div class="mt-12">
        <h2 class="text-2xl font-bold text-primary mb-6 tracking-tight">Frequently asked questions</h2>
        <div class="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
          <details
            v-for="faq in seo.faqs"
            :key="faq.question"
            class="group bg-white px-6 py-4"
          >
            <summary class="cursor-pointer font-semibold text-primary list-none flex items-start justify-between gap-4">
              <span>{{ faq.question }}</span>
              <span class="text-gray-500 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
            </summary>
            <p class="mt-3 text-gray-700 leading-relaxed">{{ faq.answer }}</p>
          </details>
        </div>
      </div>

      <p class="mt-10 text-sm text-gray-600 leading-relaxed">
        Educational estimates only. This is not financial, tax, or legal advice.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getToolSeo } from '~/data/toolSeo'

const props = defineProps<{
  seoKey: string
}>()

const seo = computed(() => getToolSeo(props.seoKey))
</script>
