<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import { useFoodStore } from '@/app/stores/food.store'
import { useCategoryStore } from '@/app/stores/category.store'
import { usePhaseStore } from '@/app/stores/phase.store'
import { useProfileStore } from '@/app/stores/profile.store'

const foodStore = useFoodStore()
const categoryStore = useCategoryStore()
const phaseStore = usePhaseStore()
const profileStore = useProfileStore()
const name = ref('')
const newCategory = ref('')
const newPhase = ref('')
const selectedCategoryId = ref(categoryStore.categories[0]?.id ?? '')
const selectedCsvFile = ref<File | null>(null)
const isImportingCsv = ref(false)
const importStatus = ref('')
const importSummary = ref('')
const csvErrors = ref<Array<{ row: number; reason: string; raw: string }>>([])

const categoryMap = computed(() =>
  categoryStore.categories.reduce<Record<string, string>>((acc, category) => {
    acc[category.id] = category.name
    return acc
  }, {})
)

const submitFood = async () => {
  if (!name.value.trim() || !selectedCategoryId.value || !profileStore.activeProfileId) return

  await foodStore.addFood(profileStore.activeProfileId, name.value.trim(), selectedCategoryId.value)
  name.value = ''
}

const submitCategory = async () => {
  if (!newCategory.value.trim() || !profileStore.activeProfileId) return

  await categoryStore.addCategory(profileStore.activeProfileId, newCategory.value.trim())
  newCategory.value = ''
}

const submitPhase = async () => {
  if (!newPhase.value.trim() || !profileStore.activeProfileId) return

  await phaseStore.addPhase(profileStore.activeProfileId, newPhase.value.trim())
  newPhase.value = ''
}

const normalizeKey = (value: string) => value.trim().toLowerCase()

const importCsv = async (file?: File | null) => {
  if (!file) {
    return { addedFoods: 0, addedCategories: 0, skipped: 0, errors: [] as Array<{ row: number; reason: string; raw: string }> }
  }

  const text = await file.text()
  const lines = text.split(/\r?\n/).filter((line) => line.trim())
  if (!lines.length) {
    return { addedFoods: 0, addedCategories: 0, skipped: 0, errors: [{ row: 1, reason: 'Archivo vacio', raw: '' }] }
  }

  const [header, ...rows] = lines
  const headers = header.split(',').map((value) => normalizeKey(value))
  const nameIndex = headers.indexOf('name')
  const categoryIndex = headers.indexOf('category')
  if (nameIndex === -1 || categoryIndex === -1) {
    return {
      addedFoods: 0,
      addedCategories: 0,
      skipped: rows.length,
      errors: [{ row: 1, reason: 'Encabezado invalido. Usa: name,category', raw: header }]
    }
  }

  const categoryByName = new Map(
    categoryStore.categories.map((category) => [normalizeKey(category.name), category.id])
  )
  const seenFoods = new Set(foodStore.foods.map((food) => `${normalizeKey(food.name)}|${food.categoryId}`))
  const errors: Array<{ row: number; reason: string; raw: string }> = []
  let addedFoods = 0
  let addedCategories = 0
  let skipped = 0

  for (const [index, row] of rows.entries()) {
    const columns = row.split(',').map((value) => value.trim())
    const foodName = columns[nameIndex]
    const categoryName = columns[categoryIndex]
    if (!foodName || !categoryName) {
      skipped += 1
      errors.push({ row: index + 2, reason: 'Faltan columnas requeridas', raw: row })
      continue
    }

    let categoryId = categoryByName.get(normalizeKey(categoryName))
    if (!categoryId) {
      if (!profileStore.activeProfileId) {
        skipped += 1
        errors.push({ row: index + 2, reason: 'No hay perfil activo', raw: row })
        continue
      }
      const createdCategoryId = await categoryStore.addCategory(profileStore.activeProfileId, categoryName)
      categoryId = createdCategoryId ?? categoryByName.get(normalizeKey(categoryName))
      if (categoryId) {
        categoryByName.set(normalizeKey(categoryName), categoryId)
        addedCategories += 1
      }
    }

    if (categoryId) {
      if (!profileStore.activeProfileId) {
        skipped += 1
        errors.push({ row: index + 2, reason: 'No hay perfil activo', raw: row })
        continue
      }

      const dedupeKey = `${normalizeKey(foodName)}|${categoryId}`
      if (seenFoods.has(dedupeKey)) {
        skipped += 1
        errors.push({ row: index + 2, reason: 'Comida duplicada para la categoria', raw: row })
        continue
      }

      const created = await foodStore.addFood(profileStore.activeProfileId, foodName, categoryId)
      if (created) {
        seenFoods.add(dedupeKey)
        addedFoods += 1
      } else {
        skipped += 1
        errors.push({ row: index + 2, reason: 'No se agrego (duplicada o invalida)', raw: row })
      }
    } else {
      skipped += 1
      errors.push({ row: index + 2, reason: 'Categoria invalida', raw: row })
    }
  }

  return { addedFoods, addedCategories, skipped, errors }
}

const onCsvSelected = (event: Event) => {
  selectedCsvFile.value = (event.target as HTMLInputElement).files?.[0] ?? null
  importStatus.value = ''
  importSummary.value = ''
  csvErrors.value = []
}

