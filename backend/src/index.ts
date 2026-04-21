import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import 'dotenv/config'
import { env } from './lib/env.js'

const app = express()

app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,   // required for cookies
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.get('/health', (_, res) => res.json({ status: 'ok' }))

app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT}`))