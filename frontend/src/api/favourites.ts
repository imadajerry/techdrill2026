import apiClient from './client'
import type { ApiResponse } from '../types/api'
import type { Product } from '../types/product'

export async function getFavourites(): Promise<ApiResponse<Product[]>> {
  const response = await apiClient.get<ApiResponse<Product[]>>(
    '/api/favourites',
  )
  return response.data
}

export async function getFavouriteIds(): Promise<ApiResponse<string[]>> {
  const response = await apiClient.get<ApiResponse<string[]>>(
    '/api/favourites/ids',
  )
  return response.data
}

export async function addFavourite(
  productId: string,
): Promise<ApiResponse<{ productId: string }>> {
  const response = await apiClient.post<ApiResponse<{ productId: string }>>(
    `/api/favourites/${productId}`,
  )
  return response.data
}

export async function removeFavourite(
  productId: string,
): Promise<ApiResponse<{ productId: string }>> {
  const response = await apiClient.delete<ApiResponse<{ productId: string }>>(
    `/api/favourites/${productId}`,
  )
  return response.data
}
