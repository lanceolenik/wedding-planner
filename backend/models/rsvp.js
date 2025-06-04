const mongoose = require('mongoose')

const rsvpSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  guestOf: String,
  plusOne: String,
  children: Number,
  attending: String,
  dateTime: String,
})

const Rsvp = mongoose.model('Rsvp', rsvpSchema)

module.exports = { Rsvp }
