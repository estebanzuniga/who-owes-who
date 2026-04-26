import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import 'dotenv/config'
import { env } from './lib/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { authRouter } from './routes/auth.js'

const app = express()

app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,   // required for cookies
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/auth', authRouter)

app.get('/health', (_, res) => res.json({ status: 'ok' }))

app.use(errorHandler)

app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT}`))