import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z
    .string()
    .default('3001')
    .transform((val) => Number(val)),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/who-owes-who'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:')
  console.error(z.treeifyError(parsed.error))
  throw new Error('Invalid environment variables')
}

export const env = parsed.data