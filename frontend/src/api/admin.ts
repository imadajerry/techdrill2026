import apiClient from './client'
import type { ApiResponse } from '../types/api'
import type {
  AdminOrderRecord,
  InventoryItem,
  ManagedUser,
} from '../types/admin'
import type { DashboardSummary } from '../types/dashboard'
import type { OrderStatus } from '../types/order'

// Dashboard
export async function getDashboard(): Promise<ApiResponse<DashboardSummary>> {
  const response = await apiClient.get<ApiResponse<DashboardSummary>>(
    '/api/admin/dashboard',
  )
  return response.data
}

// Orders
export async function getAllOrders(): Promise<ApiResponse<AdminOrderRecord[]>> {
  const response = await apiClient.get<ApiResponse<AdminOrderRecord[]>>(
    '/api/orders',
  )
  return response.data
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<ApiResponse<{ id: string; status: OrderStatus; trackingNote: string }>> {
  const response = await apiClient.put<
    ApiResponse<{ id: string; status: OrderStatus; trackingNote: string }>
  >(`/api/orders/${id}/status`, { status })
  return response.data
}

// Users
export async function getUsers(): Promise<ApiResponse<ManagedUser[]>> {
  const response = await apiClient.get<ApiResponse<ManagedUser[]>>(
    '/api/admin/users',
  )
  return response.data
}

export async function updateUserStatus(
  id: string,
  status: 'active' | 'blocked' | 'pending',
): Promise<ApiResponse<{ id: string; status: string }>> {
  const response = await apiClient.put<
    ApiResponse<{ id: string; status: string }>
  >(`/api/admin/users/${id}`, { status })
  return response.data
}

// Inventory
export async function getInventory(): Promise<ApiResponse<InventoryItem[]>> {
  const response = await apiClient.get<ApiResponse<InventoryItem[]>>(
    '/api/admin/inventory',
  )
  return response.data
}

export async function updateInventory(
  id: string,
  data: { stock?: number; price?: number },
): Promise<ApiResponse<{ id: string }>> {
  const response = await apiClient.put<ApiResponse<{ id: string }>>(
    `/api/admin/inventory/${id}`,
    data,
  )
  return response.data
}

// Reports
export async function getOrderReport(
  start?: string,
  end?: string,
): Promise<ApiResponse<unknown>> {
  const response = await apiClient.get('/api/admin/reports/orders', {
    params: { start, end },
  })
  return response.data
}

export async function getPaymentReport(
  start?: string,
  end?: string,
): Promise<ApiResponse<unknown>> {
  const response = await apiClient.get('/api/admin/reports/payments', {
    params: { start, end },
  })
  return response.data
}
