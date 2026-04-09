import { useState } from 'react'
import ProductCard from '../../components/ui/ProductCard'
import SectionCard from '../../components/ui/SectionCard'
import { useAppState } from '../../context/AppStateContext'
import styles from './CustomerPages.module.css'

export default function ProductsPage() {
  const { products } = useAppState()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const productCategories = Array.from(
    new Set(products.map((product) => product.category)),
  )
  const categoryOptions = ['All', ...productCategories]

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory)

  return (
    <div className={styles.page}>
      <SectionCard
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
