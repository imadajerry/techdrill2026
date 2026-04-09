import type { CustomerOrder } from '../types/order'
import { catalogProducts } from './products'

function findProduct(productId: string) {
  const product = catalogProducts.find((item) => item.id === productId)

  if (!product) {
    throw new Error(`Product "${productId}" is not defined in mocks.`)
  }

  return product
}

export const customerOrders: CustomerOrder[] = [
  {
    id: 'TD-24091',
    eta: '2026-04-11T18:30:00.000Z',
    items: [
      {
        id: 'line-1',
        product: findProduct('shoe-1'),
        quantity: 1,
        size: 'UK 9',
      },
    ],
    paymentMethod: 'Razorpay',
    placedAt: '2026-04-08T09:00:00.000Z',
    shippingAddress: '14 MG Road, Bengaluru',
    status: 'dispatched',
    total: 6499,
    trackingNote: 'Packed at the Bengaluru hub and transferred to BlueDart.',
  },
  {
    id: 'TD-24063',
    eta: '2026-04-10T18:30:00.000Z',
    items: [
      {
        id: 'line-2',
        product: findProduct('shoe-4'),
        quantity: 1,
        size: 'UK 8',
      },
      {
        id: 'line-3',
        product: findProduct('shoe-6'),
        quantity: 1,
        size: 'UK 8',
      },
    ],
    paymentMethod: 'UPI',
    placedAt: '2026-04-06T14:15:00.000Z',
    shippingAddress: '87 Residency Road, Hyderabad',
    status: 'processed',
    total: 9298,
    trackingNote: 'The warehouse team has completed QC and is printing labels.',
  },
  {
    id: 'TD-23988',
    eta: '2026-04-04T12:30:00.000Z',
    items: [
      {
        id: 'line-4',
        product: findProduct('shoe-2'),
        quantity: 1,
        size: 'UK 7',
      },
    ],
    paymentMethod: 'Card',
    placedAt: '2026-04-01T11:40:00.000Z',
    shippingAddress: '22 Boat Club Road, Chennai',
    status: 'delivered',
    total: 5899,
    trackingNote: 'Delivered to the front desk. Customer marked the fit as perfect.',
  },
]
