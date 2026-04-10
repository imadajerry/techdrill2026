/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import { useAuth } from './AuthContext'

// API imports
import * as productsApi from '../api/products'
import * as cartApi from '../api/cart'
import * as ordersApi from '../api/orders'
import * as adminApi from '../api/admin'
import * as favouritesApi from '../api/favourites'
import * as recommendationsApi from '../api/recommendations'

// Mock fallbacks
import { adminDashboardMock } from '../mocks/adminDashboard'
import {
  adminOrders as initialAdminOrders,
  inventoryItems as initialInventoryItems,
  managedUsers as initialManagedUsers,
  priceHistory as initialPriceHistory,
  pricingCampaigns as initialPricingCampaigns,
  recentExports as initialRecentExports,
  reportTemplates,
} from '../mocks/adminOperations'
import { initialCartItems } from '../mocks/cart'
import { customerOrders as initialCustomerOrders } from '../mocks/orders'
import {
  catalogProducts,
  favouriteProducts as initialFavouriteProducts,
  recommendedProducts as initialRecommendedProducts,
} from '../mocks/products'

// Types
import type {
  AdminOrderRecord,
  ExportRecord,
  InventoryItem,
  ManagedUser,
  PriceHistoryEntry,
  PricingCampaign,
  ReportTemplate,
} from '../types/admin'
import type { CartItem } from '../types/cart'
import type { DashboardSummary } from '../types/dashboard'
import type { CheckoutInput, CustomerOrder, OrderStatus } from '../types/order'
import type { Product } from '../types/product'

/**
 * Set to true to use the real backend API.
 * Set to false to use mock data (for offline demos or when the backend is not running).
 */
const USE_API = true

const sizeOptions = ['UK 7', 'UK 8', 'UK 9', 'UK 10']

type AddToCartResult =
  | 'added'
  | 'quantity-updated'
  | 'max-stock'
  | 'out-of-stock'

type CampaignPriceInput = {
  basePrice: number
  salePrice: number
}

type AppStateContextValue = {
  addToCart: (productId: string, size: string) => AddToCartResult
  adjustInventoryReserved: (itemId: string, delta: number) => void
  adjustInventoryStock: (itemId: string, delta: number) => void
  advanceAdminOrder: (orderId: string) => OrderStatus | null
  adminOrders: AdminOrderRecord[]
  availableSizes: string[]
  cartCount: number
  cartItems: CartItem[]
  customerOrders: CustomerOrder[]
  dashboardSummary: DashboardSummary
  downloadExport: (exportId: string) => ExportRecord | null
  favouriteIds: string[]
  favouriteProducts: Product[]
  featuredProducts: Product[]
  generateReport: (templateId: string, requestedBy: string) => ExportRecord | null
  getCartQuantity: (productId: string) => number
  inventoryItems: InventoryItem[]
  isFavourite: (productId: string) => boolean
  isLoading: boolean
  managedUsers: ManagedUser[]
  placeOrder: (
    input: CheckoutInput,
    customer: { email: string; name: string },
  ) => CustomerOrder | null
  priceHistory: PriceHistoryEntry[]
  pricingCampaigns: PricingCampaign[]
  products: Product[]
  recentExports: ExportRecord[]
  recommendedProducts: Product[]
  refreshProducts: () => void
  refreshCart: () => void
  refreshOrders: () => void
  reportTemplates: ReportTemplate[]
  toggleFavourite: (productId: string) => boolean
  togglePricingCampaign: (campaignId: string) => PricingCampaign['status'] | null
  toggleUserStatus: (userId: string) => ManagedUser['status'] | null
  updateCampaignPrices: (campaignId: string, input: CampaignPriceInput) => boolean
  updateCartItemQuantity: (itemId: string, delta: number) => void
  updateInventoryBasePrice: (itemId: string, nextPrice: number) => boolean
  removeCartItem: (itemId: string) => void
  adminAddProduct: (product: Omit<InventoryItem, 'id'>) => Promise<boolean>
  adminUpdateProduct: (id: string, product: Partial<InventoryItem>) => Promise<boolean>
  adminDeleteProduct: (id: string) => Promise<boolean>
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined)

// ── Helpers ────────────────────────────────────────────────────────────────────

function cloneProduct(product: Product): Product {
  return { ...product }
}