const processCsvImport = async () => {
  if (!selectedCsvFile.value) {
    importStatus.value = 'Selecciona un archivo CSV primero.'
    return
  }

  if (!profileStore.activeProfileId) {
    importStatus.value = 'Selecciona un perfil activo para importar.'
    return
  }

  if (isImportingCsv.value) return

  importStatus.value = ''
  importSummary.value = ''
  csvErrors.value = []
  isImportingCsv.value = true

  try {
    const result = await importCsv(selectedCsvFile.value)
    importSummary.value = `Agregadas: ${result.addedFoods} comidas, ${result.addedCategories} categorias. Omitidas: ${result.skipped}.`
    csvErrors.value = result.errors
    importStatus.value = 'Importacion completada.'
    selectedCsvFile.value = null
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    importStatus.value = `No se pudo procesar el CSV. ${message}`
  } finally {
    isImportingCsv.value = false
  }
}

const downloadImportErrors = () => {
  if (!csvErrors.value.length) return

  const header = 'row,reason,raw'
  const rows = csvErrors.value.map((error) => {
    const safeReason = error.reason.replaceAll('"', '""')
    const safeRaw = error.raw.replaceAll('"', '""')
    return `${error.row},"${safeReason}","${safeRaw}"`
  })
  const content = [header, ...rows].join('\n')
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'errores-importacion-comidas.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

watch(
  () => profileStore.activeProfileId,
  (profileId) => {
    if (!profileId) return
    foodStore.bindFoods(profileId)
    categoryStore.bindCategories(profileId)
    phaseStore.bindPhases(profileId)
  },
  { immediate: true }
)

watch(
  () => categoryStore.categories,
  (categories) => {
    if (!categories.length) {
      selectedCategoryId.value = ''
      return
    }

    const exists = categories.some((category) => category.id === selectedCategoryId.value)
    if (!exists) {
      selectedCategoryId.value = categories[0].id
    }
  },
  { deep: true, immediate: true }
)

onBeforeUnmount(() => {
  foodStore.unbindFoods()
  categoryStore.unbindCategories()
  phaseStore.unbindPhases()
})
</script>

<template>
  <section class="space-y-6">
    <div class="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Catálogo</p>
          <h2 class="font-serif text-2xl font-semibold text-slate-900">Comidas disponibles</h2>
          <p class="mt-1 text-sm text-slate-500">
            Define tu lista base para armar el registro mensual sin fricción.
          </p>
        </div>
        <span class="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {{ foodStore.foods.length }} items
        </span>
      </div>

      <form class="mt-5 grid gap-3 md:grid-cols-3" @submit.prevent="submitFood">
        <BaseInput v-model="name" label="Comida" placeholder="Ej. Huevos" />
        <label class="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Categoría</span>
          <select
            v-model="selectedCategoryId"
            class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
            <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </label>
        <div class="flex items-end">
          <BaseButton type="submit">Agregar comida</BaseButton>
        </div>
      </form>

      <form class="mt-4 grid gap-3 md:grid-cols-[2fr_1fr]" @submit.prevent="submitCategory">
        <BaseInput v-model="newCategory" label="Nueva categoría" placeholder="Ej. Legumbres" />
        <div class="flex items-end">
          <BaseButton type="submit">Agregar categoría</BaseButton>
        </div>
      </form>

      <form class="mt-4 grid gap-3 md:grid-cols-[2fr_1fr]" @submit.prevent="submitPhase">
        <BaseInput v-model="newPhase" label="Nueva fase" placeholder="Ej. Colación" />
        <div class="flex items-end">
          <BaseButton type="submit">Agregar fase</BaseButton>
        </div>
      </form>

      <div class="mt-4 flex flex-wrap gap-2">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Fases:</span>
        <span
          v-for="phase in phaseStore.phases"
          :key="phase.id"
          class="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
        >
          {{ phase.name }}
        </span>
      </div>

      <div class="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Importar CSV</p>
        <p class="mt-1 text-xs text-slate-500">Formato: name,category (incluye encabezado).</p>
        <input
          type="file"
          accept=".csv"
          class="mt-3 block w-full text-xs text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-wide file:text-white"
          :disabled="isImportingCsv"
          @change="onCsvSelected"
        />
        <div class="mt-3 flex items-center gap-3">
          <BaseButton :type="'button'" @click="processCsvImport">
            {{ isImportingCsv ? 'Procesando...' : 'Procesar CSV' }}
          </BaseButton>
          <span v-if="selectedCsvFile" class="text-xs text-slate-500">{{ selectedCsvFile.name }}</span>
        </div>
        <p v-if="importSummary" class="mt-2 text-xs font-semibold text-slate-700">{{ importSummary }}</p>
        <p v-if="importStatus" class="mt-2 text-xs text-slate-600">{{ importStatus }}</p>
        <button
          v-if="csvErrors.length"
          class="mt-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600"
          @click="downloadImportErrors"
        >
          Descargar errores ({{ csvErrors.length }})
        </button>
      </div>
    </div>

    <div class="rounded-3xl border border-white/70 bg-white/80 p-3 shadow-sm">
      <ul class="divide-y divide-slate-200/70">
        <li
          v-for="food in foodStore.foods"
          :key="food.id"
          class="flex items-center justify-between px-3 py-3"
        >
          <div>
            <p class="text-base font-semibold text-slate-800">{{ food.name }}</p>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Categoría</p>
          </div>
          <span class="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            {{ categoryMap[food.categoryId] ?? 'Sin categoría' }}
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>
