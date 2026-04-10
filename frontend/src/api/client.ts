import axios from 'axios'
import { readStoredSession } from '../utils/session'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8586',
})

apiClient.interceptors.request.use((config) => {
  const session = readStoredSession()

  if (session?.token) {
    config.headers.set('Authorization', `Bearer ${session.token}`)
  }

  return config
})

export default apiClient
