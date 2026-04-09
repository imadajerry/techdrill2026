import apiClient from './client'
import type { ApiResponse } from '../types/api'
import type { CartItem } from '../types/cart'

export async function getCart(): Promise<ApiResponse<CartItem[]>> {
  const response = await apiClient.get<ApiResponse<CartItem[]>>('/api/cart')
  return response.data
}

export async function addToCart(
  productId: string,
  size: string,
  quantity: number,
  price: number,
): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>('/api/cart', {
    product_id: productId,
    size,
    quantity,
    price,
  })
  return response.data
}

export async function updateCartItem(
  id: string,
  quantity: number,
): Promise<ApiResponse<{ id: string }>> {
  const response = await apiClient.put<ApiResponse<{ id: string }>>(
    `/api/cart/${id}`,
    { quantity },
  )
  return response.data
}

export async function removeCartItem(
  id: string,
): Promise<ApiResponse<{ id: string }>> {
  const response = await apiClient.delete<ApiResponse<{ id: string }>>(
    `/api/cart/${id}`,
  )
  return response.data
}

export async function clearCart(): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>('/api/cart')
  return response.data
}
