import styles from './FeaturePlaceholder.module.css'

type FeaturePlaceholderProps = {
  eyebrow?: string
  title: string
  description: string
}

export default function FeaturePlaceholder({
  eyebrow = 'In progress',
  title,
  description,
}: FeaturePlaceholderProps) {
  return (
    <section className={styles.card}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </section>
  )
}
