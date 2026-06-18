import { create } from 'zustand'
import { tokenStorage } from '@/shared/lib/http'

interface AuthUser {
  email: string
  name: string
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setAuth: (token: string, user: AuthUser) => void
  logout: () => void
}

function decodeTokenPayload(token: string): AuthUser | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const decoded = JSON.parse(atob(payload)) as Record<string, unknown>
    return {
      email: String(decoded['sub'] ?? ''),
      name: String(decoded['name'] ?? decoded['sub'] ?? ''),
    }
  } catch {
    return null
  }
}

function getInitialState(): Pick<AuthState, 'token' | 'user' | 'isAuthenticated'> {
  const token = tokenStorage.get()
  if (!token) return { token: null, user: null, isAuthenticated: false }
  const user = decodeTokenPayload(token)
  return { token, user, isAuthenticated: true }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),
  setAuth: (token, user) => {
    tokenStorage.set(token)
    set({ token, user, isAuthenticated: true })
  },
  logout: () => {
    tokenStorage.remove()
    set({ token: null, user: null, isAuthenticated: false })
  },
}))