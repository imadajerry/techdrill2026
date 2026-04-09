import styles from './StatCard.module.css'

type StatCardProps = {
  helper?: string
  label: string
  tone?: 'accent' | 'dark' | 'light'
  value: string
}

export default function StatCard({
  helper,
  label,
  tone = 'light',
  value,
}: StatCardProps) {
  const toneClassName =
    tone === 'accent'
      ? styles.accent
      : tone === 'dark'
        ? styles.dark
        : styles.light

  return (
    <article className={`${styles.card} ${toneClassName}`.trim()}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      {helper ? <p className={styles.helper}>{helper}</p> : null}
    </article>
  )
}
