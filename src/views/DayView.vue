<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDayStore } from '@/app/stores/day.store'
import { useFoodStore } from '@/app/stores/food.store'
import { usePhaseStore } from '@/app/stores/phase.store'
import { useProfileStore } from '@/app/stores/profile.store'
import BaseButton from '@/components/base/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const dayStore = useDayStore()
const foodStore = useFoodStore()
const phaseStore = usePhaseStore()
const profileStore = useProfileStore()

const createOpen = ref(false)
const selectedFoodId = ref('')
const selectedPhaseId = ref('')
const done = ref(false)
const foodQuery = ref('')

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10)
const toLocalDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const todayIso = computed(() => toIsoDate(new Date()))
const selectedIsoDate = computed(() => {
  const raw = String(route.params.date)
  return raw === 'today' ? todayIso.value : raw
})

const isFutureDate = (isoDate: string) => toLocalDate(isoDate) > toLocalDate(todayIso.value)

watchEffect(() => {
  if (isFutureDate(selectedIsoDate.value)) {
    router.replace('/day/today')
  }
})

const weekDays = computed(() => {
  const baseDate = toLocalDate(selectedIsoDate.value)
  const start = new Date(baseDate)
  start.setDate(baseDate.getDate() - ((baseDate.getDay() + 6) % 7))

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start)
    day.setDate(start.getDate() + index)
    const isoDate = toIsoDate(day)
    return {
      label: day.toLocaleDateString('es-MX', { weekday: 'short' }).replace('.', ''),
      day: day.getDate(),
      iso: isoDate,
      isActive: day.toDateString() === baseDate.toDateString(),
      disabled: isFutureDate(isoDate)
    }
  })
})

const foodMap = computed(() =>
  foodStore.foods.reduce<Record<string, string>>((acc, food) => {
    acc[food.id] = food.name
    return acc
  }, {})
)

const phaseMap = computed(() =>
  phaseStore.phases.reduce<Record<string, string>>((acc, phase) => {
    acc[phase.id] = phase.name
    return acc
  }, {})
)

const normalizedFoodQuery = computed(() => foodQuery.value.trim().toLowerCase())
const filteredFoods = computed(() => {
  if (!normalizedFoodQuery.value) return foodStore.foods.slice(0, 8)
  return foodStore.foods
    .filter((food) => food.name.toLowerCase().includes(normalizedFoodQuery.value))
    .slice(0, 8)
})
const selectedFoodName = computed(
  () => foodStore.foods.find((food) => food.id === selectedFoodId.value)?.name ?? ''
)

const pickFood = (foodId: string) => {
  selectedFoodId.value = foodId
  foodQuery.value = foodStore.foods.find((food) => food.id === foodId)?.name ?? ''
}

const submitCapture = async () => {
  if (!profileStore.activeProfileId || !selectedFoodId.value || !selectedPhaseId.value) return

  await dayStore.addCapture(profileStore.activeProfileId, {
    date: selectedIsoDate.value,
    foodId: selectedFoodId.value,
    phaseId: selectedPhaseId.value,
    done: done.value
  })

  createOpen.value = false
  done.value = false
}

watch(
  () => [profileStore.activeProfileId, selectedIsoDate.value] as const,
  ([profileId, isoDate]) => {
    if (!profileId || !isoDate) return
    dayStore.bindCapturesByDate(profileId, isoDate)
    foodStore.bindFoods(profileId)
    phaseStore.bindPhases(profileId)
  },
  { immediate: true }
)

watch(
  () => foodStore.foods,
  (foods) => {
    if (!foods.length) {
      selectedFoodId.value = ''
      foodQuery.value = ''
      return
    }
    if (!selectedFoodId.value || !foods.some((food) => food.id === selectedFoodId.value)) {
      selectedFoodId.value = foods[0].id
      foodQuery.value = foods[0].name
      return
    }

    if (!foodQuery.value.trim()) {
      foodQuery.value = foods.find((food) => food.id === selectedFoodId.value)?.name ?? ''
    }
  },
  { deep: true, immediate: true }
)

