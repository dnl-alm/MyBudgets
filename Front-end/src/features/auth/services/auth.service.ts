import { http } from '@/shared/lib/http'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types'

export const authService = {
  login: (data: LoginRequest) =>
    http.post<AuthResponse>('/auth/login', data, { public: true }),
  register: (data: RegisterRequest) =>
    http.post<AuthResponse>('/auth/register', data, { public: true }),
}