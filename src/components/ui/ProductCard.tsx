import type { Product } from '../../types/product'
import { formatCurrency } from '../../utils/formatCurrency'
import styles from './ProductCard.module.css'

type ProductCardProps = {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          alt={product.name}
          className={styles.image}
          src={product.image}
        />
      </div>
      <div className={styles.content}>
        <p className={styles.category}>{product.category}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <div className={styles.priceGroup}>
            <span className={styles.price}>{formatCurrency(product.price)}</span>
            {product.originalPrice ? (
              <span className={styles.originalPrice}>
                {formatCurrency(product.originalPrice)}
              </span>
            ) : null}
          </div>
          <span className={styles.badge}>
            {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
          </span>
        </div>
      </div>
    </article>
  )
}
