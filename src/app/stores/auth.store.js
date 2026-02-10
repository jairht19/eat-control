import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { loginWithGoogle, logoutUser, observeAuthUser } from '@/app/firebase/auth';
export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const ready = ref(false);
    let initialized = false;
    const ensureInitialized = async () => {
        if (initialized)
            return;
        await new Promise((resolve) => {
            observeAuthUser((authUser) => {
                user.value = authUser;
                ready.value = true;
                initialized = true;
                resolve();
            });
        });
    };
    const login = async () => {
        await loginWithGoogle();
    };
    const logout = async () => {
        await logoutUser();
    };
    const isAuthenticated = computed(() => Boolean(user.value));
    return {
        user,
        ready,
        isAuthenticated,
        ensureInitialized,
        login,
        logout
    };
});
