import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/app/stores/auth.store'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { requiresAuth: true } },
    { path: '/day/:date', name: 'day', component: () => import('@/views/DayView.vue'), meta: { requiresAuth: true } },
    { path: '/foods', name: 'foods', component: () => import('@/views/FoodsView.vue'), meta: { requiresAuth: true } },
    { path: '/profile', name: 'profile', component: () => import('@/views/ProfileView.vue'), meta: { requiresAuth: true } },
    { path: '/report', name: 'report', component: () => import('@/views/MonthView.vue'), meta: { requiresAuth: true } },
    { path: '/export', redirect: '/report' }
  ]
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.ensureInitialized()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'home' }
  }

  return true
})

export default router
