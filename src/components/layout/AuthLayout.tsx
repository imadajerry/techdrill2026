import type { PropsWithChildren } from 'react'
import { Outlet } from 'react-router-dom'
import styles from './AuthLayout.module.css'

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.shell}>
      <section className={styles.hero}>
        <div>
          <p className={styles.brand}>TechDrill Commerce</p>
          <h1 className={styles.headline}>Built for sharp product drops.</h1>
          <p className={styles.copy}>
            One login, two surfaces. Customers shop a premium storefront while
            admins run inventory, orders, and reporting from the same codebase.
          </p>
        </div>
        <p className={styles.note}>
          Mock accounts: customer, admin, and superadmin all use `password123`.
        </p>
      </section>
      <section className={styles.panel}>
        <div className={styles.content}>{children ?? <Outlet />}</div>
      </section>
    </div>
  )
}
