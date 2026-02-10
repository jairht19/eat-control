import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

type CellKey = `${string}|${string}`

type CellValueMap = Record<CellKey, number>

const formatDate = (date: Date) => date.toISOString().slice(0, 10)

export const useMonthStore = defineStore('month', () => {
  const selectedMonth = ref(formatDate(new Date()).slice(0, 7))
  const entries = ref<CellValueMap>({})

  const days = computed(() => {
    const [year, month] = selectedMonth.value.split('-').map(Number)
    const totalDays = new Date(year, month, 0).getDate()

    return Array.from({ length: totalDays }, (_, index) => {
      const day = index + 1
      const date = new Date(year, month - 1, day)
      return {
        day,
        date: formatDate(date)
      }
    })
  })

  const getValue = (foodId: string, date: string) => entries.value[`${foodId}|${date}`]

  const cycleValue = (foodId: string, date: string) => {
    const key: CellKey = `${foodId}|${date}`
    const current = entries.value[key] ?? 0
    entries.value[key] = current >= 3 ? 0 : current + 1
  }

  return {
    selectedMonth,
    days,
    getValue,
    cycleValue
  }
})
