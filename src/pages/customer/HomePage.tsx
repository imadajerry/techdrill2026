import { Link } from 'react-router-dom'
import ProductCard from '../../components/ui/ProductCard'
import { featuredProducts } from '../../mocks/products'
import styles from './HomePage.module.css'

export default function HomePage() {
  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Fresh arrivals</p>
          <h1 className={styles.title}>Street-ready pairs with performance roots.</h1>
          <p className={styles.copy}>
            The customer storefront now has a real protected entry point,
            premium visual direction, and mock-backed product cards ready for
            product-list and detail routes.
          </p>
          <div className={styles.ctaRow}>
            <Link className={styles.primaryCta} to="/products">
              Shop collection
            </Link>
            <Link className={styles.secondaryCta} to="/orders">
              Track orders
            </Link>
          </div>
        </div>
        <img
          alt="Premium sneaker storefront hero"
          className={styles.heroImage}
          src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80"
        />
      </section>

      <section className={styles.stats}>
        <article className={styles.statCard}>
          <p className={styles.statLabel}>Recommended for you</p>
          <p className={styles.statValue}>3 live picks</p>
        </article>
        <article className={styles.statCard}>
          <p className={styles.statLabel}>Cart readiness</p>
          <p className={styles.statValue}>API scaffolded</p>
        </article>
        <article className={styles.statCard}>
          <p className={styles.statLabel}>Checkout next</p>
          <p className={styles.statValue}>Address + payment</p>
        </article>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Featured drop</h2>
            <p className={styles.sectionCopy}>
              Mock catalog data already follows the shared product shape so the
              swap to real Axios calls is one toggle in the API layer.
            </p>
          </div>
        </div>
        <div className={styles.grid}>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
