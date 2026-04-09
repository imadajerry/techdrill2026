import { useState } from 'react'
import PageIntro from '../../components/ui/PageIntro'
import SectionCard from '../../components/ui/SectionCard'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAppState } from '../../context/AppStateContext'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils/formatDate'
import styles from './AdminPages.module.css'

export default function AdminReportsPage() {
  const { downloadExport, generateReport, recentExports, reportTemplates } =
    useAppState()
  const { user } = useAuth()
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const readyExports = recentExports.filter((item) => item.status === 'ready').length

  return (
    <div className={styles.page}>
      <PageIntro
        aside={
          <div className={styles.asideBlock}>
            <p className={styles.asideLabel}>Exports ready</p>
            <p className={styles.asideValue}>{readyExports}</p>
            <p className={styles.asideCopy}>
              Templates and generated files are visible in one place so PDF and
              Excel delivery can plug in without changing the UI.
            </p>
          </div>
        }
        description="Reports now have an actual admin surface with generation targets, output formats, and recent export history."
        eyebrow="Admin reports"
        title="Generate operational and payment reporting."
      />

      <div className={styles.statsGrid}>
        <StatCard
          helper="Each template maps to the agreed reporting scope in the project overview."
          label="Templates"
          value={`${reportTemplates.length}`}
        />
        <StatCard
          helper="Both Excel and PDF remain first-class outputs."
          label="Formats"
          tone="accent"
          value="xlsx + pdf"
        />
        <StatCard
          helper="Recent export state is already modeled for polling or notifications."
          label="Queue state"
          tone="dark"
          value="Ready / Processing"
        />
      </div>

      {feedbackMessage ? (
        <StatusBadge tone="accent">{feedbackMessage}</StatusBadge>
      ) : null}

      <div className={styles.splitGrid}>
        <SectionCard
          description="These cards are the natural place to trigger backend report generation later."
          title="Report templates"
        >
          <div className={styles.reportGrid}>
            {reportTemplates.map((template) => (
              <article className={styles.reportCard} key={template.id}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.cardTitle}>{template.title}</h3>
                    <p className={styles.cardCopy}>{template.description}</p>
                  </div>
                  <StatusBadge tone="dark">{template.format}</StatusBadge>
                </div>
                <StatusBadge tone="accent">{template.periodLabel}</StatusBadge>
                <button
                  className={styles.actionButton}
                  onClick={() => {
                    const exportRecord = generateReport(
                      template.id,
                      user?.name ?? 'Operations',
                    )

                    if (exportRecord) {
                      setFeedbackMessage(
                        `${exportRecord.title} queued for generation.`,
                      )
                    }
                  }}
                  type="button"
                >
                  Generate export
                </button>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          description="Shows who requested a file, when it was generated, and whether it is ready to download."
          title="Recent exports"
        >
          <div className={styles.historyList}>
            {recentExports.map((report) => (
              <article className={styles.historyRow} key={report.id}>
                <div>
                  <p className={styles.historyTitle}>{report.title}</p>
                  <p className={styles.historyCopy}>
                    {report.requestedBy} · {formatDate(report.generatedAt)}
                  </p>
                </div>
                <div className={styles.rowActions}>
                  <StatusBadge tone="dark">{report.format}</StatusBadge>
                  <StatusBadge tone={report.status === 'ready' ? 'success' : 'warning'}>
                    {report.status}
                  </StatusBadge>
                  {report.status === 'ready' ? (
                    <button
                      className={styles.secondaryButton}
                      onClick={() => {
                        const exportRecord = downloadExport(report.id)

                        if (exportRecord) {
                          setFeedbackMessage(
                            `Prepared ${exportRecord.title} for download.`,
                          )
                        }
                      }}
                      type="button"
                    >
                      Download
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
