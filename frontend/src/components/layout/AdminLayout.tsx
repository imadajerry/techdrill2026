import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './AdminLayout.module.css'

export default function AdminLayout() {
  const { signOut, user } = useAuth()

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <Link className={styles.brand} to="/admin/dashboard">
            TechDrill Ops
          </Link>
          <nav className={styles.nav}>
            <NavLink
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.linkActive : ''}`.trim()
              }
              to="/admin/dashboard"
            >
              Dashboard
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.linkActive : ''}`.trim()
              }
              to="/admin/orders"
            >
              Orders
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.linkActive : ''}`.trim()
              }
              to="/admin/products"
            >
              Products
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.linkActive : ''}`.trim()
              }
              to="/admin/users"
            >
              Users
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.linkActive : ''}`.trim()
              }
              to="/admin/reports"
            >
              Reports
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.linkActive : ''}`.trim()
              }
              to="/admin/pricing"
            >
              Pricing
            </NavLink>
          </nav>
          <div className={styles.footer}>
            <button className={styles.signOut} onClick={signOut} type="button">
              Sign out {user?.name ? `(${user.name.split(' ')[0]})` : ''}
            </button>
          </div>
        </aside>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
