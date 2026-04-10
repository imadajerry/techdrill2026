import apiClient from './client'
import type { ApiResponse } from '../types/api'
import type { CustomerOrder } from '../types/order'

export type PlaceOrderInput = {
  items: Array<{
    product_id: string
    quantity: number
    size: string
    price: number
  }>
  total_amount: number
  payment_method: string
  shipping_address: string
  razorpay_order_id?: string
  razorpay_payment_id?: string
  razorpay_signature?: string
}

export async function placeOrder(
  input: PlaceOrderInput,
): Promise<ApiResponse<CustomerOrder>> {
  const response = await apiClient.post<ApiResponse<CustomerOrder>>(
    '/api/orders',
    input,
  )
  return response.data
}

export async function getMyOrders(): Promise<ApiResponse<CustomerOrder[]>> {
  const response = await apiClient.get<ApiResponse<CustomerOrder[]>>(
    '/api/orders/mine',
  )
  return response.data
}

export async function createRazorpayOrder(amount: number): Promise<ApiResponse<{ id: string, currency: string, amount: number }>> {
  const response = await apiClient.post('/api/orders/razorpay-order', { amount });
  return response.data;
}
