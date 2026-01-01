import { create } from 'zustand'
import { AuthState, User } from '../types'

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (data: RegisterData) => Promise<void>
}

interface RegisterData {
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

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      // TODO: Replace with actual API call
      console.log('Login:', email, password)

      // Mock user for development - role based on email
      let role: 'super_admin' | 'admin' | 'instructor' | 'student' = 'student'
      let firstName = 'Студент'
      let lastName = 'Тестовый'

      if (email.includes('admin')) {
        role = 'admin'
        firstName = 'Админ'
        lastName = 'Системный'
      } else if (email.includes('instructor') || email.includes('teacher')) {
        role = 'instructor'
        firstName = 'Преподаватель'
        lastName = 'Тестовый'
      } else {
        role = 'student'
        firstName = 'Студент'
        lastName = 'Тестовый'
      }

      const mockUser: User = {
        id: '1',
        email,
        firstName,
        lastName,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEmailVerified: true,
      }

      set({ user: mockUser, isAuthenticated: true, isLoading: false })
    } catch (error) {
      console.error('Login error:', error)
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => {
    // TODO: Call API to invalidate token
    set({ user: null, isAuthenticated: false })
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true })
    try {
      // TODO: Replace with actual API call
      console.log('Register:', data)

      set({ isLoading: false })
    } catch (error) {
      console.error('Registration error:', error)
      set({ isLoading: false })
      throw error
    }
  },
}))
