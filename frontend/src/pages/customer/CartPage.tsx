import { Link } from 'react-router-dom'
import SectionCard from '../../components/ui/SectionCard'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAppState } from '../../context/AppStateContext'
import { formatCurrency } from '../../utils/formatCurrency'
import styles from './CustomerPages.module.css'

export default function CartPage() {
  const {
    addToCart,
    cartItems,
    recommendedProducts,
    removeCartItem,
    updateCartItemQuantity,
  } = useAppState()

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )
  const savings = cartItems.reduce((sum, item) => {
    const originalPrice = item.product.originalPrice ?? item.product.price
    return sum + Math.max(0, originalPrice - item.product.price) * item.quantity
  }, 0)
  const shipping = cartItems.length === 0 || subtotal >= 10000 ? 0 : 299
  const total = subtotal + shipping
  const amountForFreeShipping = Math.max(0, 10000 - subtotal)

  return (
    <div className={styles.page}>
      <div className={styles.cartLayout}>
        <SectionCard
          title="Bag items"
        >
          {cartItems.length === 0 ? (
            <p className={styles.emptyState}>
              Your cart is empty. Browse the collection and add a few pairs to
              continue the main buy flow.
            </p>
          ) : (
            <div className={styles.cartList}>
              {cartItems.map((item) => (
                <article className={styles.cartItem} key={item.id}>
                  <img
                    alt={item.product.name}
                    className={styles.itemImage}
                    src={item.product.image}
                  />
                  <div className={styles.itemBody}>
                    <div className={styles.itemHeader}>
                      <div>
                        <h3 className={styles.itemName}>{item.product.name}</h3>
                        <p className={styles.itemMeta}>
                          {item.product.category} · Size {item.size}
                        </p>
                      </div>
                      <div className={styles.priceBlock}>
                        {formatCurrency(item.product.price * item.quantity)}
                        {item.product.originalPrice ? (
                          <span className={styles.mutedPrice}>
                            {formatCurrency(item.product.originalPrice * item.quantity)}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className={styles.inlineMeta}>
                      <StatusBadge tone="accent">
                        {item.product.stock} left in stock
                      </StatusBadge>
                      {item.product.badge ? (
                        <StatusBadge>{item.product.badge}</StatusBadge>
                      ) : null}
                    </div>

                    <div className={styles.controlRow}>
                      <div className={styles.quantityControl}>
                        <button
                          className={styles.quantityButton}
                          onClick={() => updateCartItemQuantity(item.id, -1)}
                          type="button"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className={styles.quantityButton}
                          onClick={() => updateCartItemQuantity(item.id, 1)}
                          type="button"
                        >
                          +
                        </button>
                      </div>
                        <button
                          className={styles.removeButton}
                          onClick={() => removeCartItem(item.id)}
                          type="button"
                        >
                        Remove item
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          {cartItems.length > 0 ? (
            <Link className={styles.checkoutInlineButton} to="/checkout">
              Checkout
            </Link>
          ) : null}
        </SectionCard>

        <div className={styles.stack}>
          <StatCard
          helper={
            shipping === 0
              ? 'Your order already qualifies for free express shipping.'
              : `${formatCurrency(amountForFreeShipping)} away from free shipping.`
          }
          label="Shipping"
          value={shipping === 0 ? 'Free' : formatCurrency(shipping)}
        />
          <SectionCard title="Order summary">
            <div className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Savings</span>
                <span>-{formatCurrency(savings)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`.trim()}>
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Add one more pair"
          >
            <div className={styles.recommendationList}>
              {recommendedProducts.slice(0, 3).map((product) => (
                <article className={styles.recommendationItem} key={product.id}>
                  <img
                    alt={product.name}
                    className={styles.recommendationThumb}
                    src={product.image}
                  />
                  <div>
                    <h3 className={styles.recommendationName}>{product.name}</h3>
                    <p className={styles.recommendationCopy}>{product.category}</p>
                  </div>
                  <div className={styles.recommendationActions}>
                    <StatusBadge tone="dark">
                      {formatCurrency(product.price)}
                    </StatusBadge>
                    <button
                      className={styles.inlineAction}
                      onClick={() => addToCart(product.id, 'UK 8')}
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