watch(
  () => phaseStore.phases,
  (phases) => {
    if (!phases.length) {
      selectedPhaseId.value = ''
      return
    }
    if (!selectedPhaseId.value || !phases.some((phase) => phase.id === selectedPhaseId.value)) {
      selectedPhaseId.value = phases[0].id
    }
  },
  { deep: true, immediate: true }
)

onBeforeUnmount(() => {
  dayStore.unbindCapturesByDate()
  foodStore.unbindFoods()
  phaseStore.unbindPhases()
})
</script>

<template>
  <section class="space-y-6">
    <div class="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Captura diaria</p>
          <h2 class="font-serif text-2xl font-semibold text-slate-900">Vista diaria</h2>
        </div>
        <span class="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {{ selectedIsoDate }}
        </span>
      </div>

      <div class="mt-4 grid grid-cols-7 gap-2">
        <button
          v-for="day in weekDays"
          :key="day.iso"
          class="rounded-2xl border border-transparent px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide transition"
          :class="
            day.disabled
              ? 'cursor-not-allowed bg-slate-50 text-slate-300'
              : day.isActive
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-500 hover:border-slate-200'
          "
          :disabled="day.disabled"
          @click="!day.disabled && router.push(`/day/${day.iso}`)"
        >
          <div class="text-[10px]">{{ day.label }}</div>
          <div class="text-base font-semibold normal-case">{{ day.day }}</div>
        </button>
      </div>
    </div>

    <div class="space-y-3 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm">
      <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Registros del dia</p>
      <article
        v-for="capture in dayStore.capturesOfDay"
        :key="capture.id"
        class="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3"
      >
        <div>
          <p class="text-base font-semibold text-slate-900">{{ foodMap[capture.foodId] ?? 'Comida' }}</p>
          <p class="text-xs text-slate-500">{{ phaseMap[capture.phaseId] ?? 'Sin fase' }}</p>
        </div>
        <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="capture.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'">
          {{ capture.done ? 'Hecho' : 'Pendiente' }}
        </span>
      </article>
      <p v-if="!dayStore.capturesOfDay.length" class="text-sm text-slate-500">No hay comidas capturadas para este dia.</p>
    </div>

    <div v-if="createOpen" class="space-y-3 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm">
      <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Nueva captura</p>
      <label class="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span>Comida (buscar)</span>
        <input
          v-model="foodQuery"
          type="text"
          placeholder="Escribe para filtrar comidas..."
          class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        />
      </label>
      <div class="max-h-44 space-y-1 overflow-auto rounded-2xl border border-slate-200 bg-white p-2">
        <button
          v-for="food in filteredFoods"
          :key="food.id"
          type="button"
          class="w-full rounded-xl px-3 py-2 text-left text-sm transition"
          :class="selectedFoodId === food.id ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
          @click="pickFood(food.id)"
        >
          {{ food.name }}
        </button>
        <p v-if="!filteredFoods.length" class="px-2 py-2 text-sm text-slate-500">Sin coincidencias.</p>
      </div>
      <p class="text-xs text-slate-500">
        Seleccionada: {{ selectedFoodName || 'Ninguna' }}
      </p>
      <label class="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span>Fase</span>
        <select
          v-model="selectedPhaseId"
          class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        >
          <option v-for="phase in phaseStore.phases" :key="phase.id" :value="phase.id">{{ phase.name }}</option>
        </select>
      </label>
      <label class="flex items-center gap-2 text-sm text-slate-600">
        <input v-model="done" type="checkbox" class="h-4 w-4 rounded border-slate-300" />
        Marcar como hecho
      </label>
      <div class="flex gap-2">
        <BaseButton type="button" @click="submitCapture">Guardar</BaseButton>
        <button class="rounded-2xl border border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600" @click="createOpen = false">
          Cancelar
        </button>
      </div>
    </div>

    <button
      class="fixed bottom-6 right-6 grid h-14 w-14 place-items-center rounded-full bg-slate-900 text-2xl text-white shadow-lg transition hover:-translate-y-0.5"
      @click="createOpen = true"
    >
      +
    </button>
  </section>
</template>
