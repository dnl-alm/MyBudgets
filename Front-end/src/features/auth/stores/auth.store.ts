import { create } from 'zustand'
import { tokenStorage } from '@/shared/lib/http'

const USER_KEY = 'mybudgets:user'

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

/**
 * Helpers para persistir o user no localStorage.
 * Token e user são salvos juntos para sobreviver ao refresh da página.
 */
const userStorage = {
  get: (): AuthUser | null => {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthUser
    } catch {
      return null
    }
  },
  set: (user: AuthUser): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  remove: (): void => {
    localStorage.removeItem(USER_KEY)
  },
}

/**
 * Hidrata o store antes do React montar — evita flash de "não autenticado".
 */
function getInitialState(): Pick<AuthState, 'token' | 'user' | 'isAuthenticated'> {
  const token = tokenStorage.get()
  const user = userStorage.get()

  if (!token || !user) {
    return { token: null, user: null, isAuthenticated: false }
  }

  return { token, user, isAuthenticated: true }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),

  setAuth: (token, user) => {
    tokenStorage.set(token)
    userStorage.set(user)
    set({ token, user, isAuthenticated: true })
  },

  logout: () => {
    tokenStorage.remove()
    userStorage.remove()
    set({ token: null, user: null, isAuthenticated: false })
  },
}))