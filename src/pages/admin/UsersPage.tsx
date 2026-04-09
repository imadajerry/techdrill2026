import { useState } from 'react'
import PageIntro from '../../components/ui/PageIntro'
import SectionCard from '../../components/ui/SectionCard'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import { managedUsers } from '../../mocks/adminOperations'
import type { UserRole } from '../../types/auth'
import { formatDate } from '../../utils/formatDate'
import styles from './AdminPages.module.css'

const roleFilters: Array<'all' | UserRole> = ['all', 'customer', 'admin', 'superadmin']

function getUserTone(status: 'active' | 'blocked' | 'pending') {
  if (status === 'active') {
    return 'success'
  }

  if (status === 'blocked') {
    return 'danger'
  }

  return 'warning'
}

export default function AdminUsersPage() {
  const [selectedRole, setSelectedRole] = useState<'all' | UserRole>('all')

  const filteredUsers =
    selectedRole === 'all'
      ? managedUsers
      : managedUsers.filter((user) => user.role === selectedRole)

  const customerCount = managedUsers.filter((user) => user.role === 'customer').length
  const adminCount = managedUsers.filter((user) => user.role !== 'customer').length
  const pendingCount = managedUsers.filter((user) => user.status === 'pending').length

  return (
    <div className={styles.page}>
      <PageIntro
        aside={
          <div className={styles.asideBlock}>
            <p className={styles.asideLabel}>Pending approvals</p>
            <p className={styles.asideValue}>{pendingCount}</p>
            <p className={styles.asideCopy}>
              Customer onboarding is OTP-first while admin accounts remain a
              controlled back-office workflow.
            </p>
          </div>
        }
        description="The user management surface separates customers from admin operators and keeps status, role, and order history visible in one list."
        eyebrow="Admin users"
        title="Review access, role, and account health."
      />

      <div className={styles.statsGrid}>
        <StatCard
          helper="Customer records are the main audience for moderation tools."
          label="Customers"
          value={`${customerCount}`}
        />
        <StatCard
          helper="Admin and superadmin accounts stay visible for auditability."
          label="Operators"
          tone="accent"
          value={`${adminCount}`}
        />
        <StatCard
          helper="Useful for pending OTP or manual verification flows."
          label="Pending"
          tone="dark"
          value={`${pendingCount}`}
        />
      </div>

      <SectionCard
        description="Superadmin-only controls can be layered onto this list later without changing the page structure."
        title="Access directory"
      >
        <div className={styles.filterRow}>
          {roleFilters.map((role) => (
            <button
              className={`${styles.filterButton} ${
                selectedRole === role ? styles.filterActive : ''
              }`.trim()}
              key={role}
              onClick={() => setSelectedRole(role)}
              type="button"
            >
              {role === 'all' ? 'All roles' : role}
            </button>
          ))}
        </div>

        <div className={styles.list}>
          {filteredUsers.map((user) => (
            <article className={styles.row} key={user.id}>
              <div>
                <h3 className={styles.rowTitle}>{user.name}</h3>
                <div className={styles.rowMeta}>
                  <span>{user.email}</span>
                  <span>Joined {formatDate(user.joinedAt)}</span>
                  <span>{user.ordersCount} orders</span>
                </div>
              </div>
              <div className={styles.rowActions}>
                <StatusBadge tone="dark">{user.role}</StatusBadge>
                <StatusBadge tone={getUserTone(user.status)}>{user.status}</StatusBadge>
                <button className={styles.secondaryButton} type="button">
                  Review account
                </button>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
