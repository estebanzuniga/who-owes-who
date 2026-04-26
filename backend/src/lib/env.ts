import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z
    .string()
    .default('3001')
    .transform((val) => Number(val)),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/who-owes-who'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  JWT_ACCESS_TOKEN_SECRET: z.string().default('your-secret-key'),
  JWT_REFRESH_TOKEN_SECRET: z.string().default('your-refresh-secret-key'),
  ACCESS_TOKEN_EXPIRY: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRY: z.string().default('7d'),
  MAX_ACCOUNT_COUPLES_PER_USER: z.string().default('10').transform((val) => Number(val)),
  INVITE_TOKEN_EXPIRY: z.string().default('24h'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:')
  console.error(z.treeifyError(parsed.error))
  throw new Error('Invalid environment variables')
}

export const env = parsed.data