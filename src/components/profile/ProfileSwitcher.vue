<script setup lang="ts">
import { computed } from 'vue'
import { useProfileStore } from '@/app/stores/profile.store'

const profileStore = useProfileStore()

const selectedProfile = computed({
  get: () => profileStore.activeProfileId,
  set: (profileId: string) => profileStore.setActiveProfile(profileId)
})
</script>

<template>
  <label class="flex items-center gap-2 text-sm">
    <span class="text-slate-600">Perfil:</span>
    <select
      v-model="selectedProfile"
      class="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700"
    >
      <option v-for="profile in profileStore.profiles" :key="profile.id" :value="profile.id">
        {{ profile.displayName }}
      </option>
    </select>
  </label>
</template>
