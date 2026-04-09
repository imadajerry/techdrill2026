import type { Product } from '../types/product'

export const catalogProducts: Product[] = [
  {
    id: 'shoe-1',
    name: 'Velocity Sprint',
    category: 'Running',
    price: 6499,
    originalPrice: 7999,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    description: 'Lightweight daily trainer built for long city miles.',
    stock: 12,
    badge: 'New',
    targetGroup: 'Men',
  },
  {
    id: 'shoe-2',
    name: 'Studio Court',
    category: 'Lifestyle',
    price: 5899,
    image:
      'https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=900&q=80',
    description: 'Minimal low-top silhouette with premium leather finish.',
    stock: 8,
    badge: 'Bestseller',
    targetGroup: 'Women',
  },
  {
    id: 'shoe-3',
    name: 'Summit Trek',
    category: 'Outdoor',
    price: 7299,
    originalPrice: 8599,
    image:
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
    description: 'Trail-ready support with all-weather grip and cushioning.',
    stock: 5,
    badge: 'Low stock',
    targetGroup: 'Unisex',
  },
  {
    id: 'shoe-4',
    name: 'Metro Glide',
    category: 'Lifestyle',
    price: 5299,
    originalPrice: 6199,
    image:
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80',
    description: 'Soft neutral palette with cushioned comfort for all-day wear.',
    stock: 16,
    badge: 'Weekend pick',
    targetGroup: 'Men',
  },
  {
    id: 'shoe-5',
    name: 'Circuit Pulse',
    category: 'Training',
    price: 6999,
    image:
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80',
    description: 'Stability-focused cross trainer for quick cuts and indoor sessions.',
    stock: 10,
    badge: 'Trainer',
    targetGroup: 'Women',
  },
  {
    id: 'shoe-6',
    name: 'Canvas Draft',
    category: 'Casual',
    price: 3999,
    originalPrice: 4699,
    image:
      'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=900&q=80',
    description: 'Clean everyday canvas pair with a low-profile cup sole.',
    stock: 21,
    badge: 'Everyday',
    targetGroup: 'Unisex',
  },
]

export const featuredProducts = catalogProducts.slice(0, 3)

export const favouriteProducts = catalogProducts.filter((product) =>
  ['shoe-2', 'shoe-4', 'shoe-6'].includes(product.id),
)

export const recommendedProducts = catalogProducts.filter((product) =>
  ['Running', 'Lifestyle', 'Training'].includes(product.category),
)

export const productCategories = Array.from(
  new Set(catalogProducts.map((product) => product.category)),
)
