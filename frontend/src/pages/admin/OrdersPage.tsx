import { useState } from 'react'
import PageIntro from '../../components/ui/PageIntro'
import SectionCard from '../../components/ui/SectionCard'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAppState } from '../../context/AppStateContext'
import type { OrderStatus } from '../../types/order'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import styles from './AdminPages.module.css'

const statusFilters: Array<'all' | OrderStatus> = [
  'all',
  'placed',
  'accepted',
  'processed',
  'dispatched',
  'delivered',
  'rejected',
]

function getStatusTone(status: OrderStatus) {
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

function getNextAction(status: OrderStatus) {
  if (status === 'placed') {
    return 'Accept order'
  }

  if (status === 'accepted') {
    return 'Start processing'
  }

  if (status === 'processed') {
    return 'Dispatch now'
  }

  if (status === 'dispatched') {
    return 'Mark delivered'
  }

  return null
}

export default function AdminOrdersPage() {
  const { adminOrders, advanceAdminOrder, rejectAdminOrder } = useAppState()
  const [selectedStatus, setSelectedStatus] = useState<'all' | OrderStatus>('all')

  const filteredOrders =
    selectedStatus === 'all'
      ? adminOrders
      : adminOrders.filter((order) => order.status === selectedStatus)

  const placedCount = adminOrders.filter((order) => order.status === 'placed').length
  const problemCount = adminOrders.filter(
    (order) => order.status === 'rejected' || order.paymentStatus === 'pending',
  ).length
  const revenueInFlight = adminOrders
    .filter((order) => order.paymentStatus === 'paid')
    .reduce((sum, order) => sum + order.total, 0)

  return (
    <div className={styles.page}>
      <PageIntro
        aside={
          <div className={styles.asideBlock}>
            <p className={styles.asideLabel}>Orders in queue</p>
            <p className={styles.asideValue}>{filteredOrders.length}</p>
            <p className={styles.asideCopy}>
              The routed admin queue now matches the shared order status language
              used on the customer side.
            </p>
          </div>
        }
        description="This surface covers the operational order pipeline with status filters, customer visibility, payment state, and clear next-action affordances."
        eyebrow="Admin operations"
        title="Move each order through the fulfillment pipeline."
      />

      <div className={styles.statsGrid}>
        <StatCard
          helper="These need immediate review from the operations team."
          label="Newly placed"
          value={`${placedCount}`}
        />
        <StatCard
          helper="Rejected orders and pending payments stay grouped as operational risk."
          label="Needs attention"
          tone="accent"
          value={`${problemCount}`}
        />
        <StatCard
          helper="Paid orders in the active queue."
          label="Revenue in flight"
          tone="dark"
          value={formatCurrency(revenueInFlight)}
        />
      </div>

      <SectionCard
        description="Later this will be backed by PATCH calls for accept, reject, process, dispatch, and delivery updates."
        title="Live order queue"
      >
        <div className={styles.filterRow}>
          {statusFilters.map((status) => (
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
        <div className={styles.list}>
          {filteredOrders.map((order) => (
            <article className={styles.row} key={order.id}>
              <div>
                <h3 className={styles.rowTitle}>
                  {order.id} · {order.customerName}
                </h3>
                <div className={styles.rowMeta}>
                  <span>{order.customerEmail}</span>
                  <span>{formatDate(order.placedAt)}</span>
                  <span>{order.itemCount} items</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
              <div className={styles.rowActions}>
                <StatusBadge tone={getStatusTone(order.status)}>
                  {order.status}
                </StatusBadge>
                <StatusBadge tone={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                  {order.paymentStatus}
                </StatusBadge>
                {getNextAction(order.status) ? (
                  <>
                    <button
                      className={styles.actionButton}
                      onClick={() => advanceAdminOrder(order.id)}
                      type="button"
                    >
                      {getNextAction(order.status)}
                    </button>
                    {order.status !== 'rejected' && order.status !== 'delivered' && (
                      <button
                        className={styles.secondaryButton}
                        onClick={() => {
                          if (window.confirm('Are you sure you want to reject this order?')) {
                            rejectAdminOrder(order.id)
                          }
                        }}
                        type="button"
                        style={{ borderColor: '#c82020', color: '#c82020' }}
                      >
                        Reject
                      </button>
                    )}
                  </>
                ) : (
                  <StatusBadge tone="neutral">No pending action</StatusBadge>
                )}
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
