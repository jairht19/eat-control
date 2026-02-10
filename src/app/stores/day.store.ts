import { ref } from 'vue'
import { defineStore } from 'pinia'
import { addDoc, collection, onSnapshot, query, serverTimestamp, where, type Unsubscribe } from 'firebase/firestore'
import { db } from '@/app/firebase/client'

export type DayCapture = {
  id: string
  date: string
  foodId: string
  phaseId: string
  done: boolean
}

type CaptureInput = Omit<DayCapture, 'id'>

export const useDayStore = defineStore('day', () => {
  const capturesOfDay = ref<DayCapture[]>([])
  const recentCaptures = ref<DayCapture[]>([])
  const loadingDay = ref(false)
  const loadingRecent = ref(false)
  const error = ref('')

  let unsubscribeDay: Unsubscribe | null = null
  let unsubscribeRecent: Unsubscribe | null = null

  const bindCapturesByDate = (profileId: string, isoDate: string) => {
    unsubscribeDay?.()
    capturesOfDay.value = []
    error.value = ''

    if (!profileId || !isoDate) return

    loadingDay.value = true
    const entriesRef = collection(db, 'profiles', profileId, 'entries')
    const entriesQuery = query(entriesRef, where('date', '==', isoDate))

    unsubscribeDay = onSnapshot(
      entriesQuery,
      (snapshot) => {
        capturesOfDay.value = snapshot.docs.map((doc) => {
          const data = doc.data() as Partial<CaptureInput>
          return {
            id: doc.id,
            date: data.date ?? isoDate,
            foodId: data.foodId ?? '',
            phaseId: data.phaseId ?? '',
            done: Boolean(data.done)
          }
        })
        loadingDay.value = false
      },
      (err) => {
        error.value = err.message
        loadingDay.value = false
      }
    )
  }

  const bindRecentCaptures = (profileId: string, dates: string[]) => {
    unsubscribeRecent?.()
    recentCaptures.value = []
    error.value = ''

    if (!profileId || !dates.length) return

    loadingRecent.value = true
    const entriesRef = collection(db, 'profiles', profileId, 'entries')
    const entriesQuery = query(entriesRef, where('date', 'in', dates))

    unsubscribeRecent = onSnapshot(
      entriesQuery,
      (snapshot) => {
        recentCaptures.value = snapshot.docs.map((doc) => {
          const data = doc.data() as Partial<CaptureInput>
          return {
            id: doc.id,
            date: data.date ?? '',
            foodId: data.foodId ?? '',
            phaseId: data.phaseId ?? '',
            done: Boolean(data.done)
          }
        })
        loadingRecent.value = false
      },
      (err) => {
        error.value = err.message
        loadingRecent.value = false
      }
    )
  }

  const addCapture = async (profileId: string, payload: CaptureInput) => {
    if (!profileId || !payload.date || !payload.foodId || !payload.phaseId) return

    await addDoc(collection(db, 'profiles', profileId, 'entries'), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }

  const unbindCapturesByDate = () => {
    unsubscribeDay?.()
    unsubscribeDay = null
  }

  const unbindRecentCaptures = () => {
    unsubscribeRecent?.()
    unsubscribeRecent = null
  }

  return {
    capturesOfDay,
    recentCaptures,
    loadingDay,
    loadingRecent,
    error,
    bindCapturesByDate,
    bindRecentCaptures,
    addCapture,
    unbindCapturesByDate,
    unbindRecentCaptures
  }
})
