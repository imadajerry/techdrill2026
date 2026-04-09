/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react'
import { login, register, verifyOtp } from '../api/auth'
import type {
  LoginInput,
  RegisterInput,
  SessionUser,
  StoredSession,
  UserRole,
  VerifyOtpInput,
} from '../types/auth'
import { decodeJWT } from '../utils/decodeJWT'
import {
  clearStoredSession,
  readStoredSession,
  writeStoredSession,
} from '../utils/session'

type AuthContextValue = {
  isAuthenticated: boolean
  isInitializing: boolean
  token: string | null
  role: UserRole | null
  user: SessionUser | null
  signIn: (input: LoginInput) => Promise<UserRole>
  registerAccount: (input: RegisterInput) => Promise<string>
  verifyAccountOtp: (input: VerifyOtpInput) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function normalizeStoredSession(session: StoredSession): StoredSession | null {
  const decodedToken = decodeJWT(session.token)

  if (!decodedToken || decodedToken.exp * 1000 < Date.now()) {
    return null
  }

  return {
    token: session.token,
    role: decodedToken.role ?? session.role,
    user: {
      id: decodedToken.sub ?? session.user.id,
      name: decodedToken.name ?? session.user.name,
      email: decodedToken.email ?? session.user.email,
      role: decodedToken.role ?? session.user.role,
    },
  }
}

function getInitialSession() {
  const storedSession = readStoredSession()

  if (!storedSession) {
    return null
  }

  const normalizedSession = normalizeStoredSession(storedSession)

  if (!normalizedSession) {
    clearStoredSession()
  }

  return normalizedSession
}

export function AuthProvider({ children }: PropsWithChildren) {
  const initialSession = getInitialSession()
  const [token, setToken] = useState<string | null>(initialSession?.token ?? null)
  const [role, setRole] = useState<UserRole | null>(initialSession?.role ?? null)
  const [user, setUser] = useState<SessionUser | null>(initialSession?.user ?? null)

  async function signIn(input: LoginInput) {
    const response = await login(input)

    if (!response.success) {
      throw new Error(response.message)
    }

    const normalizedSession = normalizeStoredSession(response.data)

    if (!normalizedSession) {
      throw new Error('Unable to establish a valid session.')
    }

    writeStoredSession(normalizedSession)
    setToken(normalizedSession.token)
    setRole(normalizedSession.role)
    setUser(normalizedSession.user)

    return normalizedSession.role
  }

  async function registerAccount(input: RegisterInput) {
    const response = await register(input)

    if (!response.success) {
      throw new Error(response.message)
    }

    return response.data.email
  }

  async function verifyAccountOtp(input: VerifyOtpInput) {
    const response = await verifyOtp(input)

    if (!response.success) {
      throw new Error(response.message)
    }
  }

  function signOut() {
    clearStoredSession()
    setToken(null)
    setRole(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token && role && user),
        isInitializing: false,
        token,
        role,
        user,
        signIn,
        registerAccount,
        verifyAccountOtp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return context
}
