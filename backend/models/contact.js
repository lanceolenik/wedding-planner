import mongoose from 'mongoose'

const ContactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now },
})

export const Contact = mongoose.model('Contact', ContactSchema)
