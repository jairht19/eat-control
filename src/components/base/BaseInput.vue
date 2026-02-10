<script setup lang="ts">
const modelValue = defineModel<string>({ required: true })

defineProps<{
  label: string
  placeholder?: string
}>()
</script>

<template>
  <label class="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
    <span>{{ label }}</span>
    <input
      v-model="modelValue"
      class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
      :placeholder="placeholder"
    />
  </label>
</template>
