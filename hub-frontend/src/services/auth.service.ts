import { api } from './api'
import type { AuthResponse, LoginPayload, RegisterPayload, User, Module, ApiSuccess } from '@/types'

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', payload)
    return data
  },

  register: async (payload: RegisterPayload): Promise<ApiSuccess<User>> => {
    const { data } = await api.post<ApiSuccess<User>>('/auth/register', payload)
    return data
  },

  me: async (): Promise<ApiSuccess<User>> => {
    const { data } = await api.get<ApiSuccess<User>>('/auth/me')
    return data
  },
}

// ─── Hub ──────────────────────────────────────────────────────────────────────
export const hubService = {
  getModules: async (): Promise<ApiSuccess<Module[]>> => {
    const { data } = await api.get<ApiSuccess<Module[]>>('/hub/modules')
    return data
  },
}
