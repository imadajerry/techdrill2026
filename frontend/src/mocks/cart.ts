import type { CartItem } from '../types/cart'
import { catalogProducts } from './products'

function findProduct(productId: string) {
  const product = catalogProducts.find((item) => item.id === productId)

  if (!product) {
    throw new Error(`Product "${productId}" is not defined in mocks.`)
  }

  return product
}

export const initialCartItems: CartItem[] = [
  {
    id: 'cart-1',
    product: findProduct('shoe-1'),
    quantity: 1,
    size: 'UK 9',
  },
  {
    id: 'cart-2',
    product: findProduct('shoe-4'),
    quantity: 2,
    size: 'UK 8',
  },
]
