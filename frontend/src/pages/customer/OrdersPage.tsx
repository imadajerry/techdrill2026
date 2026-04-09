import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import OrderTimeline from '../../components/ui/OrderTimeline'
import SectionCard from '../../components/ui/SectionCard'
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
  const location = useLocation()
  const { customerOrders } = useAppState()
  const [selectedStatus, setSelectedStatus] = useState<'all' | OrderStatus>('all')
  const placedOrderId = (location.state as { placedOrderId?: string } | null)?.placedOrderId

  const filteredOrders =
    selectedStatus === 'all'
      ? customerOrders
      : customerOrders.filter((order) => order.status === selectedStatus)

  return (
    <div className={styles.page}>
      {placedOrderId ? (
        <StatusBadge tone="success">
          Order {placedOrderId} placed successfully and added to the live queue.
        </StatusBadge>
      ) : null}

      <SectionCard
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
