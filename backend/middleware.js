import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken'
import { config } from './config.js'

export const setupMiddleware = (app) => {
  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'https://localhost:5173',
        'https://localhost:5001',
        'http://localhost:5001',
        'https://oleniks.net',
      ],
      methods: 'GET,POST,PUT,DELETE,OPTIONS',
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  )
  app.options('*', cors())
  app.use(express.json())
}

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Access denied, no token provided' })

  try {
    const verified = jwt.verify(token, config.JWT_SECRET)
    req.user = verified
    next()
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' })
  }
}
