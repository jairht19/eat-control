import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User
} from 'firebase/auth'
import { auth } from './client'

const googleProvider = new GoogleAuthProvider()

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider)
export const logoutUser = () => signOut(auth)

export const observeAuthUser = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback)
