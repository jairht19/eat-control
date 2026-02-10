import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/app/stores/auth.store';
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
        { path: '/', name: 'month', component: () => import('@/views/MonthView.vue'), meta: { requiresAuth: true } },
        { path: '/day/:date', name: 'day', component: () => import('@/views/DayView.vue'), meta: { requiresAuth: true } },
        { path: '/foods', name: 'foods', component: () => import('@/views/FoodsView.vue'), meta: { requiresAuth: true } },
        { path: '/profile', name: 'profile', component: () => import('@/views/ProfileView.vue'), meta: { requiresAuth: true } },
        { path: '/export', name: 'export', component: () => import('@/views/ExportView.vue'), meta: { requiresAuth: true } }
    ]
});
router.beforeEach(async (to) => {
    const authStore = useAuthStore();
    await authStore.ensureInitialized();
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return { name: 'login' };
    }
    if (to.name === 'login' && authStore.isAuthenticated) {
        return { name: 'month' };
    }
    return true;
});
export default router;
