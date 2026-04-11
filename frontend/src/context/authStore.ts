import { create } from 'zustand'
import { AuthState, User } from '../types'
import { authService, LoginRequest, RegisterRequest, tokenStorage } from '../services/authService'

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void
  updateUser: (partial: Partial<User>) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<void>
  checkAuth: () => Promise<void>
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  invitationToken?: string
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with true to check auth on mount

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  updateUser: (partial) => set((state) => ({
    user: state.user ? { ...state.user, ...partial } : null,
  })),

  login: async (email: string, password: string) => {
    console.log('[AuthStore] Starting login...')
    set({ isLoading: true })
    try {
      const loginData: LoginRequest = { email, password }
      const response = await authService.login(loginData)

      console.log('[AuthStore] Login successful, user:', response.user)

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false
      })
    } catch (error) {
      console.error('[AuthStore] Login error:', error)
      set({ isLoading: false })
      throw error
    }
  },

  logout: async () => {
    console.log('[AuthStore] Starting logout...')
    try {
      await authService.logout()
    } catch (error) {
      console.error('[AuthStore] Logout error:', error)
    } finally {
      set({ user: null, isAuthenticated: false })
    }
  },

  register: async (data: RegisterData) => {
    console.log('[AuthStore] Starting registration...')
    try {
      const registerData: RegisterRequest = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
        invitationToken: data.invitationToken || undefined,
      }

      await authService.register(registerData)
      console.log('[AuthStore] Registration successful, awaiting email verification')
    } catch (error) {
      console.error('[AuthStore] Registration error:', error)
      throw error
    }
  },

  checkAuth: async () => {
    console.log('[AuthStore] Checking authentication...')

    // First check if we have a token
    if (!tokenStorage.getAccessToken()) {
      console.log('[AuthStore] No token found, user not authenticated')
      set({ user: null, isAuthenticated: false, isLoading: false })
      return
    }

    set({ isLoading: true })
    try {
      const user = await authService.getCurrentUser()
      console.log('[AuthStore] Auth check successful, user:', user)
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      console.log('[AuthStore] Auth check failed:', error)
      tokenStorage.clearTokens()
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
