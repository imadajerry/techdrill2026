import type { DashboardSummary } from '../types/dashboard'

export const adminDashboardMock: DashboardSummary = {
  todaysCollection: 142500,
  topCustomer: 'Aarav Menon',
  orderCounts: [
    { label: 'Placed', value: 8 },
    { label: 'Accepted', value: 5 },
    { label: 'Rejected', value: 2 },
    { label: 'Processed', value: 4 },
    { label: 'Dispatched', value: 3 },
    { label: 'Delivered', value: 11 },
  ],
  trendingProducts: ['Velocity Sprint', 'Studio Court', 'Summit Trek'],
  lowStockAlerts: [
    { name: 'Summit Trek', stock: 5 },
    { name: 'Studio Court', stock: 8 },
  ],
}
