import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
const seedProfiles = [
    { id: 'mom', displayName: 'Mamá' },
    { id: 'me', displayName: 'Tú' }
];
export const useProfileStore = defineStore('profile', () => {
    const profiles = ref(seedProfiles);
    const activeProfileId = ref(seedProfiles[0].id);
    const activeProfile = computed(() => profiles.value.find((profile) => profile.id === activeProfileId.value) ?? null);
    const setActiveProfile = (profileId) => {
        activeProfileId.value = profileId;
    };
    return {
        profiles,
        activeProfileId,
        activeProfile,
        setActiveProfile
    };
});
