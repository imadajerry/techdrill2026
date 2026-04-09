import { Heart, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { useAppState } from '../../context/AppStateContext'
import type { Product } from '../../types/product'
import { formatCurrency } from '../../utils/formatCurrency'
import styles from './ProductCard.module.css'

type ProductCardProps = {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    addToCart,
    availableSizes,
    getCartQuantity,
    isFavourite,
    toggleFavourite,
  } = useAppState()
  const [selectedSize, setSelectedSize] = useState(availableSizes[1] ?? availableSizes[0])
  const [feedback, setFeedback] = useState('')
  const favourite = isFavourite(product.id)
  const inCartQuantity = getCartQuantity(product.id)

  function handleAddToCart() {
    const result = addToCart(product.id, selectedSize)

    if (result === 'out-of-stock') {
      setFeedback('Out of stock for new bag adds.')
      return
    }

    if (result === 'max-stock') {
      setFeedback('Bag already matches available stock.')
      return
    }

    setFeedback(result === 'added' ? 'Added to bag.' : 'Bag quantity updated.')
  }

  function handleToggleFavourite() {
    const nextFavourite = toggleFavourite(product.id)
    setFeedback(nextFavourite ? 'Saved to favourites.' : 'Removed from favourites.')
  }

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
        <div className={styles.metaRow}>
          <label className={styles.sizePicker}>
            <span className={styles.sizeLabel}>Size</span>
            <select
              className={styles.select}
              onChange={(event) => setSelectedSize(event.target.value)}
              value={selectedSize}
            >
              {availableSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          {inCartQuantity > 0 ? (
            <span className={styles.cartCount}>{inCartQuantity} in bag</span>
          ) : null}
        </div>
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
        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            type="button"
          >
            <ShoppingBag size={16} />
            Add to bag
          </button>
          <button
            aria-pressed={favourite}
            className={`${styles.secondaryButton} ${
              favourite ? styles.secondaryButtonActive : ''
            }`.trim()}
            onClick={handleToggleFavourite}
            type="button"
          >
            <Heart fill={favourite ? 'currentColor' : 'none'} size={16} />
            {favourite ? 'Saved' : 'Save'}
          </button>
        </div>
        {feedback ? <p className={styles.feedback}>{feedback}</p> : null}
      </div>
    </article>
  )
}
