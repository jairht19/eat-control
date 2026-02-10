<script setup lang="ts">
defineProps<{
  labels: Array<string | number>
}>()
</script>

<template>
  <thead class="sticky top-0 bg-white">
    <tr>
      <th class="sticky left-0 z-10 min-w-36 bg-white px-3 py-2 text-left text-xs uppercase text-slate-500">
        Comida
      </th>
      <th
        v-for="label in labels"
        :key="label"
        class="min-w-12 px-1 py-2 text-center text-xs font-semibold text-slate-600"
      >
        {{ label }}
      </th>
    </tr>
  </thead>
</template>
