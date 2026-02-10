<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFoodStore } from '@/app/stores/food.store'
import { useMonthStore } from '@/app/stores/month.store'
import StickyHeader from './StickyHeader.vue'
import TableCell from './TableCell.vue'

const monthStore = useMonthStore()
const foodStore = useFoodStore()

const { days } = storeToRefs(monthStore)
</script>

<template>
  <div class="overflow-auto rounded-lg border border-slate-200 bg-white">
    <table class="w-full border-collapse">
      <StickyHeader :labels="days.map((day) => day.day)" />
      <tbody>
        <tr v-for="food in foodStore.foods" :key="food.id" class="border-t border-slate-100">
          <td class="sticky left-0 z-10 bg-white px-3 py-2 text-sm font-medium text-slate-700">
            {{ food.name }}
          </td>
          <td v-for="day in days" :key="day.date" class="px-1 py-1 text-center">
            <TableCell
              :value="monthStore.getValue(food.id, day.date) ?? 0"
              @cycle="monthStore.cycleValue(food.id, day.date)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
