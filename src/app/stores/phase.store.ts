import { ref } from 'vue'
import { defineStore } from 'pinia'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, type Unsubscribe } from 'firebase/firestore'
import { db } from '@/app/firebase/client'

export type Phase = {
  id: string
  name: string
}

export const usePhaseStore = defineStore('phase', () => {
  const phases = ref<Phase[]>([])
  const loading = ref(false)
  const error = ref('')

  let unsubscribe: Unsubscribe | null = null

  const bindPhases = (profileId: string) => {
    unsubscribe?.()
    phases.value = []
    error.value = ''

    if (!profileId) return

    loading.value = true
    const phasesRef = collection(db, 'profiles', profileId, 'phases')
    const phasesQuery = query(phasesRef, orderBy('name'))

    unsubscribe = onSnapshot(
      phasesQuery,
      (snapshot) => {
        phases.value = snapshot.docs.map((doc) => {
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

  const unbindPhases = () => {
    unsubscribe?.()
    unsubscribe = null
  }

  const addPhase = async (profileId: string, name: string) => {
    const normalized = name.trim()
    if (!normalized || !profileId) return

    const exists = phases.value.some((phase) => phase.name.toLowerCase() === normalized.toLowerCase())
    if (exists) return

    await addDoc(collection(db, 'profiles', profileId, 'phases'), {
      name: normalized,
      active: true,
      createdAt: serverTimestamp()
    })
  }

  return {
    phases,
    loading,
    error,
    bindPhases,
    unbindPhases,
    addPhase
  }
})
