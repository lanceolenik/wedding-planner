import express from 'express'
import compression from 'compression'
import mongoose from 'mongoose'
import { setupMiddleware } from './middleware.js'
import { config } from './config.js'
import axios from 'axios'
import { Rsvp } from './models/rsvp.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define base path for API routes based on environment
const isProduction = process.env.NODE_ENV === 'production'
const apiBasePath = isProduction ? '/wedding/api' : '/api'

// Initialize Express app
const app = express()

// Determine log file path based on environment
const logDir = isProduction ? '/home/lanczklo/wedding_api/logs' : path.join(__dirname, 'logs')
const logFile = path.join(logDir, 'startup.log')
const log = (message) => {
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true })
  fs.appendFileSync(logFile, `${new Date().toISOString()} - ${message}\n`)
}

// Log all incoming requests
app.use((req, res, next) => {
  log(`Incoming request: ${req.url} (Original: ${req.originalUrl})`)
  next()
})

// Set up middleware
setupMiddleware(app)

// Health check endpoint
app.get(`${apiBasePath}/health`, (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' })
})

// MongoDB Connection
mongoose
  .connect(config.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  })
  .then(() => log('✅ MongoDB Connected'))
  .catch((err) => log(`❌ MongoDB Connection Error: ${err.message}`))

// Create unique index on email for Rsvp collection
Rsvp.collection.createIndex({ email: 1 }, { unique: true }, (err) => {
  if (err) {
    log(`❌ Error creating unique index on email for rsvps: ${err.message}`)
  } else {
    log('✅ Unique index on email created for rsvps collection')
  }
})

// Proxy endpoint for Google Places API
app.get(`${apiBasePath}/google-places/*`, async (req, res) => {
  try {
    if (!config.GOOGLE_API_KEY) {
      return res.status(500).json({ error: 'Google API key not configured' })
    }
    const url = `https://maps.googleapis.com/maps/api/place${req.path.replace(`${apiBasePath}/google-places`, '')}`
    const response = await axios.get(url, {
      params: { ...req.query, key: config.GOOGLE_API_KEY },
    })
    if (response.data.status !== 'OK') {
      log(`Google Places warning: ${JSON.stringify(response.data)}`)
    }
    res.json(response.data)
  } catch (err) {
    log(
      `Google Places proxy error: ${JSON.stringify({
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        query: req.query,
      })}`,
    )
    res.status(err.response?.status || 500).json({
      error: 'Failed to fetch Google API data',
      details: err.response?.data || err.message,
    })
  }
})

app.get(`${apiBasePath}/google-geocode`, async (req, res) => {
  try {
    if (!config.GOOGLE_API_KEY) {
      log('Google Geocode error: API key not configured')
      return res.status(500).json({ error: 'Google API key not configured' })
    }
    if (!req.query.address) {
      log('Google Geocode error: Address parameter missing')
      return res.status(400).json({ error: 'Address parameter is required' })
    }
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: { ...req.query, key: config.GOOGLE_API_KEY },
      timeout: 5000, // Add timeout to prevent hanging
    })
    log(`Google Geocode Response for ${req.query.address}: ${JSON.stringify(response.data)}`)
    if (response.data.status !== 'OK') {
      log(`Google Geocode warning: ${JSON.stringify(response.data)}`)
      return res.status(400).json(response.data)
    }
    res.json(response.data)
  } catch (err) {
    log(
      `Google Geocode proxy error: ${JSON.stringify({
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        query: req.query,
        stack: err.stack,
      })}`,
    )
    res.status(err.response?.status || 500).json({
      error: 'Failed to fetch geocode data',
      details: err.response?.data || err.message,
    })
  }
})

// Import and mount routes
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import invitesRoutes from './routes/invites.js'
import contactRoutes from './routes/contact.js'
import helpRoutes from './routes/help.js'
import rsvpRoutes from './routes/rsvp.js'

app.use(apiBasePath, authRoutes)
app.use(`${apiBasePath}/admin`, adminRoutes)
app.use(`${apiBasePath}/invites`, invitesRoutes)
app.use(`${apiBasePath}/contact`, contactRoutes)
app.use(`${apiBasePath}/help`, helpRoutes)
app.use(`${apiBasePath}/rsvp`, rsvpRoutes)

app.use(compression())

// Start HTTP Server
app.listen(config.PORT, () => {
  log(`🚀 Server running on port ${config.PORT}`)
})
