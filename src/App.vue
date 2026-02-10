<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/app/stores/auth.store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const tabs = [
  { label: 'Inicio', to: '/' },
  { label: 'Captura', to: '/day/today' },
  { label: 'Comidas', to: '/foods' },
  { label: 'Perfil', to: '/profile' },
  { label: 'Reporte', to: '/report' }
]

const showNavigation = computed(() => route.path !== '/login' && authStore.isAuthenticated)

const logout = async () => {
  await authStore.logout()
  await router.push('/login')
}

const isTabActive = (target: string) => {
  if (target === '/day/today') return route.path.startsWith('/day/')
  return route.path === target
}
</script>

<template>
  <div class="min-h-screen text-slate-900">
    <header class="bg-white/80 px-4 pt-4 backdrop-blur">
      <div class="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 rounded-3xl border border-white/80 bg-white/70 px-4 py-4 shadow-sm">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Seguimiento mensual</p>
          <h1 class="font-serif text-xl font-semibold text-slate-900">Eat Control</h1>
        </div>
        <button
          v-if="showNavigation"
          class="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300"
          @click="logout"
        >
          Cerrar sesión
        </button>
      </div>

      <nav v-if="showNavigation" class="mx-auto mt-4 hidden w-full max-w-5xl gap-2 overflow-x-auto pb-2 md:flex">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="flex-1 rounded-2xl border px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide transition"
          :class="
            isTabActive(tab.to)
              ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
              : 'border-transparent bg-white/80 text-slate-600 hover:border-slate-200'
          "
        >
          {{ tab.label }}
        </RouterLink>
      </nav>
    </header>

    <main class="page-enter mx-auto w-full max-w-5xl p-4 pb-24 md:pb-10">
      <RouterView />
    </main>

    <nav
      v-if="showNavigation"
      class="fixed bottom-4 left-1/2 z-30 grid w-[min(92vw,520px)] -translate-x-1/2 grid-cols-[1fr_1fr_auto_1fr_1fr] items-center gap-2 rounded-[32px] border border-white/70 bg-white/90 px-3 py-2 shadow-lg backdrop-blur md:hidden"
    >
      <RouterLink
        to="/"
        class="rounded-2xl px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wide transition"
        :class="isTabActive('/') ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'"
      >
        Inicio
      </RouterLink>
      <RouterLink
        to="/foods"
        class="rounded-2xl px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wide transition"
        :class="isTabActive('/foods') ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'"
      >
        Comidas
      </RouterLink>

      <RouterLink
        to="/day/today"
        class="mx-1 grid h-12 w-12 place-items-center rounded-full bg-rose-500 text-xl font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
      >
        +
      </RouterLink>

      <RouterLink
        to="/profile"
        class="rounded-2xl px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wide transition"
        :class="isTabActive('/profile') ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'"
      >
        Perfil
      </RouterLink>
      <RouterLink
        to="/report"
        class="rounded-2xl px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wide transition"
        :class="isTabActive('/report') ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'"
      >
        Reporte
      </RouterLink>
    </nav>
  </div>
</template>
