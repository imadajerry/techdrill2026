import styles from './LoadingState.module.css'

type LoadingStateProps = {
  label?: string
}

export default function LoadingState({
  label = 'Loading your workspace...',
}: LoadingStateProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>{label}</p>
    </div>
  )
}
