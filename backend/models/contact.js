const mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now },
})

const Contact = mongoose.model('Contact', ContactSchema)

module.exports = { Contact }
