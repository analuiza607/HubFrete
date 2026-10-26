// ─── User ────────────────────────────────────────────────────────────────────
export type UserRole = 'EMBARCADOR' | 'TRANSPORTADOR' | 'ADMIN'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  created_at: string
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  success: boolean
  token: string
  user: User
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface LoginPayload {
  email: string
  password: string
}

// ─── Module ──────────────────────────────────────────────────────────────────
export interface Module {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  is_active: boolean
  route_path: string
  access_level: string | null
}

// ─── API Wrappers ─────────────────────────────────────────────────────────────
export interface ApiSuccess<T> {
  success: true
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: string
  message: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
