<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '@/app/stores/profile.store'
import MembersDialog from '@/components/profile/MembersDialog.vue'

const profileStore = useProfileStore()
const { activeProfile } = storeToRefs(profileStore)
const membersOpen = ref(false)
</script>

<template>
  <section class="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
    <h2 class="text-lg font-semibold">Perfil activo</h2>
    <p class="text-sm text-slate-600">{{ activeProfile?.displayName ?? 'Sin perfil seleccionado' }}</p>
    <button class="rounded-md border border-slate-300 px-3 py-2 text-sm" @click="membersOpen = true">
      Gestionar miembros
    </button>

    <MembersDialog :open="membersOpen" @close="membersOpen = false" />
  </section>
</template>
