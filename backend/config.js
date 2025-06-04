const dotenv = require('dotenv')
const path = require('path')

// Load environment variables
dotenv.config()

const config = {
  PORT: process.env.PORT || 5001,
  MONGO_URI: process.env.MONGO_URI,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_SECURE: process.env.EMAIL_SECURE === 'true',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  GUESTS_FILE: path.join(__dirname, 'guests.json'),
}

module.exports = config
