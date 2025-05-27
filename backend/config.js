import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const config = {
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
