<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'accent'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary text-gray-800',
    accent: 'bg-accent/20 text-accent'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }
  
  return `${base} ${variants[props.variant]} ${sizes[props.size]}`
})
</script>
