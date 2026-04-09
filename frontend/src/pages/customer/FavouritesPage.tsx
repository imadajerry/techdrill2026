import { Link } from 'react-router-dom'
import PageIntro from '../../components/ui/PageIntro'
import ProductCard from '../../components/ui/ProductCard'
import SectionCard from '../../components/ui/SectionCard'
import StatCard from '../../components/ui/StatCard'
import { useAppState } from '../../context/AppStateContext'
import styles from './CustomerPages.module.css'

export default function FavouritesPage() {
  const { cartCount, favouriteProducts } = useAppState()

  return (
    <div className={styles.page}>
      <PageIntro
        actions={
          <>
            <Link className={styles.primaryAction} to="/products">
              Back to catalog
            </Link>
            <Link className={styles.secondaryAction} to="/cart">
              Move to cart
            </Link>
          </>
        }
        description="Add items to favourites to store them for your next visit"
        eyebrow="Customer favourites"
        title="Keep the strongest picks within reach."
      />

      <div className={styles.statsGrid}>
        <StatCard
          label="Saved items"
          value={`${favouriteProducts.length}`}
        />
        <StatCard
          label="Cart handoff"
          tone="accent"
          value={`${cartCount} in bag`}
        />
      </div>

      <SectionCard
        description="This stays intentionally lightweight so the primary browse-cart-order loop remains the main delivery path."
        title="Saved for later"
      >
        {favouriteProducts.length === 0 ? (
          <p className={styles.emptyState}>
            Nothing is saved yet. Use the save control on any product card to keep
            strong options here.
          </p>
        ) : (
          <div className={styles.productGrid}>
            {favouriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}
