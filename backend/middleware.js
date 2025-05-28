import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken'
import { config } from './config.js'

// Define allowed origins based on environment
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [process.env.VITE_APP_URL || 'https://oleniks.net/wedding']
    : [
        'http://localhost:5173',
        'https://localhost:5173',
        'http://localhost:5001',
        'https://localhost:5001',
      ]

export const setupMiddleware = (app) => {
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g., Postman) or allowed origins
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  )

  // Parse JSON payloads
  app.use(express.json())
}

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied, invalid or missing token' })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' })
  }

  try {
    const verified = jwt.verify(token, config.JWT_SECRET)
    req.user = verified
    next()
  } catch (error) {
    const errorMessage = error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'
    res.status(403).json({ error: errorMessage })
  }
}
