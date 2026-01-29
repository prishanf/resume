<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'elevated', 'bordered'].includes(value)
  },
  hover: {
    type: Boolean,
    default: false
  }
})

const cardClasses = computed(() => {
  const base = 'bg-white rounded-xl'
  
  const variants = {
    default: 'shadow-sm border border-gray-100',
    elevated: 'shadow-lg border border-gray-100',
    bordered: 'border-2 border-gray-200'
  }
  
  const hoverClass = props.hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : ''
  
  return `${base} ${variants[props.variant]} ${hoverClass}`
})
</script>
