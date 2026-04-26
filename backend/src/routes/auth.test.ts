import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import cookieParser from 'cookie-parser'

// Module mocks

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findUniqueOrThrow: vi.fn(),
      create: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}))

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}))

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn(),
    sign: vi.fn(),
  },
}))

vi.mock('../lib/tokens.js', () => ({
  signAccessToken: vi.fn(),
  signRefreshToken: vi.fn(),
  setTokenCookies: vi.fn(),
}))

vi.mock('../middleware/auth.js', () => ({
  authMiddleware: vi.fn((req, _res, next) => {
    // Default: authenticated as a test user.
    // Override per-test with vi.mocked(authMiddleware).mockImplementation(...)
    req.user = { id: 'testuser-1', email: 'testuser@example.com' }
    next()
  }),
}))

vi.mock('../lib/env.js', () => ({
  env: {
    JWT_REFRESH_TOKEN_SECRET: 'test-refresh-secret',
    NODE_ENV: 'test',
    REFRESH_TOKEN_EXPIRY: '7d',
    ACCESS_TOKEN_EXPIRY: '15m',
  },
}))

vi.mock('../lib/tryCatch.js', () => ({
  tryCatch: (fn: Function) => fn,
}))

// Import SUT after mocks are registered

import { authRouter } from './auth.js'
import { prisma } from '../lib/prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { signAccessToken, signRefreshToken, setTokenCookies } from '../lib/tokens.js'
import { authMiddleware } from '../middleware/auth.js'

// Test app factory

function buildApp() {
  const app = express()
  app.use(express.json())
  app.use(cookieParser())
  app.use('/auth', authRouter)
  return app
}

// Helpers

const MOCK_USER = {
  id: 'testuser-1',
  email: 'testuser@example.com',
  name: 'Test user',
  passwordHash: '$2b$12$hashedpassword',
}

function resetAllMocks() {
  vi.mocked(prisma.user.findUnique).mockReset()
  vi.mocked(prisma.user.findUniqueOrThrow).mockReset()
  vi.mocked(prisma.user.create).mockReset()
  vi.mocked(prisma.refreshToken.create).mockReset()
  vi.mocked(prisma.refreshToken.findUnique).mockReset()
  vi.mocked(prisma.refreshToken.deleteMany).mockReset()
  vi.mocked(bcrypt.hash).mockReset()
  vi.mocked(bcrypt.compare).mockReset()
  vi.mocked(jwt.verify).mockReset()
  vi.mocked(signAccessToken).mockReset()
  vi.mocked(signRefreshToken).mockReset()
  vi.mocked(setTokenCookies).mockReset()
  vi.mocked(authMiddleware).mockImplementation((req: any, _res: any, next: any) => {
    req.user = { id: 'testuser-1', email: 'testuser@example.com' }
    next()
  })
}

// POST /auth/register

