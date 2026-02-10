<script setup lang="ts">
defineProps<{
  value: number
}>()

defineEmits<{
  cycle: []
}>()
</script>

<template>
  <button
    class="h-10 w-10 rounded-md border border-slate-200 text-sm font-medium transition hover:bg-slate-100"
    @click="$emit('cycle')"
  >
    {{ value }}
  </button>
</template>
