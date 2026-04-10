import { Outlet } from 'react-router-dom'
import StorefrontFooter from '../components/layout/StorefrontFooter'
import StorefrontHeader from '../components/layout/StorefrontHeader'
import ChatbotWidget from '../components/ui/ChatbotWidget'
import styles from '../components/layout/CustomerLayout.module.css'

export default function Root() {
  return (
    <div className={styles.page}>
      <StorefrontHeader />
      <main className={styles.content}>
        <Outlet />
      </main>
      <StorefrontFooter />
      <ChatbotWidget />
    </div>
  )
}
