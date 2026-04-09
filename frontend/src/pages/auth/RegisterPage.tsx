import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './AuthPage.module.css'

type RegisterFormState = {
  name: string
  email: string
  password: string
}

const defaultRegisterState: RegisterFormState = {
  name: '',
  email: '',
  password: '',
}

export default function RegisterPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    isAuthenticated,
    isInitializing,
    registerAccount,
    role,
    verifyAccountOtp,
  } = useAuth()
  const [registerState, setRegisterState] = useState(defaultRegisterState)
  const [pendingEmail, setPendingEmail] = useState(
    (location.state as { email?: string } | null)?.email ?? '',
  )
  const [otp, setOtp] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOtpStep = location.pathname === '/verify-otp' || Boolean(pendingEmail)

  useEffect(() => {
    if (location.pathname === '/verify-otp' && !pendingEmail) {
      setErrorMessage('Start from registration before verifying OTP.')
    }
  }, [location.pathname, pendingEmail])

  if (!isInitializing && isAuthenticated && role) {
    return (
      <Navigate replace to={role === 'customer' ? '/' : '/admin/dashboard'} />
    )
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (
      !registerState.name.trim() ||
      !registerState.email.trim() ||
      !registerState.password.trim()
    ) {
      setErrorMessage('Name, email, and password are required.')
      return
    }

    if (registerState.password.trim().length < 8) {
      setErrorMessage('Password must be at least 8 characters.')
      return
    }

    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      const email = await registerAccount(registerState)
      setPendingEmail(email)
      setSuccessMessage('OTP sent. Use 123456 while mock mode is enabled.')
      navigate('/verify-otp', {
        replace: true,
        state: { email },
      })
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to register account.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleOtpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!pendingEmail.trim() || !otp.trim()) {
      setErrorMessage('Email context and OTP are required.')
      return
    }

    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      await verifyAccountOtp({
        email: pendingEmail,
        otp,
      })
      navigate('/login', {
        replace: true,
      })
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to verify OTP.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={styles.card}>
      <p className={styles.eyebrow}>
        {isOtpStep ? 'OTP verification' : 'Register'}
      </p>
      <h1 className={styles.title}>
        {isOtpStep ? 'Activate your account.' : 'Create an account.'}
      </h1>
      <p className={styles.copy}>
        {isOtpStep
          ? `We sent a six-digit code to ${pendingEmail || 'your email'}.`
          : ''}
      </p>
      {!isOtpStep ? (
        <form className={styles.form} onSubmit={handleRegister}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-name">
              Name
            </label>
            <input
              className={styles.input}
              id="register-name"
              onChange={(event) =>
                setRegisterState((currentState) => ({
                  ...currentState,
                  name: event.target.value,
                }))
              }
              placeholder="Full name"
              type="text"
              value={registerState.name}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-email">
              Email
            </label>
            <input
              className={styles.input}
              id="register-email"
              onChange={(event) =>
                setRegisterState((currentState) => ({
                  ...currentState,
                  email: event.target.value,
                }))
              }
              placeholder="name@example.com"
              type="email"
              value={registerState.email}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-password">
              Password
            </label>
            <input
              className={styles.input}
              id="register-password"
              onChange={(event) =>
                setRegisterState((currentState) => ({
                  ...currentState,
                  password: event.target.value,
                }))
              }
              placeholder="At least 8 characters"
              type="password"
              value={registerState.password}
            />
          </div>
          {errorMessage ? <div className={styles.error}>{errorMessage}</div> : null}
          {successMessage ? (
            <div className={styles.success}>{successMessage}</div>
          ) : null}
          <button className={styles.submit} disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Sending OTP...' : 'Create account'}
          </button>
        </form>
      ) : (
        <form className={styles.form} onSubmit={handleOtpSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="verify-email">
              Email
            </label>
            <input
              className={styles.input}
              id="verify-email"
              onChange={(event) => setPendingEmail(event.target.value)}
              type="email"
              value={pendingEmail}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="verify-otp">
              OTP
            </label>
            <input
              className={styles.input}
              id="verify-otp"
              inputMode="numeric"
              maxLength={6}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="123456"
              type="text"
              value={otp}
            />
          </div>
          {errorMessage ? <div className={styles.error}>{errorMessage}</div> : null}
          <div className={styles.hint}>Use `123456` while mock mode is enabled.</div>
          <button className={styles.submit} disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Verifying OTP...' : 'Verify OTP'}
          </button>
        </form>
      )}
      <p className={styles.footer}>
        Already have access?{' '}
        <Link className={styles.link} to="/login">
          Login
        </Link>
      </p>
    </section>
  )
}
