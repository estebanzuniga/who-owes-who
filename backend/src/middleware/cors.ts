// backend/middleware/cors.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'

// Initialize CORS middleware
const cors = Cors({
  origin: 'http://localhost:5173', // frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) reject(result)
      else resolve(result)
    })
  })
}

export default async function corsMiddleware(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors)
}
