import express from 'express'
import compression from 'compression'
import mongoose from 'mongoose'
import { setupMiddleware, authenticateToken } from './middleware.js'
import { config } from './config.js'
import axios from 'axios'
import { Rsvp } from './models/rsvp.js'

// Initialize Express app
const app = express()

// Set up middleware
setupMiddleware(app)

// MongoDB Connection
mongoose
  .connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
app.get('/api/google-places/*', async (req, res) => {
  try {
    if (!config.GOOGLE_API_KEY) {
      return res.status(500).json({ error: 'Google API key not configured' })
    }
    const url = `https://maps.googleapis.com/maps/api/place${req.path.replace('/api/google-places', '')}`
    const response = await axios.get(url, {
      params: { ...req.query, key: config.GOOGLE_API_KEY },
    })
    res.json(response.data)
  } catch (err) {
    console.error('Google API proxy error:', err.response?.data || err.message)
    res.status(err.response?.status || 500).json({ error: 'Failed to fetch Google API data' })
  }
})

app.get('/api/google-geocode', async (req, res) => {
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

app.use('/api', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/invites', invitesRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/help', helpRoutes)
app.use('/api/rsvp', rsvpRoutes)

app.use(compression())

// Start HTTP Server
app.listen(config.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${config.PORT}`)
})
