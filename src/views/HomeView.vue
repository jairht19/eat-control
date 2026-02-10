<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import { useDayStore } from '@/app/stores/day.store'
import { useFoodStore } from '@/app/stores/food.store'
import { usePhaseStore } from '@/app/stores/phase.store'
import { useProfileStore } from '@/app/stores/profile.store'

const dayStore = useDayStore()
const foodStore = useFoodStore()
const phaseStore = usePhaseStore()
const profileStore = useProfileStore()

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10)
const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(today.getDate() - 1)

const todayDate = toIsoDate(today)
const yesterdayDate = toIsoDate(yesterday)

const foodMap = computed(() => {
  return foodStore.foods.reduce<Record<string, string>>((acc, food) => {
    acc[food.id] = food.name
    return acc
  }, {})
})

const phaseMap = computed(() => {
  return phaseStore.phases.reduce<Record<string, string>>((acc, phase) => {
    acc[phase.id] = phase.name
    return acc
  }, {})
})

const todayCaptures = computed(() =>
  dayStore.recentCaptures.filter((capture) => capture.date === todayDate)
)
const yesterdayCaptures = computed(() =>
  dayStore.recentCaptures.filter((capture) => capture.date === yesterdayDate)
)

watch(
  () => profileStore.activeProfileId,
  (profileId) => {
    if (!profileId) return
    dayStore.bindRecentCaptures(profileId, [todayDate, yesterdayDate])
    foodStore.bindFoods(profileId)
    phaseStore.bindPhases(profileId)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  dayStore.unbindRecentCaptures()
  foodStore.unbindFoods()
  phaseStore.unbindPhases()
})
</script>

<template>
  <section class="space-y-6">
    <div class="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
      <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Inicio</p>
      <h2 class="font-serif text-2xl font-semibold text-slate-900">Resumen diario</h2>
      <p class="mt-1 text-sm text-slate-500">
        Se muestran solo registros de hoy y ayer para mantener el foco operativo.
      </p>
    </div>

    <div class="space-y-3 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm">
      <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Hoy</p>
      <div v-if="todayCaptures.length" class="space-y-2">
        <article
          v-for="capture in todayCaptures"
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
      </div>
      <p v-else class="text-sm text-slate-500">Sin capturas registradas hoy.</p>
    </div>

    <div class="space-y-3 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm">
      <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Ayer</p>
      <div v-if="yesterdayCaptures.length" class="space-y-2">
        <article
          v-for="capture in yesterdayCaptures"
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
      </div>
      <p v-else class="text-sm text-slate-500">Sin capturas registradas ayer.</p>
    </div>
  </section>
</template>
