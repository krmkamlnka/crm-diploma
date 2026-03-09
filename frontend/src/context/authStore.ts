import { create } from 'zustand'
import { AuthState, User } from '../types'
import { authService, LoginRequest, RegisterRequest, VerifyEmailRequest } from '../services/authService'

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<{ email: string; message: string }>
  verifyEmail: (email: string, code: string) => Promise<void>
  checkAuth: () => Promise<void>
  pendingVerificationEmail: string | null
  setPendingVerificationEmail: (email: string | null) => void
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  invitationCode: string
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  pendingVerificationEmail: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setPendingVerificationEmail: (email) => set({ pendingVerificationEmail: email }),

  login: async (email: string, password: string) => {
    console.log('[AuthStore] Starting login...')
    set({ isLoading: true })
    try {
      const loginData: LoginRequest = { email, password }
      const response = await authService.login(loginData)

      console.log('[AuthStore] Login successful, user:', response.user)
      console.log('[AuthStore] Setting user in store...')

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false
      })

      console.log('[AuthStore] User set in store, isAuthenticated:', true)
    } catch (error) {
      console.error('[AuthStore] Login error:', error)
      set({ isLoading: false })
      throw error
    }
  },

  logout: async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      set({ user: null, isAuthenticated: false })
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true })
    try {
      const registerData: RegisterRequest = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        invitationToken: data.invitationCode || undefined,
      }

      console.log('AuthStore: Sending register request with data:', registerData)
      const response = await authService.register(registerData)
      console.log('AuthStore: Received register response:', response)
      set({ isLoading: false })

      return {
        email: response.email,
        message: response.message,
      }
    } catch (error) {
      console.error('AuthStore: Registration error:', error)
      set({ isLoading: false })
      throw error
    }
  },

  verifyEmail: async (email: string, code: string) => {
    set({ isLoading: true })
    try {
      const verifyData: VerifyEmailRequest = {
        email,
        verificationCode: code,
      }

      const response = await authService.verifyEmail(verifyData)

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false
      })
    } catch (error) {
      console.error('Email verification error:', error)
      set({ isLoading: false })
      throw error
    }
  },

  checkAuth: async () => {
    console.log('[AuthStore] checkAuth called')
    set({ isLoading: true })
    try {
      console.log('[AuthStore] Fetching current user from /auth/me...')
      const user = await authService.getCurrentUser()
      console.log('[AuthStore] checkAuth success, user:', user)
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      console.log('[AuthStore] checkAuth failed:', error)
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
