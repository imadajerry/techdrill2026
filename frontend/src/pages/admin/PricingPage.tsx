import { useState } from 'react'
import PageIntro from '../../components/ui/PageIntro'
import SectionCard from '../../components/ui/SectionCard'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAppState } from '../../context/AppStateContext'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import styles from './AdminPages.module.css'

function getCampaignTone(status: 'scheduled' | 'live' | 'ended') {
  if (status === 'live') {
    return 'success'
  }

  if (status === 'scheduled') {
    return 'accent'
  }

  return 'neutral'
}

function getCampaignAction(status: 'scheduled' | 'live' | 'ended') {
  if (status === 'scheduled') {
    return 'Launch now'
  }

  if (status === 'live') {
    return 'End campaign'
  }

  return 'Schedule again'
}

export default function AdminPricingPage() {
  const {
    priceHistory,
    pricingCampaigns,
    togglePricingCampaign,
    updateCampaignPrices,
  } = useAppState()
  const [campaignDrafts, setCampaignDrafts] = useState<
    Record<string, { basePrice: string; salePrice: string }>
  >({})
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const scheduledCount = pricingCampaigns.filter(
    (campaign) => campaign.status === 'scheduled',
  ).length
  const liveCount = pricingCampaigns.filter((campaign) => campaign.status === 'live').length

  return (
    <div className={styles.page}>
      <PageIntro
        aside={
          <div className={styles.asideBlock}>
            <p className={styles.asideLabel}>Live campaigns</p>
            <p className={styles.asideValue}>{liveCount}</p>
            <p className={styles.asideCopy}>
              Scheduled pricing and audit history sit together so the admin team
              can reason about both current margin and future promotions.
            </p>
          </div>
        }
        description="This pricing surface exposes scheduled discounts and a compact price history trail, which is the frontend counterpart to the planned `PriceHistory` model."
        eyebrow="Admin pricing"
        title="Control markdowns and price movement."
      />

      <div className={styles.statsGrid}>
        <StatCard
          helper="Upcoming promotions waiting to go live."
          label="Scheduled"
          value={`${scheduledCount}`}
        />
        <StatCard
          helper="Campaigns affecting storefront pricing right now."
          label="Live"
          tone="accent"
          value={`${liveCount}`}
        />
        <StatCard
          helper="Audit-friendly record of every price change."
          label="History entries"
          tone="dark"
          value={`${priceHistory.length}`}
        />
      </div>

      {feedbackMessage ? (
        <StatusBadge tone="accent">{feedbackMessage}</StatusBadge>
      ) : null}

      <div className={styles.splitGrid}>
        <SectionCard
          description="Later this is where create/edit campaign actions and scheduling controls will connect."
          title="Campaigns"
        >
          <div className={styles.pricingGrid}>
            {pricingCampaigns.map((campaign) => {
              const draft = campaignDrafts[campaign.id] ?? {
                basePrice: `${campaign.basePrice}`,
                salePrice: `${campaign.salePrice}`,
              }

              return (
                <article className={styles.pricingCard} key={campaign.id}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.cardTitle}>{campaign.name}</h3>
                      <p className={styles.cardCopy}>{campaign.productName}</p>
                    </div>
                    <StatusBadge tone={getCampaignTone(campaign.status)}>
                      {campaign.status}
                    </StatusBadge>
                  </div>
                  <div className={styles.metricGrid}>
                    <label className={styles.editorField}>
                      <span className={styles.metricLabel}>Base price</span>
                      <input
                        className={styles.numberInput}
                        min="1"
                        onChange={(event) =>
                          setCampaignDrafts((currentDrafts) => ({
                            ...currentDrafts,
                            [campaign.id]: {
                              ...draft,
                              basePrice: event.target.value,
                            },
                          }))
                        }
                        step="1"
                        type="number"
                        value={draft.basePrice}
                      />
                    </label>
                    <label className={styles.editorField}>
                      <span className={styles.metricLabel}>Sale price</span>
                      <input
                        className={styles.numberInput}
                        min="1"
                        onChange={(event) =>
                          setCampaignDrafts((currentDrafts) => ({
                            ...currentDrafts,
                            [campaign.id]: {
                              ...draft,
                              salePrice: event.target.value,
                            },
                          }))
                        }
                        step="1"
                        type="number"
                        value={draft.salePrice}
                      />
                    </label>
                  </div>
                  <p className={styles.cardCopy}>
                    {formatDate(campaign.startsAt)} to {formatDate(campaign.endsAt)}
                  </p>
                  <p className={styles.inlineHint}>
                    Storefront base: {formatCurrency(Number(draft.basePrice || 0))} •
                    campaign sale: {formatCurrency(Number(draft.salePrice || 0))}
                  </p>
                  <div className={styles.inlineActions}>
                    <button
                      className={styles.secondaryButton}
                      onClick={() => {
                        const saved = updateCampaignPrices(campaign.id, {
                          basePrice: Number(draft.basePrice),
                          salePrice: Number(draft.salePrice),
                        })

                        if (!saved) {
                          setFeedbackMessage(
                            'Use positive values and keep sale price at or below base price.',
                          )
                          return
                        }

                        setCampaignDrafts((currentDrafts) => ({
                          ...currentDrafts,
                          [campaign.id]: {
                            basePrice: `${Number(draft.basePrice)}`,
                            salePrice: `${Number(draft.salePrice)}`,
                          },
                        }))
                        setFeedbackMessage(`${campaign.name} pricing saved.`)
                      }}
                      type="button"
                    >
                      Save prices
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() => {
                        togglePricingCampaign(campaign.id)
                        setFeedbackMessage(
                          `${campaign.name} status updated to the next pricing stage.`,
                        )
                      }}
                      type="button"
                    >
                      {getCampaignAction(campaign.status)}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </SectionCard>

        <SectionCard
          description="Useful for audits, reporting, and future rollback controls."
          title="Price history"
        >
          <div className={styles.historyList}>
            {priceHistory.map((entry) => (
              <article className={styles.historyRow} key={entry.id}>
                <div>
                  <p className={styles.historyTitle}>{entry.productName}</p>
                  <p className={styles.historyCopy}>
                    {entry.note} · {formatDate(entry.effectiveAt)}
                  </p>
                </div>
                <StatusBadge tone="dark">{formatCurrency(entry.amount)}</StatusBadge>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
