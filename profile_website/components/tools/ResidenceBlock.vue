<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
      <input
        :model-value="address"
        type="text"
        class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary"
        @input="$emit('update:address', ($event.target).value)"
      />
    </div>
    <div class="grid gap-4 sm:grid-cols-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
        <input
          :model-value="city"
          type="text"
          class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary"
          @input="$emit('update:city', ($event.target).value)"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Province</label>
        <input
          :model-value="province"
          type="text"
          class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary"
          @input="$emit('update:province', ($event.target).value)"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
        <input
          :model-value="postal"
          type="text"
          class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary"
          @input="$emit('update:postal', ($event.target).value)"
        />
      </div>
    </div>
    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Landlord name</label>
        <input
          :model-value="landlord"
          type="text"
          class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary"
          @input="$emit('update:landlord', ($event.target).value)"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Landlord phone</label>
        <input
          :model-value="landlord_phone"
          type="tel"
          class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary"
          @input="$emit('update:landlord_phone', ($event.target).value)"
        />
      </div>
    </div>
    <div class="grid gap-4 sm:grid-cols-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Monthly rent</label>
        <input
          :model-value="rent"
          type="text"
          class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary"
          @input="$emit('update:rent', ($event.target).value)"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">From date</label>
        <input
          :model-value="start"
          type="date"
          class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary"
          @input="$emit('update:start', ($event.target).value)"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">To date</label>
        <input
          :model-value="end"
          type="date"
          class="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary"
          @input="$emit('update:end', ($event.target).value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  province: { type: String, default: '' },
  postal: { type: String, default: '' },
  landlord: { type: String, default: '' },
  landlord_phone: { type: String, default: '' },
  rent: { type: String, default: '' },
  start: { type: String, default: '' },
  end: { type: String, default: '' }
})
defineEmits(['update:address', 'update:city', 'update:province', 'update:postal', 'update:landlord', 'update:landlord_phone', 'update:rent', 'update:start', 'update:end'])
</script>
