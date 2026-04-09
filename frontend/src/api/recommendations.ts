import apiClient from './client'
import type { ApiResponse } from '../types/api'
import type { Product } from '../types/product'

export async function getRecommendations(
  userId: string,
): Promise<ApiResponse<Product[]>> {
  const response = await apiClient.get<ApiResponse<Product[]>>(
    `/api/recommendations/${userId}`,
  )
  return response.data
}
