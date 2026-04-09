import type { ReactNode } from 'react'
import styles from './SectionCard.module.css'

type SectionCardProps = {
  action?: ReactNode
  children: ReactNode
  description?: string
  title?: string
}

export default function SectionCard({
  action,
  children,
  description,
  title,
}: SectionCardProps) {
  return (
    <section className={styles.card}>
      {title || description || action ? (
        <header className={styles.header}>
          <div>
            {title ? <h2 className={styles.title}>{title}</h2> : null}
            {description ? (
              <p className={styles.description}>{description}</p>
            ) : null}
          </div>
          {action ? <div>{action}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  )
}
