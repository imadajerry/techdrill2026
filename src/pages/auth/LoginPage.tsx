import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './AuthPage.module.css'

type LoginFormState = {
  email: string
  password: string
}

const defaultState: LoginFormState = {
  email: 'customer@techdrill.dev',
  password: 'password123',
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isInitializing, role, signIn } = useAuth()
  const [formState, setFormState] = useState(defaultState)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isInitializing && isAuthenticated && role) {
    return (
      <Navigate replace to={role === 'customer' ? '/' : '/admin/dashboard'} />
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formState.email.trim() || !formState.password.trim()) {
      setErrorMessage('Email and password are required.')
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const resolvedRole = await signIn(formState)
      navigate(resolvedRole === 'customer' ? '/' : '/admin/dashboard', {
        replace: true,
      })
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to sign in.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={styles.card}>
      <p className={styles.eyebrow}>Shared login</p>
      <h1 className={styles.title}>Sign in to storefront or admin.</h1>
      <p className={styles.copy}>
        Role redirect happens automatically after authentication. Use the mock
        accounts below to switch between customer and admin views.
      </p>
      <div className={styles.hint}>
        `customer@techdrill.dev`, `admin@techdrill.dev`, or
        `superadmin@techdrill.dev` with `password123`.
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-email">
            Email
          </label>
          <input
            autoComplete="email"
            className={styles.input}
            id="login-email"
            onChange={(event) =>
              setFormState((currentState) => ({
                ...currentState,
                email: event.target.value,
              }))
            }
            placeholder="name@example.com"
            type="email"
            value={formState.email}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-password">
            Password
          </label>
          <input
            autoComplete="current-password"
            className={styles.input}
            id="login-password"
            onChange={(event) =>
              setFormState((currentState) => ({
                ...currentState,
                password: event.target.value,
              }))
            }
            placeholder="Enter your password"
            type="password"
            value={formState.password}
          />
        </div>
        {errorMessage ? <div className={styles.error}>{errorMessage}</div> : null}
        <button className={styles.submit} disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className={styles.footer}>
        Need a customer account?{' '}
        <Link className={styles.link} to="/register">
          Register and verify with OTP
        </Link>
      </p>
    </section>
  )
}
