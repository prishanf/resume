<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
    <Card
      v-for="(rec, index) in recommendations"
      :key="index"
      variant="bordered"
      class="relative group hover:shadow-xl transition-shadow duration-300"
    >
      <div class="absolute top-6 left-6 text-accent/30 text-6xl font-serif leading-none">"</div>
      <blockquote class="pl-12 pr-6 py-6 relative z-10">
        <p class="text-gray-700 mb-6 italic text-lg leading-relaxed">{{ rec.quote }}</p>
        <footer class="flex items-center pt-4 border-t border-gray-200">
          <div>
            <p class="font-bold text-primary text-lg">{{ rec.author }}</p>
            <p v-if="rec.title" class="text-sm text-gray-500 mt-1">{{ rec.title }}</p>
          </div>
        </footer>
      </blockquote>
    </Card>
  </div>
</template>

<script setup>
const props = defineProps({
  recommendations: {
    type: Array,
    required: true
  }
})
</script>
