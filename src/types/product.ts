export type Product = {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  image: string
  description: string
  stock: number
  badge?: string
  targetGroup?: 'Men' | 'Women' | 'Unisex' | 'Kids'
}
