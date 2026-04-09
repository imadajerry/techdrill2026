import { useAppState } from '../../context/AppStateContext'
import { formatCurrency } from '../../utils/formatCurrency'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  const { dashboardSummary } = useAppState()

  return (
    <section>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Admin dashboard</p>
          <h1 className={styles.title}>Operations at a glance.</h1>
        </div>
      </div>

      <div className={styles.grid}>
        <article className={styles.metricCard}>
          <p className={styles.metricLabel}>Today's collection</p>
          <p className={styles.metricValue}>
            {formatCurrency(dashboardSummary.todaysCollection)}
          </p>
        </article>
        <article className={styles.metricCard}>
          <p className={styles.metricLabel}>Top customer</p>
          <p className={styles.metricValue}>{dashboardSummary.topCustomer}</p>
        </article>
        <article className={styles.metricCard}>
          <p className={styles.metricLabel}>Low-stock alerts</p>
          <p className={styles.metricValue}>
            {dashboardSummary.lowStockAlerts.length}
          </p>
        </article>
      </div>

      <div className={styles.columns}>
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Order status counts</h2>
          <ul className={styles.list}>
            {dashboardSummary.orderCounts.map((item) => (
              <li className={styles.listItem} key={item.label}>
                <span>{item.label}</span>
                <span className={styles.badge}>{item.value}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Trending products</h2>
          <ul className={styles.list}>
            {dashboardSummary.trendingProducts.map((product) => (
              <li className={styles.listItem} key={product}>
                <span>{product}</span>
                <span className={styles.badge}>Trending</span>
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Low-stock watchlist</h2>
          <ul className={styles.list}>
            {dashboardSummary.lowStockAlerts.map((alert) => (
              <li className={styles.listItem} key={alert.name}>
                <span>{alert.name}</span>
                <span className={styles.badge}>{alert.stock} left</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  )
}