describe('POST /auth/register', () => {
  beforeEach(resetAllMocks)

  it('201 – creates user and returns public fields', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(bcrypt.hash).mockResolvedValue('hashed' as never)
    vi.mocked(prisma.user.create).mockResolvedValue(MOCK_USER as never)

    const res = await request(buildApp())
      .post('/auth/register')
      .send({ email: 'testuser@example.com', password: 'password123', name: 'Test user' })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ id: 'testuser-1', email: 'testuser@example.com', name: 'Test user' })

    // password must be hashed with cost ≥ 10
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12)

    // prisma.create must NOT receive raw password
    const createCall = vi.mocked(prisma.user.create).mock.calls![0]![0]
    expect(createCall.data).not.toHaveProperty('password')
    expect(createCall.data.passwordHash).toBe('hashed')
  })

  it('400 – rejects duplicate email', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(MOCK_USER as never)

    const res = await request(buildApp())
      .post('/auth/register')
      .send({ email: 'testuser@example.com', password: 'password123', name: 'Test user' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Email already in use')
    expect(prisma.user.create).not.toHaveBeenCalled()
  })

  it('400 – rejects invalid email format', async () => {
    const res = await request(buildApp())
      .post('/auth/register')
      .send({ email: 'not-an-email', password: 'password123', name: 'Test user' })

    expect(res.status).toBe(400)
    expect(prisma.user.create).not.toHaveBeenCalled()
  })

  it('400 – rejects password shorter than 8 characters', async () => {
    const res = await request(buildApp())
      .post('/auth/register')
      .send({ email: 'testuser@example.com', password: 'short', name: 'Test user' })

    expect(res.status).toBe(400)
    expect(prisma.user.create).not.toHaveBeenCalled()
  })

  it('400 – rejects empty name', async () => {
    const res = await request(buildApp())
      .post('/auth/register')
      .send({ email: 'testuser@example.com', password: 'password123', name: '' })

    expect(res.status).toBe(400)
    expect(prisma.user.create).not.toHaveBeenCalled()
  })

  it('400 – rejects missing fields', async () => {
    const res = await request(buildApp()).post('/auth/register').send({})
    expect(res.status).toBe(400)
  })
})

// POST /auth/login

describe('POST /auth/login', () => {
  beforeEach(resetAllMocks)

  it('200 – returns user and sets cookies on valid credentials', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(MOCK_USER as never)
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)
    vi.mocked(signAccessToken).mockReturnValue('access-token')
    vi.mocked(signRefreshToken).mockReturnValue('refresh-token')
    vi.mocked(prisma.refreshToken.create).mockResolvedValue({} as never)

    const res = await request(buildApp())
      .post('/auth/login')
      .send({ email: 'testuser@example.com', password: 'password123' })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 'testuser-1', email: 'testuser@example.com', name: 'Test user' })

    expect(signAccessToken).toHaveBeenCalledWith('testuser-1', 'testuser@example.com')
    expect(signRefreshToken).toHaveBeenCalledWith('testuser-1')
    expect(setTokenCookies).toHaveBeenCalledWith(expect.anything(), 'access-token', 'refresh-token')

    // refresh token must be persisted
    expect(prisma.refreshToken.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ token: 'refresh-token', userId: 'testuser-1' }),
      }),
    )
  })

  it('400 – rejects unknown email', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const res = await request(buildApp())
      .post('/auth/login')
      .send({ email: 'ghost@example.com', password: 'password123' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid credentials')
    expect(bcrypt.compare).not.toHaveBeenCalled()
  })

  it('400 – rejects wrong password', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(MOCK_USER as never)
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    const res = await request(buildApp())
      .post('/auth/login')
      .send({ email: 'testuser@example.com', password: 'wrongpassword' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid credentials')
    expect(setTokenCookies).not.toHaveBeenCalled()
  })

  it('400 – rejects schema-invalid body', async () => {
    const res = await request(buildApp())
      .post('/auth/login')
      .send({ email: 'testuser@example.com' }) // missing password

    expect(res.status).toBe(400)
  })
})

// POST /auth/refresh

