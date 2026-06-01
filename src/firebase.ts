import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../.firebase.config'

export const firebaseApp = initializeApp(firebaseConfig)
export const analytics = getAnalytics(firebaseApp)
