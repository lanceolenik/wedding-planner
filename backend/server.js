import express from 'express'
import compression from 'compression'
import mongoose from 'mongoose'
import cors from 'cors'
import { setupMiddleware, authenticateToken } from './middleware.js'
import { config } from './config.js'
import axios from 'axios'
import { Rsvp } from './models/rsvp.js'

// Initialize Express app
const app = express()

// Define API base path based on environment
const apiBasePath = process.env.NODE_ENV === 'production' ? '/wedding/api' : '/api'

// Set up CORS for production
app.use(
  cors({
    origin: process.env.VITE_APP_URL || 'http://localhost:5001', // Allow frontend origin
    credentials: true, // Support JWT tokens
  }),
)

// Set up middleware
setupMiddleware(app)

// MongoDB Connection
mongoose
  .connect(config.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err))

// Create unique index on email for Rsvp collection
Rsvp.collection.createIndex({ email: 1 }, { unique: true }, (err) => {
  if (err) {
    console.error('❌ Error creating unique index on email for rsvps:', err.message)
  } else {
    console.log('✅ Unique index on email created for rsvps collection')
  }
})

// Proxy endpoint for Google Maps API
app.get(`${apiBasePath}/google-places/*`, async (req, res) => {
  try {
    if (!config.GOOGLE_API_KEY) {
      return res.status(500).json({ error: 'Google API key not configured' })
    }
    const url = `https://maps.googleapis.com/maps/api/place${req.path.replace(apiBasePath + '/google-places', '')}`
    const response = await axios.get(url, {
      params: { ...req.query, key: config.GOOGLE_API_KEY },
    })
    res.json(response.data)
  } catch (err) {
    console.error('Google API proxy error:', err.response?.data || err.message)
    res.status(err.response?.status || 500).json({ error: 'Failed to fetch Google API data' })
  }
})

app.get(`${apiBasePath}/google-geocode`, async (req, res) => {
  try {
    if (!config.GOOGLE_API_KEY) {
      return res.status(500).json({ error: 'Google API key not configured' })
    }
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: { ...req.query, key: config.GOOGLE_API_KEY },
    })
    res.json(response.data)
  } catch (err) {
    console.error('Google Geocode proxy error:', err.response?.data || err.message)
    res.status(err.response?.status || 500).json({ error: 'Failed to fetch geocode data' })
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
const port = process.env.PORT || 5001 // Default to 5001 for local dev, Namecheap assigns in prod
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`)
})
