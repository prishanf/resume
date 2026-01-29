<template>
  <div class="relative">
    <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
    <div class="space-y-12">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="relative pl-20"
      >
        <div class="absolute left-6 top-2 w-4 h-4 bg-primary rounded-full border-4 border-white"></div>
        <div>
          <div class="flex items-center mb-2">
            <h3 class="text-xl font-bold text-primary">{{ item.title }}</h3>
            <Badge v-if="item.badge" :variant="item.badgeVariant || 'primary'" class="ml-3">
              {{ item.badge }}
            </Badge>
          </div>
          <p class="text-accent font-semibold mb-2">{{ item.period }}</p>
          <p class="text-gray-600 mb-3">{{ item.location }}</p>
          <ul v-if="item.points" class="list-disc list-inside space-y-1 text-gray-700">
            <li v-for="(point, pIndex) in item.points" :key="pIndex" v-html="point"></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>
