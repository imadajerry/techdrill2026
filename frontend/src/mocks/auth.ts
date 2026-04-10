import type { ApiResponse } from '../types/api'
import type {
  AuthPayload,
  LoginInput,
  RegisterInput,
  SessionUser,
  UserRole,
  VerifyOtpInput,
} from '../types/auth'

type MockUserRecord = SessionUser & {
  password: string
}

type PendingRegistration = RegisterInput & {
  otp: string
}

const activeUsers: MockUserRecord[] = [
  {
    id: 'u_customer_1',
    name: 'Aarav Menon',
    email: 'customer@techdrill.dev',
    password: 'password123',
    role: 'customer',
  },
  {
    id: 'u_admin_1',
    name: 'Nisha Rao',
    email: 'admin@techdrill.dev',
    password: 'password123',
    role: 'admin',
  },
  {
    id: 'u_super_1',
    name: 'Ishaan Kapoor',
    email: 'superadmin@techdrill.dev',
    password: 'password123',
    role: 'superadmin',
  },
]

const pendingRegistrations = new Map<string, PendingRegistration>()

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function createMockToken(user: SessionUser) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
    }),
  )

  return `${header}.${payload}.mock-signature`
}

function sanitizeUser(user: MockUserRecord): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

function createAuthPayload(user: SessionUser): AuthPayload {
  return {
    token: createMockToken(user),
    role: user.role,
    user,
  }
}

export async function mockLogin(
  input: LoginInput,
): Promise<ApiResponse<AuthPayload>> {
  await wait(600)

  const matchedUser = activeUsers.find(
    (user) =>
      user.email.toLowerCase() === input.email.toLowerCase() &&
      user.password === input.password,
  )

  if (!matchedUser) {
    return {
      success: false,
      message:
        'Invalid email or password.',
    }
  }

  return {
    success: true,
    data: createAuthPayload(sanitizeUser(matchedUser)),
    message: 'Login successful.',
  }
}

export async function mockRegister(
  input: RegisterInput,
): Promise<ApiResponse<{ email: string }>> {
  await wait(700)

  const alreadyExists = activeUsers.some(
    (user) => user.email.toLowerCase() === input.email.toLowerCase(),
  )

  if (alreadyExists) {
    return {
      success: false,
      message: 'An account with this email already exists.',
    }
  }

  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  pendingRegistrations.set(input.email.toLowerCase(), {
    ...input,
    otp: generatedOtp,
  })

  return {
    success: true,
    data: {
      email: input.email,
    },
    message: `OTP sent. (Mock mode: Use ${generatedOtp})`,
  }
}

export async function mockVerifyOtp(
  input: VerifyOtpInput,
): Promise<ApiResponse<{ email: string }>> {
  await wait(500)

  const pendingUser = pendingRegistrations.get(input.email.toLowerCase())

  if (!pendingUser) {
    return {
      success: false,
      message: 'Registration session not found. Start again.',
    }
  }

  if (pendingUser.otp !== input.otp) {
    return {
      success: false,
      message: 'Invalid OTP.',
    }
  }

  const createdUser: MockUserRecord = {
    id: `u_customer_${activeUsers.length + 1}`,
    name: pendingUser.name,
    email: pendingUser.email,
    password: pendingUser.password,
    role: 'customer' satisfies UserRole,
  }

  activeUsers.push(createdUser)
  pendingRegistrations.delete(input.email.toLowerCase())

  return {
    success: true,
    data: {
      email: createdUser.email,
    },
    message: 'Account verified. You can log in now.',
  }
}
