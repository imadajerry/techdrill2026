import type { OrderStatus } from '../../types/order'
import styles from './OrderTimeline.module.css'

type OrderTimelineProps = {
  status: OrderStatus
}

const mainFlow: OrderStatus[] = [
  'placed',
  'accepted',
  'processed',
  'dispatched',
  'delivered',
]
const rejectedFlow: OrderStatus[] = ['placed', 'rejected']

const labels: Record<OrderStatus, string> = {
  accepted: 'Accepted',
  delivered: 'Delivered',
  dispatched: 'Dispatched',
  placed: 'Placed',
  processed: 'Processed',
  rejected: 'Rejected',
}

export default function OrderTimeline({ status }: OrderTimelineProps) {
  const steps: OrderStatus[] = status === 'rejected' ? rejectedFlow : mainFlow
  const activeIndex = steps.indexOf(status)

  return (
    <div className={styles.timeline}>
      {steps.map((step, index) => {
        const isComplete = index < activeIndex
        const isCurrent = step === status

        return (
          <div className={styles.step} key={step}>
            <div
              className={`${styles.marker} ${
                isCurrent && step === 'delivered'
                  ? styles.complete
                  : isCurrent
                    ? styles.current
                    : isComplete
                      ? styles.complete
                      : styles.pending
              }`.trim()}
            />
            <span className={styles.label}>{labels[step]}</span>
          </div>
        )
      })}
    </div>
  )
}
