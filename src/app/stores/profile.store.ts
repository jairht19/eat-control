import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type Profile = {
  id: string
  displayName: string
}

const seedProfiles: Profile[] = [
  { id: 'mom', displayName: 'Mamá' },
  { id: 'me', displayName: 'Tú' }
]

export const useProfileStore = defineStore('profile', () => {
  const profiles = ref<Profile[]>(seedProfiles)
  const activeProfileId = ref<string>(seedProfiles[0].id)

  const activeProfile = computed(
    () => profiles.value.find((profile) => profile.id === activeProfileId.value) ?? null
  )

  const setActiveProfile = (profileId: string) => {
    activeProfileId.value = profileId
  }

  return {
    profiles,
    activeProfileId,
    activeProfile,
    setActiveProfile
  }
})
