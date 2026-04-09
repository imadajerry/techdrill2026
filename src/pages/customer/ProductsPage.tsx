import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageIntro from '../../components/ui/PageIntro'
import ProductCard from '../../components/ui/ProductCard'
import SectionCard from '../../components/ui/SectionCard'
import StatCard from '../../components/ui/StatCard'
import { catalogProducts, productCategories } from '../../mocks/products'
import { formatCurrency } from '../../utils/formatCurrency'
import styles from './CustomerPages.module.css'

const categoryOptions = ['All', ...productCategories]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredProducts =
    selectedCategory === 'All'
      ? catalogProducts
      : catalogProducts.filter((product) => product.category === selectedCategory)

  const saleCount = catalogProducts.filter(
    (product) =>
      product.originalPrice !== undefined && product.originalPrice > product.price,
  ).length

  const spotlightProduct = catalogProducts[0]

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
        }
        description="A full browse layer is now in place with category filters, catalog cards, and sale-aware pricing that already follows the shared product contract."
        eyebrow="Customer catalog"
        title="Most popular products, shaped for motion."
      />

      <div className={styles.statsGrid}>
        <StatCard
          helper="Expanded from the initial featured-drop shell."
          label="Active SKUs"
          value={`${catalogProducts.length}`}
        />
        <StatCard
          helper="Original and sale prices are already represented in the mock data."
          label="Live markdowns"
          tone="accent"
          value={`${saleCount}`}
        />
        <StatCard
          helper="Useful later for segmentation and homepage recommendations."
          label="Shop categories"
          tone="dark"
          value={`${productCategories.length}`}
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
        <div className={styles.productGrid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
