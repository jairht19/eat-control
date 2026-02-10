<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import { useAuthStore } from '@/app/stores/auth.store'

const authStore = useAuthStore()
const router = useRouter()
const errorMessage = ref('')

const login = async () => {
  errorMessage.value = ''

  try {
    await authStore.login()
    await router.push('/')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'No se pudo iniciar sesión.'
  }
}
</script>

<template>
  <section class="mx-auto mt-20 max-w-md rounded-xl border border-slate-200 bg-white p-8">
    <h2 class="text-xl font-semibold text-slate-900">Inicia sesión</h2>
    <p class="mt-1 text-sm text-slate-600">Usa tu cuenta de Google para acceder a tus perfiles.</p>
    <div class="mt-6">
      <BaseButton @click="login">Entrar con Google</BaseButton>
    </div>
    <p v-if="errorMessage" class="mt-3 text-sm text-red-600">{{ errorMessage }}</p>
  </section>
</template>
