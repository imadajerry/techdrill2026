import apiClient from './client'
import type { ApiResponse } from '../types/api'
import type {
  AuthPayload,
  LoginInput,
  RegisterInput,
  VerifyOtpInput,
} from '../types/auth'

export async function login(
  input: LoginInput,
): Promise<ApiResponse<AuthPayload>> {
  const response = await apiClient.post<ApiResponse<AuthPayload>>(
    '/api/auth/login',
    input,
  )
  return response.data
}

export async function register(
  input: RegisterInput,
): Promise<ApiResponse<{ email: string }>> {
  const response = await apiClient.post<ApiResponse<{ email: string }>>(
    '/api/auth/register',
    input,
  )
  return response.data
}

export async function verifyOtp(
  input: VerifyOtpInput,
): Promise<ApiResponse<{ email: string }>> {
  const response = await apiClient.post<ApiResponse<{ email: string }>>(
    '/api/auth/verify-otp',
    input,
  )
  return response.data
}
