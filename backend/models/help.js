const mongoose = require('mongoose')

const HelpSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  helpAreas: [String],
  proAreas: [String],
  message: String,
  date: { type: Date, default: Date.now },
})

const Help = mongoose.model('Help', HelpSchema)

module.exports = { Help }
