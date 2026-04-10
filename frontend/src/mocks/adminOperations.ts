import type {
  AdminOrderRecord,
  ExportRecord,
  InventoryItem,
  ManagedUser,
  PriceHistoryEntry,
  PricingCampaign,
  ReportTemplate,
} from '../types/admin'
import { catalogProducts } from './products'

function findProduct(productId: string) {
  const product = catalogProducts.find((item) => item.id === productId)

  if (!product) {
    throw new Error(`Product "${productId}" is not defined in mocks.`)
  }

  return product
}

export const adminOrders: AdminOrderRecord[] = [
  {
    customerEmail: 'aarav@techdrill.dev',
    customerName: 'Aarav Menon',
    id: 'TD-24091',
    itemCount: 1,
    paymentStatus: 'paid',
    placedAt: '2026-04-08T09:00:00.000Z',
    status: 'dispatched',
    total: 6499,
  },
  {
    customerEmail: 'riya@techdrill.dev',
    customerName: 'Riya Sharma',
    id: 'TD-24090',
    itemCount: 2,
    paymentStatus: 'paid',
    placedAt: '2026-04-08T08:12:00.000Z',
    status: 'processed',
    total: 11298,
  },
  {
    customerEmail: 'kabir@techdrill.dev',
    customerName: 'Kabir Sethi',
    id: 'TD-24087',
    itemCount: 1,
    paymentStatus: 'pending',
    placedAt: '2026-04-07T16:20:00.000Z',
    status: 'placed',
    total: 3999,
  },
  {
    customerEmail: 'tara@techdrill.dev',
    customerName: 'Tara Dsouza',
    id: 'TD-24084',
    itemCount: 1,
    paymentStatus: 'refunded',
    placedAt: '2026-04-07T11:10:00.000Z',
    status: 'rejected',
    total: 7299,
  },
]

export const inventoryItems: InventoryItem[] = [
  {
    ...findProduct('shoe-1'),
    reorderLevel: 10,
    reservedStock: 3,
    sku: 'TD-RUN-001',
  },
  {
    ...findProduct('shoe-2'),
    reorderLevel: 8,
    reservedStock: 2,
    sku: 'TD-LIFE-014',
  },
  {
    ...findProduct('shoe-3'),
    reorderLevel: 7,
    reservedStock: 1,
    sku: 'TD-OUT-009',
  },
  {
    ...findProduct('shoe-5'),
    reorderLevel: 9,
    reservedStock: 4,
    sku: 'TD-TRN-022',
  },
]

export const managedUsers: ManagedUser[] = [
  {
    email: 'customer@techdrill.dev',
    id: 'usr-1',
    joinedAt: '2026-03-28T09:30:00.000Z',
    name: 'Aarav Menon',
    ordersCount: 8,
    role: 'customer',
    status: 'active',
  },
  {
    email: 'admin@techdrill.dev',
    id: 'usr-2',
    joinedAt: '2026-03-22T12:00:00.000Z',
    name: 'Nisha Rao',
    ordersCount: 0,
    role: 'admin',
    status: 'active',
  },
  {
    email: 'superadmin@techdrill.dev',
    id: 'usr-3',
    joinedAt: '2026-03-18T10:00:00.000Z',
    name: 'Ishaan Kapoor',
    ordersCount: 0,
    role: 'superadmin',
    status: 'active',
  },
  {
    email: 'newuser@techdrill.dev',
    id: 'usr-4',
    joinedAt: '2026-04-09T08:15:00.000Z',
    name: 'Sara Bhat',
    ordersCount: 0,
    role: 'customer',
    status: 'pending',
  },
  {
    email: 'blocked@techdrill.dev',
    id: 'usr-5',
    joinedAt: '2026-03-17T09:50:00.000Z',
    name: 'Dev Malhotra',
    ordersCount: 2,
    role: 'customer',
    status: 'blocked',
  },
]

export const reportTemplates: ReportTemplate[] = [
  {
    description: 'Status counts with revenue totals for the selected range.',
    format: 'csv',
    id: 'report-1',
    periodLabel: 'Today to date',
    title: 'Orders by status',
  },
  {
    description: 'Payment settlement summary grouped by gateway and day.',
    format: 'csv',
    id: 'report-2',
    periodLabel: 'Last 7 days',
    title: 'Payment collection',
  },
  {
    description: 'Printable operations snapshot for stand-ups and investor demos.',
    format: 'pdf',
    id: 'report-3',
    periodLabel: 'Current month',
    title: 'Executive dashboard brief',
  },
]

export const recentExports: ExportRecord[] = [
  {
    format: 'csv',
    generatedAt: '2026-04-09T10:12:00.000Z',
    id: 'export-1',
    requestedBy: 'Nisha Rao',
    status: 'ready',
    title: 'Orders by status',
  },
  {
    format: 'pdf',
    generatedAt: '2026-04-09T09:48:00.000Z',
    id: 'export-2',
    requestedBy: 'Ishaan Kapoor',
    status: 'ready',
    title: 'Executive dashboard brief',
  },
  {
    format: 'csv',
    generatedAt: '2026-04-09T09:30:00.000Z',
    id: 'export-3',
    requestedBy: 'Nisha Rao',
    status: 'processing',
    title: 'Payment collection',
  },
]

export const pricingCampaigns: PricingCampaign[] = [
  {
    basePrice: 6499,
    endsAt: '2026-04-15T23:59:00.000Z',
    id: 'campaign-1',
    name: 'Weekend sprint sale',
    productName: 'Velocity Sprint',
    salePrice: 5999,
    startsAt: '2026-04-10T00:00:00.000Z',
    status: 'scheduled',
  },
  {
    basePrice: 5299,
    endsAt: '2026-04-11T23:59:00.000Z',
    id: 'campaign-2',
    name: 'City edit markdown',
    productName: 'Metro Glide',
    salePrice: 4799,
    startsAt: '2026-04-08T00:00:00.000Z',
    status: 'live',
  },
  {
    basePrice: 3999,
    endsAt: '2026-04-05T23:59:00.000Z',
    id: 'campaign-3',
    name: 'Campus launch',
    productName: 'Canvas Draft',
    salePrice: 3699,
    startsAt: '2026-04-01T00:00:00.000Z',
    status: 'ended',
  },
]

export const priceHistory: PriceHistoryEntry[] = [
  {
    amount: 6499,
    effectiveAt: '2026-04-01T00:00:00.000Z',
    id: 'price-1',
    note: 'Base price refresh for Q2.',
    productName: 'Velocity Sprint',
  },
  {
    amount: 5999,
    effectiveAt: '2026-04-10T00:00:00.000Z',
    id: 'price-2',
    note: 'Weekend sprint sale.',
    productName: 'Velocity Sprint',
  },
  {
    amount: 4799,
    effectiveAt: '2026-04-08T00:00:00.000Z',
    id: 'price-3',
    note: 'City edit markdown.',
    productName: 'Metro Glide',
  },
]
