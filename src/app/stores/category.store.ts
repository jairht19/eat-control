import { ref } from 'vue'
import { defineStore } from 'pinia'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, type Unsubscribe } from 'firebase/firestore'
import { db } from '@/app/firebase/client'

export type Category = {
  id: string
  name: string
}

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref('')

  let unsubscribe: Unsubscribe | null = null

  const bindCategories = (profileId: string) => {
    unsubscribe?.()
    categories.value = []
    error.value = ''

    if (!profileId) return

    loading.value = true
    const categoriesRef = collection(db, 'profiles', profileId, 'categories')
    const categoriesQuery = query(categoriesRef, orderBy('name'))

    unsubscribe = onSnapshot(
      categoriesQuery,
      (snapshot) => {
        categories.value = snapshot.docs.map((doc) => {
          const data = doc.data() as { name?: string }
          return {
            id: doc.id,
            name: data.name ?? ''
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

  const unbindCategories = () => {
    unsubscribe?.()
    unsubscribe = null
  }

  const addCategory = async (profileId: string, name: string): Promise<string | null> => {
    const normalized = name.trim()
    if (!normalized || !profileId) return null

    const existing = categories.value.find((category) => category.name.toLowerCase() === normalized.toLowerCase())
    if (existing) return existing.id

    const docRef = await addDoc(collection(db, 'profiles', profileId, 'categories'), {
      name: normalized,
      active: true,
      createdAt: serverTimestamp()
    })

    return docRef.id
  }

  return {
    categories,
    loading,
    error,
    bindCategories,
    unbindCategories,
    addCategory
  }
})
