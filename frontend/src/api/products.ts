import apiClient from './client'
import type { ApiResponse } from '../types/api'
import type { Product } from '../types/product'

export async function getProducts(
  params?: { category?: string; search?: string },
): Promise<ApiResponse<Product[]>> {
  const response = await apiClient.get<ApiResponse<Product[]>>('/api/products', {
    params,
  })
  return response.data
}

export async function getProduct(
  id: string,
): Promise<ApiResponse<Product>> {
  const response = await apiClient.get<ApiResponse<Product>>(
    `/api/products/${id}`,
  )
  return response.data
}

export async function createProduct(
  product: Omit<Product, 'id'> & { sku?: string; reorder_level?: number },
): Promise<ApiResponse<{ id: string }>> {
  const response = await apiClient.post<ApiResponse<{ id: string }>>(
    '/api/products',
    product,
  )
  return response.data
}

export async function updateProduct(
  id: string,
  product: Partial<Product & { sku?: string; reorder_level?: number }>,
): Promise<ApiResponse<{ id: string }>> {
  const response = await apiClient.put<ApiResponse<{ id: string }>>(
    `/api/products/${id}`,
    product,
  )
  return response.data
}

export async function deleteProduct(
  id: string,
): Promise<ApiResponse<{ id: string }>> {
  const response = await apiClient.delete<ApiResponse<{ id: string }>>(
    `/api/products/${id}`,
  )
  return response.data
}
