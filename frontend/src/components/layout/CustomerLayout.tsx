import { Outlet } from 'react-router-dom'
import StorefrontFooter from './StorefrontFooter'
import StorefrontHeader from './StorefrontHeader'
import ChatbotWidget from '../ui/ChatbotWidget'
import styles from './CustomerLayout.module.css'

export default function CustomerLayout() {
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
