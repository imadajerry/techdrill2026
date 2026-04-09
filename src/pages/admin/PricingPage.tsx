import PageIntro from '../../components/ui/PageIntro'
import SectionCard from '../../components/ui/SectionCard'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import { priceHistory, pricingCampaigns } from '../../mocks/adminOperations'
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

export default function AdminPricingPage() {
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

      <div className={styles.splitGrid}>
        <SectionCard
          description="Later this is where create/edit campaign actions and scheduling controls will connect."
          title="Campaigns"
        >
          <div className={styles.pricingGrid}>
            {pricingCampaigns.map((campaign) => (
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
                  <div className={styles.metricBlock}>
                    <span className={styles.metricLabel}>Base price</span>
                    <span className={styles.metricValue}>
                      {formatCurrency(campaign.basePrice)}
                    </span>
                  </div>
                  <div className={styles.metricBlock}>
                    <span className={styles.metricLabel}>Sale price</span>
                    <span className={styles.metricValue}>
                      {formatCurrency(campaign.salePrice)}
                    </span>
                  </div>
                </div>
                <p className={styles.cardCopy}>
                  {formatDate(campaign.startsAt)} to {formatDate(campaign.endsAt)}
                </p>
              </article>
            ))}
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
