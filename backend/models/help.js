import mongoose from 'mongoose'

const HelpSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  helpAreas: [String],
  proAreas: [String],
  message: String,
  date: { type: Date, default: Date.now },
})

export const Help = mongoose.model('Help', HelpSchema)