describe('POST /auth/refresh', () => {
  beforeEach(resetAllMocks)

  const FUTURE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const PAST   = new Date(Date.now() - 1000)

  it('200 – issues new access token cookie when refresh token is valid', async () => {
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue({
      token: 'valid-refresh-token',
      userId: 'testuser-1',
      expiresAt: FUTURE,
    } as never)
    vi.mocked(jwt.verify).mockReturnValue({ id: 'testuser-1' } as never)
    vi.mocked(prisma.user.findUniqueOrThrow).mockResolvedValue(MOCK_USER as never)
    vi.mocked(signAccessToken).mockReturnValue('new-access-token')

    const res = await request(buildApp())
      .post('/auth/refresh')
      .set('Cookie', 'refreshToken=valid-refresh-token')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })

    // new accessToken cookie must be set
    const setCookie = res.headers['set-cookie'] as unknown as string[]
    expect(setCookie.some((c: string) => c.startsWith('accessToken='))).toBe(true)
  })

  it('401 – rejects request with no refresh token cookie', async () => {
    const res = await request(buildApp()).post('/auth/refresh')
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('No refresh token provided')
  })

  it('401 – rejects token not found in DB', async () => {
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(null)

    const res = await request(buildApp())
      .post('/auth/refresh')
      .set('Cookie', 'refreshToken=unknown-token')

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid or expired refresh token')
  })

  it('401 – rejects expired token stored in DB', async () => {
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue({
      token: 'old-token',
      userId: 'testuser-1',
      expiresAt: PAST,
    } as never)

    const res = await request(buildApp())
      .post('/auth/refresh')
      .set('Cookie', 'refreshToken=old-token')

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid or expired refresh token')
  })

  it('401 – rejects token that fails JWT verification', async () => {
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue({
      token: 'tampered-token',
      userId: 'testuser-1',
      expiresAt: FUTURE,
    } as never)
    vi.mocked(jwt.verify).mockImplementation(() => { throw new Error('invalid signature') })

    const res = await request(buildApp())
      .post('/auth/refresh')
      .set('Cookie', 'refreshToken=tampered-token')

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid refresh token')
  })
})

// POST /auth/logout

describe('POST /auth/logout', () => {
  beforeEach(resetAllMocks)

  it('200 – deletes refresh token and clears cookies', async () => {
    vi.mocked(prisma.refreshToken.deleteMany).mockResolvedValue({ count: 1 } as never)

    const res = await request(buildApp())
      .post('/auth/logout')
      .set('Cookie', 'refreshToken=some-token; accessToken=some-access')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })

    expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({
      where: { token: 'some-token' },
    })

    // both cookies must be cleared
    const setCookie = res.headers['set-cookie'] as unknown as string[]
    expect(setCookie.some((c: string) => c.startsWith('accessToken=;'))).toBe(true)
    expect(setCookie.some((c: string) => c.startsWith('refreshToken=;'))).toBe(true)
  })

  it('200 – succeeds even when no refresh token cookie is present', async () => {
    const res = await request(buildApp()).post('/auth/logout')

    expect(res.status).toBe(200)
    expect(prisma.refreshToken.deleteMany).not.toHaveBeenCalled()
  })

  it('401 – blocked by authMiddleware when unauthenticated', async () => {
    vi.mocked(authMiddleware).mockImplementation((_req, res, _next) => {
      res.status(401).json({ message: 'Unauthorized' })
    })

    const res = await request(buildApp()).post('/auth/logout')

    expect(res.status).toBe(401)
    expect(prisma.refreshToken.deleteMany).not.toHaveBeenCalled()
  })
})

// GET /auth/profile

describe('GET /auth/profile', () => {
  beforeEach(resetAllMocks)

  it('200 – returns public user fields for authenticated user', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'testuser-1',
      email: 'testuser@example.com',
      name: 'Test user',
    } as never)

    const res = await request(buildApp()).get('/auth/profile')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 'testuser-1', email: 'testuser@example.com', name: 'Test user' })

    // must query by the id injected by authMiddleware
    expect(prisma.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'testuser-1' } }),
    )

    // sensitive field must never leak
    expect(res.body).not.toHaveProperty('passwordHash')
  })

  it('401 – blocked by authMiddleware when unauthenticated', async () => {
    vi.mocked(authMiddleware).mockImplementation((_req, res, _next) => {
      res.status(401).json({ message: 'Unauthorized' })
    })

    const res = await request(buildApp()).get('/auth/profile')

    expect(res.status).toBe(401)
    expect(prisma.user.findUnique).not.toHaveBeenCalled()
  })

  it('404 – user is not found in DB (deleted account edge-case)', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const res = await request(buildApp()).get('/auth/profile')

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('User not found')
  })
})