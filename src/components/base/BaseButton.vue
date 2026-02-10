<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit'
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    class="rounded-2xl bg-slate-900 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
  >
    <slot />
  </button>
</template>