function cloneCartItem(item: CartItem): CartItem {
  return { ...item, product: cloneProduct(item.product) }
}

function cloneCustomerOrder(order: CustomerOrder): CustomerOrder {
  return {
    ...order,
    items: order.items.map((item) => ({
      ...item,
      product: cloneProduct(item.product),
    })),
  }
}

function cloneInventoryItem(item: InventoryItem): InventoryItem {
  return { ...item }
}

function cloneAdminOrder(order: AdminOrderRecord): AdminOrderRecord {
  return { ...order }
}

function cloneManagedUser(user: ManagedUser): ManagedUser {
  return { ...user }
}

function cloneReport(record: ExportRecord): ExportRecord {
  return { ...record }
}

function cloneCampaign(campaign: PricingCampaign): PricingCampaign {
  return { ...campaign }
}

function clonePriceHistoryEntry(entry: PriceHistoryEntry): PriceHistoryEntry {
  return { ...entry }
}

function getProductById(products: Product[], productId: string) {
  return products.find((product) => product.id === productId) ?? null
}

function getProductByName(products: Product[], productName: string) {
  return products.find((product) => product.name === productName) ?? null
}

function getNextOrderStatus(status: OrderStatus): OrderStatus | null {
  if (status === 'placed') return 'accepted'
  if (status === 'accepted') return 'processed'
  if (status === 'processed') return 'dispatched'
  if (status === 'dispatched') return 'delivered'
  return null
}

function getNextUserStatus(status: ManagedUser['status']): ManagedUser['status'] {
  if (status === 'pending' || status === 'blocked') return 'active'
  return 'blocked'
}

function cloneProducts(products: Product[]) {
  return products.map(cloneProduct)
}

function buildStorefrontProduct(
  currentProduct: Product,
  basePrice: number,
  salePrice: number,
  status: PricingCampaign['status'],
): Product {
  if (status === 'live') {
    return { ...currentProduct, originalPrice: basePrice, price: salePrice }
  }
  return { ...currentProduct, originalPrice: undefined, price: basePrice }
}

function buildOrderId() {
  return `TD-${String(Date.now()).slice(-6)}`
}

function createEtaDate() {
  const etaDate = new Date()
  etaDate.setDate(etaDate.getDate() + 4)
  return etaDate.toISOString()
}

function summarizeCart(cartItems: CartItem[]) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )
  const shipping = cartItems.length === 0 || subtotal >= 10000 ? 0 : 299
  return { shipping, subtotal, total: subtotal + shipping }
}

