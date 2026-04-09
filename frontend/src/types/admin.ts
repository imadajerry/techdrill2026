import type { UserRole } from './auth'
import type { OrderStatus } from './order'
import type { Product } from './product'

export type AdminOrderRecord = {
  customerEmail: string
  customerName: string
  id: string
  itemCount: number
  paymentStatus: 'paid' | 'pending' | 'refunded'
  placedAt: string
  status: OrderStatus
  total: number
}

export type InventoryItem = Product & {
  reorderLevel: number
  reservedStock: number
  sku: string
}

export type ManagedUser = {
  email: string
  id: string
  joinedAt: string
  name: string
  ordersCount: number
  role: UserRole
  status: 'active' | 'blocked' | 'pending'
}

export type ReportTemplate = {
  description: string
  format: 'xlsx' | 'pdf'
  id: string
  periodLabel: string
  title: string
}

export type ExportRecord = {
  format: 'xlsx' | 'pdf'
  generatedAt: string
  id: string
  requestedBy: string
  status: 'ready' | 'processing'
  title: string
}

export type PricingCampaign = {
  basePrice: number
  endsAt: string
  id: string
  name: string
  productName: string
  salePrice: number
  startsAt: string
  status: 'scheduled' | 'live' | 'ended'
}

export type PriceHistoryEntry = {
  amount: number
  effectiveAt: string
  id: string
  note: string
  productName: string
}
