import type { DecodedToken } from '../types/auth'

export function decodeJWT(token: string): DecodedToken | null {
  const parts = token.split('.')

  if (parts.length < 2) {
    return null
  }

  try {
    const normalizedPayload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const decodedPayload = atob(normalizedPayload)
    return JSON.parse(decodedPayload) as DecodedToken
  } catch {
    return null
  }
}
