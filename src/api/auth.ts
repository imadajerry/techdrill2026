import apiClient from './client'
import { mockLogin, mockRegister, mockVerifyOtp } from '../mocks/auth'
import type { ApiResponse } from '../types/api'
import type {
  AuthPayload,
  LoginInput,
  RegisterInput,
  VerifyOtpInput,
} from '../types/auth'

const USE_MOCK = true

export async function login(
  input: LoginInput,
): Promise<ApiResponse<AuthPayload>> {
  if (USE_MOCK) {
    return mockLogin(input)
  }

  const response = await apiClient.post<ApiResponse<AuthPayload>>(
    '/api/auth/login',
    input,
  )
  return response.data
}

export async function register(
  input: RegisterInput,
): Promise<ApiResponse<{ email: string }>> {
  if (USE_MOCK) {
    return mockRegister(input)
  }

  const response = await apiClient.post<ApiResponse<{ email: string }>>(
    '/api/auth/register',
    input,
  )
  return response.data
}

export async function verifyOtp(
  input: VerifyOtpInput,
): Promise<ApiResponse<{ email: string }>> {
  if (USE_MOCK) {
    return mockVerifyOtp(input)
  }

  const response = await apiClient.post<ApiResponse<{ email: string }>>(
    '/api/auth/verify-otp',
    input,
  )
  return response.data
}
