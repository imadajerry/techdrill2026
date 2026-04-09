import type { ReactNode } from 'react'
import styles from './PageIntro.module.css'

type PageIntroProps = {
  actions?: ReactNode
  aside?: ReactNode
  description: string
  eyebrow?: string
  title: string
}

export default function PageIntro({
  actions,
  aside,
  description,
  eyebrow,
  title,
}: PageIntroProps) {
  return (
    <section className={styles.wrapper}>
      <div className={styles.copyBlock}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
      {aside ? <div className={styles.aside}>{aside}</div> : null}
    </section>
  )
}
