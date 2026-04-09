import type { ReactNode } from 'react'
import styles from './StatusBadge.module.css'

type StatusBadgeProps = {
  children: ReactNode
  size?: 'md' | 'sm'
  tone?: 'accent' | 'danger' | 'dark' | 'neutral' | 'success' | 'warning'
}

export default function StatusBadge({
  children,
  size = 'md',
  tone = 'neutral',
}: StatusBadgeProps) {
  const toneClassName = {
    accent: styles.accent,
    danger: styles.danger,
    dark: styles.dark,
    neutral: styles.neutral,
    success: styles.success,
    warning: styles.warning,
  }[tone]

  return (
    <span
      className={`${styles.badge} ${styles[size]} ${toneClassName}`.trim()}
    >
      {children}
    </span>
  )
}
