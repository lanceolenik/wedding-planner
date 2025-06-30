const express = require('express')
const compression = require('compression')
const mongoose = require('mongoose')
const { setupMiddleware } = require('./middleware.js')
const config = require('./config.js') // Updated
const axios = require('axios')
const { Rsvp } = require('./models/rsvp.js')
const fs = require('fs')
const path = require('path')

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

// Log app startup
log('🚀 Node.js app starting...')

// Log all incoming requests
app.use((req, res, next) => {
  log(`Incoming request: ${req.url} (Original: ${req.originalUrl})`)
  next()
})

// Set up middleware
setupMiddleware(app)

// Health check endpoint
app.get(`${apiBasePath}/health`, (req, res) => {
  log('Health check requested')
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

// Import and mount routes
const authRoutes = require('./routes/auth.js')
const adminRoutes = require('./routes/admin.js')
const invitesRoutes = require('./routes/invites.js')
const contactRoutes = require('./routes/contact.js')
const helpRoutes = require('./routes/help.js')
const rsvpRoutes = require('./routes/rsvp.js')

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
