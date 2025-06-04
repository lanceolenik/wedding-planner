const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
const config = require('./config.js')

const setupMiddleware = (app) => {
  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'https://localhost:5173',
        'https://localhost:5001',
        'http://localhost:5001',
        'https://oleniks.net/wedding',
      ],
      methods: 'GET,POST,PUT,DELETE,OPTIONS',
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  )
  app.options('*', cors())
  app.use(express.json())
}

const authenticateToken = (req, res, next) => {
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

module.exports = { setupMiddleware, authenticateToken }
