import PageIntro from '../../components/ui/PageIntro'
import SectionCard from '../../components/ui/SectionCard'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAppState } from '../../context/AppStateContext'
import { formatCurrency } from '../../utils/formatCurrency'
import styles from './AdminPages.module.css'

function getStockTone(stock: number, reorderLevel: number) {
  if (stock <= reorderLevel - 2) {
    return 'danger'
  }

  if (stock <= reorderLevel) {
    return 'warning'
  }

  return 'success'
}

export default function AdminProductsPage() {
  const {
    adjustInventoryReserved,
    adjustInventoryStock,
    inventoryItems,
    pricingCampaigns,
  } = useAppState()
  const lowStockCount = inventoryItems.filter(
    (item) => item.stock <= item.reorderLevel,
  ).length
  const liveCampaignCount = pricingCampaigns.filter(
    (campaign) => campaign.status === 'live',
  ).length

  return (
    <div className={styles.page}>
      <PageIntro
        aside={
          <div className={styles.asideBlock}>
            <p className={styles.asideLabel}>Live discounts</p>
            <p className={styles.asideValue}>{liveCampaignCount}</p>
            <p className={styles.asideCopy}>
              Pricing campaigns are surfaced next to inventory so operations can
              see stock risk and margin changes together.
            </p>
          </div>
        }
        description="Inventory, stock thresholds, reserved counts, and SKU metadata are now represented as a real admin surface instead of a placeholder shell."
        eyebrow="Admin inventory"
        title="Manage stock and product readiness."
      />

      <div className={styles.statsGrid}>
        <StatCard
          helper="These records already match the shared product shape used by the storefront."
          label="Tracked SKUs"
          value={`${inventoryItems.length}`}
        />
        <StatCard
          helper="These need reorder or allocation review."
          label="Low stock alerts"
          tone="accent"
          value={`${lowStockCount}`}
        />
        <StatCard
          helper="Reserved stock is separated from on-hand inventory."
          label="Reserved units"
          tone="dark"
          value={`${inventoryItems.reduce((sum, item) => sum + item.reservedStock, 0)}`}
        />
      </div>

      <SectionCard
        description="The next step is connecting create, edit, and stock-adjustment mutations to the backend."
        title="Inventory watch"
      >
        <div className={styles.inventoryGrid}>
          {inventoryItems.map((item) => {
            const stockRatio = Math.min(100, (item.stock / (item.reorderLevel * 2)) * 100)

            return (
              <article className={styles.inventoryCard} key={item.id}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.cardTitle}>{item.name}</h3>
                    <p className={styles.cardCopy}>
                      {item.sku} · {item.category}
                    </p>
                  </div>
                  <StatusBadge tone={getStockTone(item.stock, item.reorderLevel)}>
                    {item.stock} in stock
                  </StatusBadge>
                </div>

                <div className={styles.metricGrid}>
                  <div className={styles.metricBlock}>
                    <span className={styles.metricLabel}>Current price</span>
                    <span className={styles.metricValue}>
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                  <div className={styles.metricBlock}>
                    <span className={styles.metricLabel}>Reserved</span>
                    <span className={styles.metricValue}>{item.reservedStock}</span>
                  </div>
                  <div className={styles.metricBlock}>
                    <span className={styles.metricLabel}>Reorder level</span>
                    <span className={styles.metricValue}>{item.reorderLevel}</span>
                  </div>
                  <div className={styles.metricBlock}>
                    <span className={styles.metricLabel}>Badge</span>
                    <span className={styles.metricValue}>
                      {item.badge ?? 'Standard'}
                    </span>
                  </div>
                </div>

                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${Math.max(stockRatio, 8)}%` }}
                  />
                </div>

                <div className={styles.inlineActions}>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => adjustInventoryStock(item.id, -1)}
                    type="button"
                  >
                    Stock -1
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => adjustInventoryStock(item.id, 5)}
                    type="button"
                  >
                    Restock +5
                  </button>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => adjustInventoryReserved(item.id, -1)}
                    type="button"
                  >
                    Release 1
                  </button>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => adjustInventoryReserved(item.id, 1)}
                    type="button"
                  >
                    Reserve 1
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </SectionCard>
    </div>
  )
}
