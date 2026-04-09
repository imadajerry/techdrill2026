import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import PageIntro from '../../components/ui/PageIntro'
import SectionCard from '../../components/ui/SectionCard'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAppState } from '../../context/AppStateContext'
import { useAuth } from '../../context/AuthContext'
import type { PaymentMethod } from '../../types/order'
import { formatCurrency } from '../../utils/formatCurrency'
import styles from './CustomerPages.module.css'

const paymentOptions: PaymentMethod[] = ['Razorpay', 'UPI', 'Card', 'COD']

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cartItems, placeOrder } = useAppState()
  const [shippingAddress, setShippingAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Razorpay')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (cartItems.length === 0) {
    return <Navigate replace to="/cart" />
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )
  const shipping = subtotal >= 10000 ? 0 : 299
  const total = subtotal + shipping

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!shippingAddress.trim()) {
      setErrorMessage('Shipping address is required before placing the order.')
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    const createdOrder = placeOrder(
      {
        paymentMethod,
        shippingAddress,
      },
      {
        email: user?.email ?? 'customer@techdrill.dev',
        name: user?.name ?? 'TechDrill Customer',
      },
    )

    setIsSubmitting(false)

    if (!createdOrder) {
      setErrorMessage('Unable to place the order from the current cart state.')
      return
    }

    navigate('/orders', {
      replace: true,
      state: {
        placedOrderId: createdOrder.id,
      },
    })
  }

  return (
    <div className={styles.page}>
      <PageIntro
        actions={
          <>
            <Link className={styles.secondaryAction} to="/cart">
              Back to cart
            </Link>
            <Link className={styles.primaryAction} to="/orders">
              Review order history
            </Link>
          </>
        }
        description="Confirm delivery details, choose a payment method, and convert the active bag into a live order."
        eyebrow="Checkout"
        title="Place the order."
      />

      <div className={styles.checkoutLayout}>
        <SectionCard
          description="This step now creates real customer and admin order records inside the shared app state."
          title="Delivery and payment"
        >
          <form className={styles.checkoutForm} onSubmit={handleSubmit}>
            <label className={styles.checkoutField}>
              <span className={styles.checkoutLabel}>Shipping address</span>
              <textarea
                className={styles.checkoutTextarea}
                onChange={(event) => setShippingAddress(event.target.value)}
                placeholder="House or flat number, street, city, state, postal code"
                rows={5}
                value={shippingAddress}
              />
            </label>

            <div className={styles.checkoutField}>
              <span className={styles.checkoutLabel}>Payment method</span>
              <div className={styles.paymentGrid}>
                {paymentOptions.map((option) => (
                  <button
                    className={`${styles.paymentOption} ${
                      paymentMethod === option ? styles.paymentOptionActive : ''
                    }`.trim()}
                    key={option}
                    onClick={() => setPaymentMethod(option)}
                    type="button"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'COD' ? (
              <StatusBadge tone="warning">
                COD orders enter the admin queue with pending payment.
              </StatusBadge>
            ) : (
              <StatusBadge tone="success">
                Online payment orders are marked paid as soon as they are placed.
              </StatusBadge>
            )}

            {errorMessage ? (
              <div className={styles.checkoutError}>{errorMessage}</div>
            ) : null}

            <button
              className={styles.checkoutButton}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Placing order...' : 'Place order'}
            </button>
          </form>
        </SectionCard>

        <div className={styles.stack}>
          <SectionCard
            description="The order summary uses the same cart math shown on the bag page."
            title="Review"
          >
            <div className={styles.checkoutItems}>
              {cartItems.map((item) => (
                <article className={styles.checkoutItem} key={item.id}>
                  <img
                    alt={item.product.name}
                    className={styles.lineThumb}
                    src={item.product.image}
                  />
                  <div>
                    <p className={styles.lineTitle}>{item.product.name}</p>
                    <p className={styles.lineCopy}>
                      {item.product.category} · Qty {item.quantity} · Size {item.size}
                    </p>
                  </div>
                  <StatusBadge tone="dark">
                    {formatCurrency(item.product.price * item.quantity)}
                  </StatusBadge>
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            description="Express shipping remains free above the current threshold."
            title="Totals"
          >
            <div className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
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
        </div>
      </div>
    </div>
  )
}
