import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import FeaturePlaceholder from '../components/feedback/FeaturePlaceholder'
import AdminLayout from '../components/layout/AdminLayout'
import AuthLayout from '../components/layout/AuthLayout'
import CustomerLayout from '../components/layout/CustomerLayout'
import { AppStateProvider } from '../context/AppStateContext'
import { AuthProvider } from '../context/AuthContext'
import DashboardPage from '../pages/admin/DashboardPage'
import AdminOrdersPage from '../pages/admin/OrdersPage'
import AdminPricingPage from '../pages/admin/PricingPage'
import AdminProductsPage from '../pages/admin/ProductsPage'
import AdminReportsPage from '../pages/admin/ReportsPage'
import AdminUsersPage from '../pages/admin/UsersPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import CartPage from '../pages/customer/CartPage'
import FavouritesPage from '../pages/customer/FavouritesPage'
import HomePage from '../pages/customer/HomePage'
import OrdersPage from '../pages/customer/OrdersPage'
import ProductsPage from '../pages/customer/ProductsPage'
import ProtectedRoute from './ProtectedRoute'

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/verify-otp', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['customer']} />,
    children: [
      {
        element: <CustomerLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/products', element: <ProductsPage /> },
          { path: '/cart', element: <CartPage /> },
          { path: '/orders', element: <OrdersPage /> },
          { path: '/favourites', element: <FavouritesPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['admin', 'superadmin']} />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
          { path: 'products', element: <AdminProductsPage /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'reports', element: <AdminReportsPage /> },
          { path: 'pricing', element: <AdminPricingPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: (
      <AuthLayout>
        <FeaturePlaceholder
          description="The requested page does not exist yet. Use the login page to enter the customer or admin surface."
          title="Route not found"
        />
      </AuthLayout>
    ),
  },
])

export default function AppRouter() {
  return (
    <AuthProvider>
      <AppStateProvider>
        <RouterProvider router={router} />
      </AppStateProvider>
    </AuthProvider>
  )
}
