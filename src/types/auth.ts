export type UserRole = 'customer' | 'admin' | 'superadmin'

export type SessionUser = {
  id: string
  name: string
  email: string
  role: UserRole
}

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  name: string
  email: string
  password: string
}

export type VerifyOtpInput = {
  email: string
  otp: string
}

export type AuthPayload = {
  token: string
  role: UserRole
  user: SessionUser
}

export type DecodedToken = {
  sub: string
  email: string
  name: string
  role: UserRole
  exp: number
}

export type StoredSession = {
  token: string
  role: UserRole
  user: SessionUser
}
