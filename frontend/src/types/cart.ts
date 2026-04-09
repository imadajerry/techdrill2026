import type { Product } from './product'

export type CartItem = {
  id: string
  product: Product
  quantity: number
  size: string
}
