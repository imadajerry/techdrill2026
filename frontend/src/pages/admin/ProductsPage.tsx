import { useState } from 'react'
import PageIntro from '../../components/ui/PageIntro'
import ProductForm from './ProductForm'
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
    updateInventoryBasePrice,
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
  } = useAppState()
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({})
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
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

      {feedbackMessage ? (
        <StatusBadge tone="accent">{feedbackMessage}</StatusBadge>
      ) : null}

      <SectionCard
        description="Manage products, pricing, and stock levels."
        title="Inventory watch"
      >
        {!isAddingProduct && !editingProductId && (
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className={styles.actionButton} onClick={() => setIsAddingProduct(true)}>
              + Add New Product
            </button>
          </div>
        )}
        
        <div className={styles.inventoryGrid}>
          {isAddingProduct && (
            <ProductForm
              onSubmit={async (data) => {
                const success = await adminAddProduct(data)
                if (success) {
                  setIsAddingProduct(false)
                  setFeedbackMessage('Product created successfully.')
                }
                return success
              }}
              onCancel={() => setIsAddingProduct(false)}
            />
          )}

          {inventoryItems.map((item) => {
            if (editingProductId === item.id) {
              return (
                <ProductForm
                  key={item.id}
                  initialData={item}
                  onSubmit={async (data) => {
                    const success = await adminUpdateProduct(item.id, data)
                    if (success) {
                      setEditingProductId(null)
                      setFeedbackMessage('Product updated successfully.')
                    }
                    return success
                  }}
                  onCancel={() => setEditingProductId(null)}
                />
              )
            }
            const stockRatio = Math.min(100, (item.stock / (item.reorderLevel * 2)) * 100)
            const liveCampaign = pricingCampaigns.find(
              (campaign) =>
                campaign.productName === item.name && campaign.status === 'live',
            )
            const basePriceValue = priceDrafts[item.id] ?? `${item.price}`
            const currentPrice = liveCampaign?.salePrice ?? item.price

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
                      {formatCurrency(currentPrice)}
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

                <div className={styles.editorGrid}>
                  <label className={styles.editorField}>
                    <span className={styles.metricLabel}>Base price</span>
                    <input
                      className={styles.numberInput}
                      min="1"
                      onChange={(event) =>
                        setPriceDrafts((currentDrafts) => ({
                          ...currentDrafts,
                          [item.id]: event.target.value,
                        }))
                      }
                      step="1"
                      type="number"
                      value={basePriceValue}
                    />
                  </label>
                  <button
                    className={styles.actionButton}
                    onClick={() => {
                      const parsedPrice = Number(basePriceValue)

                      if (!updateInventoryBasePrice(item.id, parsedPrice)) {
                        setFeedbackMessage('Enter a valid positive base price.')
                        return
                      }

                      setPriceDrafts((currentDrafts) => ({
                        ...currentDrafts,
                        [item.id]: `${parsedPrice}`,
                      }))
                      setFeedbackMessage(`${item.name} base price updated.`)
                    }}
                    type="button"
                  >
                    Save price
                  </button>
                </div>

                {liveCampaign ? (
                  <p className={styles.inlineHint}>
                    Live sale running at {formatCurrency(liveCampaign.salePrice)}.
                    Updating the base price also updates the original strike-through
                    price shown in the storefront.
                  </p>
                ) : null}

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
                  <button
                    className={styles.secondaryButton}
                    onClick={() => setEditingProductId(item.id)}
                    type="button"
                    style={{ marginLeft: 'auto' }}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.secondaryButton}
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this product?')) {
                        const success = await adminDeleteProduct(item.id)
                        if (success) setFeedbackMessage('Product deleted.')
                        else setFeedbackMessage('Failed to delete product.')
                      }
                    }}
                    type="button"
                    style={{ borderColor: '#c82020', color: '#c82020' }}
                  >
                    Delete
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
