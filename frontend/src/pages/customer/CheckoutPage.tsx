import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import PageIntro from '../../components/ui/PageIntro'
import SectionCard from '../../components/ui/SectionCard'
import StatusBadge from '../../components/ui/StatusBadge'
import { createRazorpayOrder } from '../../api/orders'
import { useAppState } from '../../context/AppStateContext'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency } from '../../utils/formatCurrency'
import styles from './CustomerPages.module.css'

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cartItems, placeOrder } = useAppState()
  const [shippingAddress, setShippingAddress] = useState('')
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

    const isScriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!isScriptLoaded) {
      setErrorMessage("Razorpay SDK failed to load. Please check your internet connection.");
      setIsSubmitting(false);
      return;
    }

    try {
      const orderResponse = await createRazorpayOrder(total);
      if (!orderResponse.success) {
        setErrorMessage("Failed to secure checkout session. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const { id: order_id, currency, amount } = orderResponse.data;

      const options = {
        key: 'rzp_test_SbZLWD4zl8YqhQ', // As supplied from the earlier backend envs
        amount: amount.toString(),
        currency: currency,
        name: 'TechDrill2026',
        description: 'Complete your purchase',
        order_id: order_id,
        handler: async (response: any) => {
          // Success Callback: Proceed with local application state order placement
          const createdOrder = placeOrder(
            {
              paymentMethod: 'Razorpay',
              shippingAddress,
              razorpayDetails: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
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
        },
        prefill: {
          name: user?.name ?? '',
          email: user?.email ?? '',
        },
        theme: { color: '#3399cc' },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setErrorMessage(response.error.description);
        setIsSubmitting(false);
      });
      rzp.open();

    } catch (error) {
      setErrorMessage("Checkout service unavailable. Please contact support.");
      setIsSubmitting(false);
    }
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
        description="Confirm delivery details and convert the active bag into a live order using Razorpay."
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
              <span className={styles.checkoutLabel}>Payment method: Razorpay</span>
            </div>

            <StatusBadge tone="success">
              Orders placed from checkout are marked paid through Razorpay.
            </StatusBadge>

            {errorMessage ? (
              <div className={styles.checkoutError}>{errorMessage}</div>
            ) : null}

            <button
              className={styles.checkoutButton}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Placing order...' : 'Pay with Razorpay'}
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
