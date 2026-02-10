import { ref } from 'vue'
import { defineStore } from 'pinia'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, type Unsubscribe } from 'firebase/firestore'
import { db } from '@/app/firebase/client'

export type Food = {
  id: string
  name: string
  categoryId: string
}

export const useFoodStore = defineStore('food', () => {
  const foods = ref<Food[]>([])
  const loading = ref(false)
  const error = ref('')

  let unsubscribe: Unsubscribe | null = null

  const bindFoods = (profileId: string) => {
    unsubscribe?.()
    foods.value = []
    error.value = ''

    if (!profileId) return

    loading.value = true
    const foodsRef = collection(db, 'profiles', profileId, 'foods')
    const foodsQuery = query(foodsRef, orderBy('name'))

    unsubscribe = onSnapshot(
      foodsQuery,
      (snapshot) => {
        foods.value = snapshot.docs.map((doc) => {
          const data = doc.data() as { name?: string; categoryId?: string }
          return {
            id: doc.id,
            name: data.name ?? '',
            categoryId: data.categoryId ?? ''
          }
        })
        loading.value = false
      },
      (err) => {
        error.value = err.message
        loading.value = false
      }
    )
  }

  const unbindFoods = () => {
    unsubscribe?.()
    unsubscribe = null
  }

  const addFood = async (profileId: string, name: string, categoryId: string): Promise<boolean> => {
    const normalized = name.trim()
    if (!normalized || !categoryId || !profileId) return false

    const exists = foods.value.some(
      (food) => food.name.toLowerCase() === normalized.toLowerCase() && food.categoryId === categoryId
    )
    if (exists) return false

    await addDoc(collection(db, 'profiles', profileId, 'foods'), {
      name: normalized,
      categoryId,
      active: true,
      createdAt: serverTimestamp()
    })

    return true
  }

  return {
    foods,
    loading,
    error,
    bindFoods,
    unbindFoods,
    addFood
  }
})
