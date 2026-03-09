import api from './api'
import { User } from '../types'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  invitationToken?: string // invitation token (optional)
}

export interface VerifyEmailRequest {
  email: string
  verificationCode: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface RegisterResponse {
  message: string
  email: string
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', data)
    return response.data
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/verify-email', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/refresh')
    return response.data
  },
}
