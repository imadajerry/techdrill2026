import { useState } from 'react'
import type { InventoryItem } from '../../types/admin'
import styles from './AdminPages.module.css'
import StatusBadge from '../../components/ui/StatusBadge'

interface ProductFormProps {
  initialData?: InventoryItem
  onSubmit: (data: Omit<InventoryItem, 'id'>) => Promise<boolean>
  onCancel: () => void
}

export default function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>({
    name: initialData?.name ?? '',
    category: initialData?.category ?? '',
    price: initialData?.price ?? 0,
    originalPrice: initialData?.originalPrice ?? undefined,
    image: initialData?.image ?? '',
    description: initialData?.description ?? '',
    stock: initialData?.stock ?? 0,
    reservedStock: initialData?.reservedStock ?? 0,
    reorderLevel: initialData?.reorderLevel ?? 5,
    badge: initialData?.badge ?? '',
    targetGroup: initialData?.targetGroup ?? undefined,
    sku: initialData?.sku ?? ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const success = await onSubmit(formData)
    
    if (!success) {
      setError('An error occurred while saving the product.')
      setIsSubmitting(false)
    }
  }

  return (
    <form className={styles.inventoryCard} onSubmit={handleSubmit} style={{ gridColumn: '1 / -1', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{initialData ? 'Edit Product' : 'Add New Product'}</h3>
      </div>

      {error && <StatusBadge tone="danger">{error}</StatusBadge>}

      <div className={styles.metricGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <label className={styles.editorField}>
          <span className={styles.metricLabel}>Name *</span>
          <input required className={styles.numberInput} name="name" type="text" value={formData.name} onChange={handleChange} />
        </label>
        
        <label className={styles.editorField}>
          <span className={styles.metricLabel}>SKU *</span>
          <input required className={styles.numberInput} name="sku" type="text" value={formData.sku} onChange={handleChange} />
        </label>

        <label className={styles.editorField}>
          <span className={styles.metricLabel}>Category *</span>
          <input required className={styles.numberInput} name="category" type="text" value={formData.category} onChange={handleChange} />
        </label>

        <label className={styles.editorField}>
          <span className={styles.metricLabel}>Base Price *</span>
          <input required className={styles.numberInput} name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange} />
        </label>
        
        <label className={styles.editorField}>
          <span className={styles.metricLabel}>Original Price</span>
          <input className={styles.numberInput} name="originalPrice" type="number" step="0.01" min="0" value={formData.originalPrice ?? ''} onChange={handleChange} />
        </label>
        
        <label className={styles.editorField}>
          <span className={styles.metricLabel}>Image URL *</span>
          <input required className={styles.numberInput} name="image" type="url" value={formData.image} onChange={handleChange} />
        </label>
        
        <label className={styles.editorField}>
          <span className={styles.metricLabel}>Stock *</span>
          <input required className={styles.numberInput} name="stock" type="number" min="0" value={formData.stock} onChange={handleChange} />
        </label>

        <label className={styles.editorField}>
          <span className={styles.metricLabel}>Reorder Level *</span>
          <input required className={styles.numberInput} name="reorderLevel" type="number" min="0" value={formData.reorderLevel} onChange={handleChange} />
        </label>

        <label className={styles.editorField}>
          <span className={styles.metricLabel}>Reserved Stock</span>
          <input className={styles.numberInput} name="reservedStock" type="number" min="0" value={formData.reservedStock} onChange={handleChange} />
        </label>
        
        <label className={styles.editorField}>
          <span className={styles.metricLabel}>Badge (Optional)</span>
          <input className={styles.numberInput} name="badge" type="text" value={formData.badge ?? ''} onChange={handleChange} />
        </label>

        <label className={styles.editorField}>
          <span className={styles.metricLabel}>Target Group</span>
          <select className={styles.numberInput} name="targetGroup" value={formData.targetGroup ?? ''} onChange={handleChange}>
            <option value="">None</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
            <option value="Kids">Kids</option>
          </select>
        </label>
      </div>

      <label className={styles.editorField}>
        <span className={styles.metricLabel}>Description *</span>
        <textarea 
          required 
          className={styles.numberInput} 
          name="description" 
          rows={3} 
          value={formData.description} 
          onChange={handleChange}
          style={{ minHeight: '80px', padding: '12px' }}
        />
      </label>

      <div className={styles.inlineActions} style={{ marginTop: '16px', justifyContent: 'flex-end' }}>
        <button type="button" className={styles.secondaryButton} onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className={styles.actionButton} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  )
}
