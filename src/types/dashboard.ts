export type DashboardSummary = {
  todaysCollection: number
  topCustomer: string
  orderCounts: Array<{
    label: string
    value: number
  }>
  trendingProducts: string[]
  lowStockAlerts: Array<{
    name: string
    stock: number
  }>
}