function createDashboardSummary(
  adminOrders: AdminOrderRecord[],
  inventoryItems: InventoryItem[],
): DashboardSummary {
  const orderCounts = [
    'placed', 'accepted', 'rejected', 'processed', 'dispatched', 'delivered',
  ].map((status) => ({
    label: status[0].toUpperCase() + status.slice(1),
    value: adminOrders.filter((order) => order.status === status).length,
  }))

  const todaysCollection = adminOrders
    .filter((order) => order.paymentStatus === 'paid')
    .reduce((sum, order) => sum + order.total, 0)

  const topCustomer =
    adminOrders
      .filter((order) => order.paymentStatus === 'paid')
      .sort((left, right) => right.total - left.total)[0]?.customerName ??
    adminDashboardMock.topCustomer

  const lowStockAlerts = inventoryItems
    .filter((item) => item.stock <= item.reorderLevel)
    .map((item) => ({ name: item.name, stock: item.stock }))

  return {
    todaysCollection,
    topCustomer,
    orderCounts,
    trendingProducts: adminDashboardMock.trendingProducts,
    lowStockAlerts:
      lowStockAlerts.length > 0
        ? lowStockAlerts
        : adminDashboardMock.lowStockAlerts,
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AppStateProvider({ children }: PropsWithChildren) {
  const { isAuthenticated, user, role } = useAuth()

  // Loading state
  const [isLoading, setIsLoading] = useState(USE_API)

  // Core data
  const [products, setProducts] = useState<Product[]>(() =>
    cloneProducts(catalogProducts),
  )
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    USE_API ? [] : initialCartItems.map(cloneCartItem),
  )
  const [favouriteIds, setFavouriteIds] = useState<string[]>(() =>
    USE_API ? [] : initialFavouriteProducts.map((product) => product.id),
  )
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>(() =>
    USE_API ? [] : initialCustomerOrders.map(cloneCustomerOrder),
  )
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>(() =>
    USE_API ? [] : initialRecommendedProducts.map(cloneProduct),
  )

  // Admin data
  const [adminOrders, setAdminOrders] = useState<AdminOrderRecord[]>(() =>
    USE_API ? [] : initialAdminOrders.map(cloneAdminOrder),
  )
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() =>
    USE_API ? [] : initialInventoryItems.map(cloneInventoryItem),
  )
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>(() =>
    USE_API ? [] : initialManagedUsers.map(cloneManagedUser),
  )
  const [dashboardFromApi, setDashboardFromApi] = useState<DashboardSummary | null>(null)

  // Pricing stays client-only (no backend endpoints for pricing campaigns in this iteration)
  const [pricingCampaigns, setPricingCampaigns] = useState<PricingCampaign[]>(() =>
    initialPricingCampaigns.map(cloneCampaign),
  )
  const [priceHistory, setPriceHistory] = useState<PriceHistoryEntry[]>(() =>
    initialPriceHistory.map(clonePriceHistoryEntry),
  )
  const [recentExports, setRecentExports] = useState<ExportRecord[]>(() =>
    initialRecentExports.map(cloneReport),
  )

  const reportTimers = useRef<number[]>([])

  useEffect(() => {
    const timers = reportTimers
    return () => {
      timers.current.forEach((timerId) => window.clearTimeout(timerId))
    }
  }, [])

  // ── API Data Fetching ─────────────────────────────────────────────────────

  async function fetchProducts() {
    if (!USE_API) return
    try {
      const response = await productsApi.getProducts()
      if (response.success) {
        setProducts(response.data)
      }
    } catch {
      // Fall back to mock data on error
      console.warn('Failed to fetch products from API, using mocks')
      setProducts(cloneProducts(catalogProducts))
    }
  }

  async function fetchCart() {
    if (!USE_API || !isAuthenticated) return
    try {
      const response = await cartApi.getCart()
      if (response.success) {
        setCartItems(response.data)
      }
    } catch {
      console.warn('Failed to fetch cart from API')
    }
  }

  async function fetchOrders() {
    if (!USE_API || !isAuthenticated) return
    try {
      const response = await ordersApi.getMyOrders()
      if (response.success) {
        setCustomerOrders(response.data)
      }
    } catch {
      console.warn('Failed to fetch orders from API')
    }
  }

  async function fetchFavouriteIds() {
    if (!USE_API || !isAuthenticated) return
    try {
      const response = await favouritesApi.getFavouriteIds()
      if (response.success) {
        setFavouriteIds(response.data)
      }
    } catch {
      console.warn('Failed to fetch favourites from API')
    }
  }

  async function fetchRecommendations() {
    if (!USE_API || !user) return
    try {
      const response = await recommendationsApi.getRecommendations(user.id)
      if (response.success && response.data.length > 0) {
        setRecommendedProducts(response.data)
      }
    } catch {
      console.warn('Failed to fetch recommendations from API')
    }
  }

  async function fetchAdminData() {
    if (!USE_API || !isAuthenticated || (role !== 'admin' && role !== 'superadmin')) return

    try {
      const [dashboardRes, ordersRes, usersRes, inventoryRes] = await Promise.allSettled([
        adminApi.getDashboard(),
        adminApi.getAllOrders(),
        adminApi.getUsers(),
        adminApi.getInventory(),
      ])

      if (dashboardRes.status === 'fulfilled' && dashboardRes.value.success) {
        setDashboardFromApi(dashboardRes.value.data)
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value.success) {
        setAdminOrders(ordersRes.value.data)
      }
      if (usersRes.status === 'fulfilled' && usersRes.value.success) {
        setManagedUsers(usersRes.value.data)
      }
      if (inventoryRes.status === 'fulfilled' && inventoryRes.value.success) {
        setInventoryItems(inventoryRes.value.data)
      }
    } catch {
      console.warn('Failed to fetch admin data from API, using mocks')
      setAdminOrders(initialAdminOrders.map(cloneAdminOrder))
      setInventoryItems(initialInventoryItems.map(cloneInventoryItem))
      setManagedUsers(initialManagedUsers.map(cloneManagedUser))
    }
  }

  // Fetch all data on mount / auth change
  useEffect(() => {
    if (!USE_API) {
      setIsLoading(false)
      return
    }

    async function loadData() {
      setIsLoading(true)

      // Products are public — always fetch
      await fetchProducts()

      if (isAuthenticated) {
        await Promise.allSettled([
          fetchCart(),
          fetchOrders(),
          fetchFavouriteIds(),
          fetchRecommendations(),
        ])

        if (role === 'admin' || role === 'superadmin') {
          await fetchAdminData()
        }
      }

      setIsLoading(false)
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, role])

  // ── Sync helpers ──────────────────────────────────────────────────────────

  function syncProductReferences(updatedProduct: Product) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    )
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === updatedProduct.id
          ? { ...item, product: updatedProduct }
          : item,
      ),
    )
    setCustomerOrders((currentOrders) =>
      currentOrders.map((order) => ({
        ...order,
        items: order.items.map((item) =>
          item.product.id === updatedProduct.id
            ? { ...item, product: updatedProduct }
            : item,
        ),
      })),
    )
  }

  function appendPriceHistory(productName: string, amount: number, note: string) {
    setPriceHistory((currentHistory) => [
      {
        amount,
        effectiveAt: new Date().toISOString(),
        id: `price-${Date.now()}`,
        note,
        productName,
      },
      ...currentHistory,
    ])
  }

  function syncInventoryBasePrice(productName: string, basePrice: number) {
    setInventoryItems((currentItems) =>
      currentItems.map((item) =>
        item.name === productName ? { ...item, price: basePrice } : item,
      ),
    )
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  function addToCart(productId: string, size: string): AddToCartResult {
    const selectedProduct = getProductById(products, productId)

    if (!selectedProduct || selectedProduct.stock <= 0) {
      return 'out-of-stock'
    }

    let outcome: AddToCartResult = 'added'

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === productId && item.size === size,
      )

      if (!existingItem) {
        return [
          ...currentItems,
          {
            id: `cart-${productId}-${size}-${Date.now()}`,
            product: selectedProduct,
            quantity: 1,
            size,
          },
        ]
      }

      if (existingItem.quantity >= selectedProduct.stock) {
        outcome = 'max-stock'
        return currentItems
      }

      outcome = 'quantity-updated'

      return currentItems.map((item) =>
        item.id === existingItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    })

    // API call with rollback on failure
    if (USE_API && isAuthenticated) {
      cartApi.addToCart(productId, size, 1, selectedProduct.price).then(() => {
        fetchRecommendations()
      }).catch(() => {
        console.warn('Failed to sync cart addition to API, rolling back')
        // Rollback: remove the item we just added or decrement quantity
        setCartItems((currentItems) => {
          const item = currentItems.find(
            (i) => i.product.id === productId && i.size === size,
          )
          if (!item) return currentItems
          if (item.quantity <= 1) {
            return currentItems.filter((i) => i.id !== item.id)
          }
          return currentItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i,
          )
        })
      })
    }

    return outcome
  }

  function toggleFavourite(productId: string) {
    // Compute the decision BEFORE React batches the state update
    const isCurrentlyFavourite = favouriteIds.includes(productId)
    const willBeFavourite = !isCurrentlyFavourite

    // Optimistic UI update
    setFavouriteIds((currentIds) => {
      if (isCurrentlyFavourite) {
        return currentIds.filter((id) => id !== productId)
      }
      return [...currentIds, productId]
    })

    // API call with rollback on failure
    if (USE_API && isAuthenticated) {
      const apiCall = willBeFavourite
        ? favouritesApi.addFavourite(productId)
        : favouritesApi.removeFavourite(productId)

      apiCall.catch(() => {
        console.warn('Failed to sync favourite to API, rolling back')
        // Rollback: revert the optimistic update
        setFavouriteIds((currentIds) => {
          if (willBeFavourite) {
            // We added it optimistically, remove it
            return currentIds.filter((id) => id !== productId)
          }
          // We removed it optimistically, add it back
          return [...currentIds, productId]
        })
      })
    }

    return willBeFavourite
  }

  function updateCartItemQuantity(itemId: string, delta: number) {
    const currentItem = cartItems.find((item) => item.id === itemId)
    if (!currentItem) return

    const newQuantity = Math.max(1, Math.min(currentItem.product.stock, currentItem.quantity + delta))

    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== itemId) return item
        return { ...item, quantity: newQuantity }
      }),
    )

    if (USE_API && isAuthenticated && newQuantity > 0) {
      cartApi.updateCartItem(itemId, newQuantity).catch(() => {
        console.warn('Failed to sync cart update to API')
      })
    }
  }

  function removeCartItem(itemId: string) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId),
    )

    if (USE_API && isAuthenticated) {
      cartApi.removeCartItem(itemId).then(() => {
        fetchRecommendations()
      }).catch(() => {
        console.warn('Failed to sync cart removal to API')
      })
    }
  }

  function advanceAdminOrder(orderId: string) {
    const currentOrder = adminOrders.find((order) => order.id === orderId)
    if (!currentOrder) return null

    const nextStatus = getNextOrderStatus(currentOrder.status)
    if (!nextStatus) return null

    setAdminOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.id !== orderId) return order
        return {
          ...order,
          paymentStatus:
            nextStatus === 'delivered' && order.paymentStatus === 'pending'
              ? 'paid'
              : order.paymentStatus,
          status: nextStatus,
        }
      }),
    )

    setCustomerOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: nextStatus!,
              trackingNote:
                nextStatus === 'accepted'
                  ? 'The operations team accepted the order and moved it into the live queue.'
                  : nextStatus === 'processed'
                    ? 'Warehouse QC is complete and the shipment is moving toward dispatch.'
                    : nextStatus === 'dispatched'
                      ? 'The parcel left the hub and is now in the courier network.'
                      : 'The order reached the customer and delivery has been confirmed.',
            }
          : order,
      ),
    )

    // Fire-and-forget API call
    if (USE_API && isAuthenticated && nextStatus) {
      adminApi.updateOrderStatus(orderId, nextStatus).catch(() => {
        console.warn('Failed to sync order status to API')
      })
    }

    return nextStatus
  }

  function toggleUserStatus(userId: string) {
    const currentUser = managedUsers.find((u) => u.id === userId)
    if (!currentUser) return null

    const nextStatus = getNextUserStatus(currentUser.status)

    setManagedUsers((currentUsers) =>
      currentUsers.map((u) => {
        if (u.id !== userId) return u
        return { ...u, status: nextStatus }
      }),
    )

    // Fire-and-forget API call
    if (USE_API && isAuthenticated && nextStatus) {
      adminApi.updateUserStatus(userId, nextStatus).catch(() => {
        console.warn('Failed to sync user status to API')
      })
    }

    return nextStatus
  }

  function adjustInventoryStock(itemId: string, delta: number) {
    const currentItem = inventoryItems.find((item) => item.id === itemId)
    if (!currentItem) return

    const newStock = Math.max(0, currentItem.stock + delta)
    const updatedProduct = { ...currentItem, stock: newStock }

    setInventoryItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== itemId) return item
        return {
          ...item,
          reservedStock: Math.min(item.reservedStock, newStock),
          stock: newStock,
        }
      }),
    )

    syncProductReferences(updatedProduct)

    if (USE_API && isAuthenticated) {
      adminApi.updateInventory(itemId, { stock: newStock }).catch(() => {
        console.warn('Failed to sync inventory stock to API')
      })
    }
  }

  function adjustInventoryReserved(itemId: string, delta: number) {
    setInventoryItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== itemId) return item
        return {
          ...item,
          reservedStock: Math.max(
            0,
            Math.min(item.stock, item.reservedStock + delta),
          ),
        }
      }),
    )
  }

  function updateInventoryBasePrice(itemId: string, nextPrice: number) {
    if (!Number.isFinite(nextPrice) || nextPrice <= 0) return false

    const currentItem = inventoryItems.find((item) => item.id === itemId)
    if (!currentItem) return false

    const activeCampaign = pricingCampaigns.find(
      (campaign) =>
        campaign.productName === currentItem.name && campaign.status === 'live',
    )
    const currentProduct = getProductById(products, currentItem.id)

    setInventoryItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, price: nextPrice } : item,
      ),
    )

    setPricingCampaigns((currentCampaigns) =>
      currentCampaigns.map((campaign) =>
        campaign.productName === currentItem.name
          ? { ...campaign, basePrice: nextPrice }
          : campaign,
      ),
    )

    if (currentProduct) {
      const updatedProduct = buildStorefrontProduct(
        currentProduct,
        nextPrice,
        activeCampaign?.salePrice ?? nextPrice,
        activeCampaign?.status ?? 'ended',
      )
      syncProductReferences(updatedProduct)
    }

    appendPriceHistory(currentItem.name, nextPrice, 'Base price updated from inventory.')

    if (USE_API && isAuthenticated) {
      adminApi.updateInventory(itemId, { price: nextPrice }).catch(() => {
        console.warn('Failed to sync price update to API')
      })
    }

    return true
  }

  function placeOrder(
    input: CheckoutInput,
    customer: { email: string; name: string },
  ) {
    if (!input.shippingAddress.trim() || cartItems.length === 0) return null

    const orderId = buildOrderId()
    const placedAt = new Date().toISOString()
    const { total } = summarizeCart(cartItems)
    const normalizedAddress = input.shippingAddress.trim()

    const createdOrder: CustomerOrder = {
      eta: createEtaDate(),
      id: orderId,
      items: cartItems.map((item) => ({
        ...item,
        product: cloneProduct(item.product),
      })),
      paymentMethod: input.paymentMethod,
      placedAt,
      shippingAddress: normalizedAddress,
      status: 'placed',
      total,
      trackingNote:
        'Order confirmed and waiting for ops acceptance. Tracking will update from the admin queue.',
    }

    setCustomerOrders((currentOrders) => [createdOrder, ...currentOrders])
    setAdminOrders((currentOrders) => [
      {
        customerEmail: customer.email,
        customerName: customer.name,
        id: orderId,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        paymentStatus: 'paid',
        placedAt,
        status: 'placed',
        total,
      },
      ...currentOrders,
    ])

    setInventoryItems((currentItems) =>
      currentItems.map((item) => {
        const matchedCartItem = cartItems.find(
          (cartItem) => cartItem.product.id === item.id,
        )
        if (!matchedCartItem) return item
        return {
          ...item,
          reservedStock: item.reservedStock + matchedCartItem.quantity,
          stock: Math.max(0, item.stock - matchedCartItem.quantity),
        }
      }),
    )

    setProducts((currentProducts) =>
      currentProducts.map((product) => {
        const matchedCartItem = cartItems.find(
          (cartItem) => cartItem.product.id === product.id,
        )
        if (!matchedCartItem) return product
        return {
          ...product,
          stock: Math.max(0, product.stock - matchedCartItem.quantity),
        }
      }),
    )

    // Fire-and-forget API call
    if (USE_API && isAuthenticated) {
      const apiInput: ordersApi.PlaceOrderInput = {
        items: cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          size: item.size,
          price: item.product.price,
        })),
        total_amount: total,
        payment_method: input.paymentMethod,
        shipping_address: normalizedAddress,
        ...(input.razorpayDetails && {
          razorpay_order_id: input.razorpayDetails.razorpay_order_id,
          razorpay_payment_id: input.razorpayDetails.razorpay_payment_id,
          razorpay_signature: input.razorpayDetails.razorpay_signature,
        }),
      }

      ordersApi.placeOrder(apiInput).catch(() => {
        console.warn('Failed to place order via API')
      })
    }

    setCartItems([])

    return createdOrder
  }

  function togglePricingCampaign(campaignId: string) {
    const currentCampaign = pricingCampaigns.find(
      (campaign) => campaign.id === campaignId,
    )

    if (!currentCampaign) return null

    const resolvedStatus: PricingCampaign['status'] =
      currentCampaign.status === 'scheduled'
        ? 'live'
        : currentCampaign.status === 'live'
          ? 'ended'
          : 'scheduled'
    const resolvedCampaign = { ...currentCampaign, status: resolvedStatus }
    let updatedProduct: Product | null = null

    setPricingCampaigns((currentCampaigns) =>
      currentCampaigns.map((campaign) =>
        campaign.id === campaignId ? resolvedCampaign : campaign,
      ),
    )

    const baselineProduct = getProductByName(catalogProducts, resolvedCampaign.productName)
    const currentProduct = getProductByName(products, resolvedCampaign.productName)

    if (baselineProduct && currentProduct) {
      updatedProduct = buildStorefrontProduct(
        currentProduct,
        resolvedCampaign.basePrice,
        resolvedCampaign.salePrice,
        resolvedStatus,
      )
    }

    if (updatedProduct) {
      syncProductReferences(updatedProduct)
      syncInventoryBasePrice(updatedProduct.name, resolvedCampaign.basePrice)
    }

    appendPriceHistory(
      resolvedCampaign.productName,
      resolvedStatus === 'live'
        ? resolvedCampaign.salePrice
        : resolvedCampaign.basePrice,
      resolvedStatus === 'live'
        ? `${resolvedCampaign.name} launched.`
        : resolvedStatus === 'ended'
          ? `${resolvedCampaign.name} ended.`
          : `${resolvedCampaign.name} rescheduled.`,
    )

    return resolvedStatus
  }

  function updateCampaignPrices(campaignId: string, input: CampaignPriceInput) {
    if (
      !Number.isFinite(input.basePrice) ||
      !Number.isFinite(input.salePrice) ||
      input.basePrice <= 0 ||
      input.salePrice <= 0 ||
      input.salePrice > input.basePrice
    ) {
      return false
    }

    const currentCampaign = pricingCampaigns.find(
      (campaign) => campaign.id === campaignId,
    )

    if (!currentCampaign) return false

    const updatedCampaign: PricingCampaign = {
      ...currentCampaign,
      basePrice: input.basePrice,
      salePrice: input.salePrice,
    }

    setPricingCampaigns((currentCampaigns) =>
      currentCampaigns.map((campaign) =>
        campaign.id === campaignId ? updatedCampaign : campaign,
      ),
    )

    syncInventoryBasePrice(updatedCampaign.productName, updatedCampaign.basePrice)

    const currentProduct = getProductByName(products, updatedCampaign.productName)

    if (currentProduct) {
      syncProductReferences(
        buildStorefrontProduct(
          currentProduct,
          updatedCampaign.basePrice,
          updatedCampaign.salePrice,
          updatedCampaign.status,
        ),
      )
    }

    appendPriceHistory(
      updatedCampaign.productName,
      updatedCampaign.status === 'live'
        ? updatedCampaign.salePrice
        : updatedCampaign.basePrice,
      `${updatedCampaign.name} pricing updated.`,
    )

    return true
  }

  function generateReport(templateId: string, requestedBy: string) {
    const template = reportTemplates.find((item) => item.id === templateId)
    if (!template) return null

    const exportRecord: ExportRecord = {
      format: template.format,
      generatedAt: new Date().toISOString(),
      id: `export-${Date.now()}`,
      requestedBy,
      status: 'processing',
      title: template.title,
    }

    setRecentExports((currentExports) => [exportRecord, ...currentExports])

    if (USE_API && isAuthenticated) {
      Promise.resolve().then(async () => {
        try {
          let rawData: unknown = null
          if (templateId === 'report-1') {
            const res = await adminApi.getOrderReport()
            if (res.success) rawData = res.data
          } else if (templateId === 'report-2') {
            const res = await adminApi.getPaymentReport()
            if (res.success) rawData = res.data
          } else {
            const res = await adminApi.getDashboard()
            if (res.success) rawData = res.data
          }

          let jsonToConvert: any[] = []
          if (rawData && typeof rawData === 'object') {
            if ('summary' in rawData && Array.isArray((rawData as any).summary)) {
              jsonToConvert = (rawData as any).summary
            } else if ('orderCounts' in rawData && Array.isArray((rawData as any).orderCounts)) {
              jsonToConvert = (rawData as any).orderCounts
            } else if (Array.isArray(rawData)) {
              jsonToConvert = rawData
            } else {
              jsonToConvert = [rawData]
            }
          }

          let csvStr = ''
          if (jsonToConvert.length > 0) {
            const keys = Object.keys(jsonToConvert[0])
            csvStr = keys.join(',') + '\n' + jsonToConvert.map(row => keys.map(k => `"${row[k]}"`).join(',')).join('\n')
          } else {
            csvStr = 'No data'
          }

          const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' })
          const downloadUrl = URL.createObjectURL(blob)

          setRecentExports((currentExports) =>
            currentExports.map((item) =>
              item.id === exportRecord.id
                ? { ...item, generatedAt: new Date().toISOString(), status: 'ready', downloadUrl }
                : item,
            ),
          )
        } catch (err) {
          console.warn('Failed to generate report via API', err)
          setRecentExports((currentExports) =>
            currentExports.map((item) =>
              item.id === exportRecord.id
                ? { ...item, generatedAt: new Date().toISOString(), status: 'ready' }
                : item,
            ),
          )
        }
      })
    } else {
      const timerId = window.setTimeout(() => {
        setRecentExports((currentExports) =>
          currentExports.map((item) =>
            item.id === exportRecord.id
              ? { ...item, generatedAt: new Date().toISOString(), status: 'ready' }
              : item,
          ),
        )
      }, 1400)

      reportTimers.current.push(timerId)
    }

    return exportRecord
  }

  function downloadExport(exportId: string) {
    return recentExports.find((item) => item.id === exportId) ?? null
  }

  async function adminAddProduct(product: Omit<InventoryItem, 'id'>): Promise<boolean> {
    try {
      if (!USE_API || !isAuthenticated) return false

      const apiInput = {
        name: product.name,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        description: product.description,
        stock: product.stock,
        badge: product.badge,
        targetGroup: product.targetGroup,
        sku: product.sku,
        reorder_level: product.reorderLevel
      }
      
      const response = await productsApi.createProduct(apiInput)
      if (response.success && response.data?.id) {
        const newProduct: Product = {
          ...product,
          id: response.data.id
        }
        
        const newInventoryItem: InventoryItem = {
          ...newProduct,
          sku: product.sku,
          reorderLevel: product.reorderLevel,
          reservedStock: product.reservedStock
        }
        
        setProducts(curr => [newProduct, ...curr])
        setInventoryItems(curr => [newInventoryItem, ...curr])
        return true
      }
      return false
    } catch {
      return false
    }
  }

  async function adminUpdateProduct(id: string, product: Partial<InventoryItem>): Promise<boolean> {
    try {
      if (!USE_API || !isAuthenticated) return false

      const apiInput = {
        ...product,
        reorder_level: product.reorderLevel
      }
      
      const response = await productsApi.updateProduct(id, apiInput)
      if (response.success) {
        setProducts(curr => curr.map(p => p.id === id ? { ...p, ...product } : p))
        setInventoryItems(curr => curr.map(item => item.id === id ? { ...item, ...product } : item))
        return true
      }
      return false
    } catch {
      return false
    }
  }

  async function adminDeleteProduct(id: string): Promise<boolean> {
    try {
      if (!USE_API || !isAuthenticated) return false

      const response = await productsApi.deleteProduct(id)
      if (response.success) {
        setProducts(curr => curr.filter(p => p.id !== id))
        setInventoryItems(curr => curr.filter(item => item.id !== id))
        return true
      }
      return false
    } catch {
      return false
    }
  }

  // ── Derived state ─────────────────────────────────────────────────────────

  const favouriteProducts = products.filter((product) =>
    favouriteIds.includes(product.id),
  )
  const featuredProducts = products.slice(0, 3)
  const derivedRecommendedProducts =
    recommendedProducts.length > 0
      ? recommendedProducts
      : products.filter((product) =>
          initialRecommendedProducts.some((item) => item.id === product.id),
        )
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const dashboardSummary =
    dashboardFromApi ?? createDashboardSummary(adminOrders, inventoryItems)

  return (
    <AppStateContext.Provider
      value={{
        addToCart,
        adjustInventoryReserved,
        adjustInventoryStock,
        advanceAdminOrder,
        adminOrders,
        availableSizes: sizeOptions,
        cartCount,
        cartItems,
        customerOrders,
        dashboardSummary,
        downloadExport,
        favouriteIds,
        favouriteProducts,
        featuredProducts,
        generateReport,
        getCartQuantity: (productId: string) =>
          cartItems
            .filter((item) => item.product.id === productId)
            .reduce((sum, item) => sum + item.quantity, 0),
        inventoryItems,
        isFavourite: (productId: string) => favouriteIds.includes(productId),
        isLoading,
        managedUsers,
        placeOrder,
        priceHistory,
        pricingCampaigns,
        products,
        recentExports,
        recommendedProducts: derivedRecommendedProducts,
        refreshProducts: fetchProducts,
        refreshCart: fetchCart,
        refreshOrders: fetchOrders,
        reportTemplates,
        toggleFavourite,
        togglePricingCampaign,
        toggleUserStatus,
        updateCampaignPrices,
        updateCartItemQuantity,
        updateInventoryBasePrice,
        removeCartItem,
        adminAddProduct,
        adminUpdateProduct,
        adminDeleteProduct,
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)

  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider.')
  }

  return context
}
