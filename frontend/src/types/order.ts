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

export type PaymentMethod = 'Card' | 'COD' | 'Razorpay' | 'UPI'

export type CheckoutInput = {
  paymentMethod: PaymentMethod
  shippingAddress: string
  razorpayDetails?: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }
}

export type CustomerOrder = {
  id: string
  eta: string
  items: OrderLineItem[]
  paymentMethod: PaymentMethod
  placedAt: string
  shippingAddress: string
  status: OrderStatus
  total: number
  trackingNote: string
}
