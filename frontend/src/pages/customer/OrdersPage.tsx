import { useState } from 'react'
import { Link } from 'react-router-dom'
import OrderTimeline from '../../components/ui/OrderTimeline'
import PageIntro from '../../components/ui/PageIntro'
import SectionCard from '../../components/ui/SectionCard'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAppState } from '../../context/AppStateContext'
import type { OrderStatus } from '../../types/order'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import styles from './CustomerPages.module.css'

const statusOptions: Array<'all' | OrderStatus> = [
  'all',
  'placed',
  'accepted',
  'processed',
  'dispatched',
  'delivered',
  'rejected',
]

function getOrderTone(status: OrderStatus) {
  if (status === 'delivered') {
    return 'success'
  }

  if (status === 'rejected') {
    return 'danger'
  }

  if (status === 'dispatched' || status === 'processed') {
    return 'accent'
  }

  return 'warning'
}

export default function OrdersPage() {
  const { customerOrders } = useAppState()
  const [selectedStatus, setSelectedStatus] = useState<'all' | OrderStatus>('all')

  const filteredOrders =
    selectedStatus === 'all'
      ? customerOrders
      : customerOrders.filter((order) => order.status === selectedStatus)

  const liveOrders = customerOrders.filter(
    (order) => !['delivered', 'rejected'].includes(order.status),
  ).length
  const deliveredOrders = customerOrders.filter(
    (order) => order.status === 'delivered',
  ).length

  return (
    <div className={styles.page}>
      <PageIntro
        actions={
          <>
            <Link className={styles.primaryAction} to="/products">
              Shop more
            </Link>
            <Link className={styles.secondaryAction} to="/cart">
              Open cart
            </Link>
          </>
        }
        description="Order tracking now has a dedicated routed surface with stage badges, timeline visualization, delivery details, and room for future live status updates."
        eyebrow="Customer orders"
        title="Track every order from placement to delivery."
      />

      <div className={styles.statsGrid}>
        <StatCard
          helper="Accepted, processed, and dispatched orders stay visible at the top of the feed."
          label="Active orders"
          value={`${liveOrders}`}
        />
        <StatCard
          helper="Delivered orders remain in history with the same shared status vocabulary."
          label="Delivered"
          tone="accent"
          value={`${deliveredOrders}`}
        />
        <StatCard
          helper="Order updates now depend on backend status changes instead of seeded frontend fixtures."
          label="Tracking mode"
          tone="dark"
          value="Backend"
        />
      </div>

      <SectionCard
        description="Status filters use the same labels that the admin order pipeline works with, so both sides of the product share one language."
        title="Order history"
      >
        <div className={styles.filterRow}>
          {statusOptions.map((status) => (
            <button
              className={`${styles.filterButton} ${
                selectedStatus === status ? styles.filterActive : ''
              }`.trim()}
              key={status}
              onClick={() => setSelectedStatus(status)}
              type="button"
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>

        <div className={styles.orderList}>
          {filteredOrders.map((order) => (
            <SectionCard key={order.id}>
              <div className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <h3 className={styles.orderTitle}>Order {order.id}</h3>
                    <p className={styles.orderMeta}>
                      Placed {formatDate(order.placedAt)} · {order.paymentMethod}
                    </p>
                  </div>
                  <div className={styles.orderAside}>
                    <StatusBadge tone={getOrderTone(order.status)}>
                      {order.status}
                    </StatusBadge>
                    <p className={styles.orderTotal}>
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>

                <OrderTimeline status={order.status} />

                <div className={styles.orderDetails}>
                  <div className={styles.detailBlock}>
                    <span className={styles.detailLabel}>Deliver to</span>
                    <div className={styles.detailValue}>{order.shippingAddress}</div>
                  </div>
                  <div className={styles.detailBlock}>
                    <span className={styles.detailLabel}>Expected by</span>
                    <div className={styles.detailValue}>{formatDate(order.eta)}</div>
                  </div>
                </div>

                <div className={styles.lineItems}>
                  {order.items.map((item) => (
                    <article className={styles.lineItem} key={item.id}>
                      <img
                        alt={item.product.name}
                        className={styles.lineThumb}
                        src={item.product.image}
                      />
                      <div>
                        <p className={styles.lineTitle}>{item.product.name}</p>
                        <p className={styles.lineCopy}>
                          {item.product.category} · Qty {item.quantity} · Size{' '}
                          {item.size}
                        </p>
                      </div>
                      <StatusBadge tone="dark">
                        {formatCurrency(item.product.price * item.quantity)}
                      </StatusBadge>
                    </article>
                  ))}
                </div>

                <p className={styles.orderNote}>{order.trackingNote}</p>
              </div>
            </SectionCard>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
