<script setup lang="ts">
import { computed } from 'vue'
import { useMonthStore } from '@/app/stores/month.store'
import ProfileSwitcher from '@/components/profile/ProfileSwitcher.vue'
import MonthTable from '@/components/table/MonthTable.vue'

const monthStore = useMonthStore()

const monthModel = computed({
  get: () => monthStore.selectedMonth,
  set: (value: string) => {
    monthStore.selectedMonth = value
  }
})
</script>

<template>
  <section class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm">
      <div>
        <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Reporte mensual</p>
        <h2 class="font-serif text-2xl font-semibold text-slate-900">Tabla del mes</h2>
      </div>
      <ProfileSwitcher />
      <label class="flex items-center gap-2 text-sm">
        <span class="text-slate-600">Mes:</span>
        <input v-model="monthModel" type="month" class="rounded-md border border-slate-300 px-3 py-2" />
      </label>
    </div>

    <MonthTable />
  </section>
</template>
