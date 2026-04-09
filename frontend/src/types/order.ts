import type { Product } from './product'

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'rejected'
  | 'processed'
  | 'dispatched'
  | 'delivered'

export type OrderLineItem = {
  id: string
  product: Product
  quantity: number
  size: string
}

export type CustomerOrder = {
  id: string
  eta: string
  items: OrderLineItem[]
  paymentMethod: string
  placedAt: string
  shippingAddress: string
  status: OrderStatus
  total: number
  trackingNote: string
}
