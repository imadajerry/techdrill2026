import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageIntro from '../../components/ui/PageIntro'
import ProductCard from '../../components/ui/ProductCard'
import SectionCard from '../../components/ui/SectionCard'
import StatCard from '../../components/ui/StatCard'
import { useAppState } from '../../context/AppStateContext'
import { formatCurrency } from '../../utils/formatCurrency'
import styles from './CustomerPages.module.css'

export default function ProductsPage() {
  const { favouriteProducts, products } = useAppState()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const productCategories = Array.from(
    new Set(products.map((product) => product.category)),
  )
  const categoryOptions = ['All', ...productCategories]

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory)

  const saleCount = products.filter(
    (product) =>
      product.originalPrice !== undefined && product.originalPrice > product.price,
  ).length

  const spotlightProduct = products[0]

  return (
    <div className={styles.page}>
      <PageIntro
        actions={
          <>
            <Link className={styles.primaryAction} to="/cart">
              Review cart
            </Link>
            <Link className={styles.secondaryAction} to="/favourites">
              See favourites
            </Link>
          </>
        }
        aside={
          spotlightProduct ? (
            <div className={styles.heroSpotlight}>
              <img
                alt={spotlightProduct.name}
                className={styles.heroImage}
                src={spotlightProduct.image}
              />
              <div>
                <p className={styles.heroLabel}>Spotlight drop</p>
                <h2 className={styles.heroTitle}>{spotlightProduct.name}</h2>
                <p className={styles.heroCopy}>{spotlightProduct.description}</p>
                <p className={styles.heroPrice}>
                  {formatCurrency(spotlightProduct.price)}
                </p>
              </div>
            </div>
          ) : (
            <div className={styles.heroSpotlight}>
              <div>
                <p className={styles.heroLabel}>Catalog pending</p>
                <h2 className={styles.heroTitle}>No products loaded yet.</h2>
                <p className={styles.heroCopy}>
                  Product cards will appear here once the frontend receives live
                  catalog data from the backend.
                </p>
              </div>
            </div>
          )
        }
        description="A full browse layer is in place with category filters and sale-aware pricing, ready for backend-sourced catalog results."
        eyebrow="Customer catalog"
        title="Most popular products, shaped for motion."
      />

      <div className={styles.statsGrid}>
        <StatCard
          helper="Expanded from the initial featured-drop shell."
          label="Active SKUs"
          value={`${products.length}`}
        />
        <StatCard
          helper="Original and sale prices render directly from the live product payload."
          label="Live markdowns"
          tone="accent"
          value={`${saleCount}`}
        />
        <StatCard
          helper="Live favourite saves are now shared across the storefront."
          label="Saved picks"
          tone="dark"
          value={`${favouriteProducts.length}`}
        />
      </div>

      <SectionCard
        description="The visual direction follows the reference boards: light premium surfaces, bold type, and product-first cards rather than generic tables."
        title="Browse the collection"
      >
        <div className={styles.filterRow}>
          {categoryOptions.map((category) => (
            <button
              className={`${styles.filterButton} ${
                selectedCategory === category ? styles.filterActive : ''
              }`.trim()}
              key={category}
              onClick={() => setSelectedCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
        {filteredProducts.length === 0 ? (
          <p className={styles.emptyState}>
            No products are available yet. Connect the catalog endpoint to load
            live inventory into this view.
          </p>
        ) : (
          <div className={styles.productGrid}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}
