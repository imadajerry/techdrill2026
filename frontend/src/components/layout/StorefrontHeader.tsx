import { LogOut, ShoppingBag } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useAppState } from '../../context/AppStateContext'
import { useAuth } from '../../context/AuthContext'
import styles from './StorefrontHeader.module.css'

export default function StorefrontHeader() {
  const { signOut, user } = useAuth()
  const { cartCount, favouriteProducts } = useAppState()

  return (
    <header className={styles.header}>
      <Link className={styles.brand} to="/">
        TechDrill
      </Link>
      <nav className={styles.nav}>
        <NavLink
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.linkActive : ''}`.trim()
          }
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.linkActive : ''}`.trim()
          }
          to="/products"
        >
          Shop
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.linkActive : ''}`.trim()
          }
          to="/orders"
        >
          Orders
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.linkActive : ''}`.trim()
          }
          to="/favourites"
        >
          Favourites
          {favouriteProducts.length > 0 ? ` (${favouriteProducts.length})` : ''}
        </NavLink>
      </nav>
      <div className={styles.actions}>
        <Link className={styles.actionLink} to="/cart">
          <ShoppingBag size={18} />
          Cart {cartCount > 0 ? `(${cartCount})` : ''}
        </Link>
        <button className={styles.button} onClick={signOut} type="button">
          {user?.name?.split(' ')[0] ?? 'Account'} <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}
