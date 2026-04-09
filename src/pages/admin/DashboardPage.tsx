import { adminDashboardMock } from '../../mocks/adminDashboard'
import { formatCurrency } from '../../utils/formatCurrency'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  return (
    <section>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Admin dashboard</p>
          <h1 className={styles.title}>Operations at a glance.</h1>
          <p className={styles.copy}>
            This is the first admin surface wired behind role-gated routing. It
            gives the team a stable shell for orders, products, reports, and
            user moderation.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        <article className={styles.metricCard}>
          <p className={styles.metricLabel}>Today's collection</p>
          <p className={styles.metricValue}>
            {formatCurrency(adminDashboardMock.todaysCollection)}
          </p>
        </article>
        <article className={styles.metricCard}>
          <p className={styles.metricLabel}>Top customer</p>
          <p className={styles.metricValue}>{adminDashboardMock.topCustomer}</p>
        </article>
        <article className={styles.metricCard}>
          <p className={styles.metricLabel}>Low-stock alerts</p>
          <p className={styles.metricValue}>
            {adminDashboardMock.lowStockAlerts.length}
          </p>
        </article>
      </div>

      <div className={styles.columns}>
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Order status counts</h2>
          <ul className={styles.list}>
            {adminDashboardMock.orderCounts.map((item) => (
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
            {adminDashboardMock.trendingProducts.map((product) => (
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
            {adminDashboardMock.lowStockAlerts.map((alert) => (
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
