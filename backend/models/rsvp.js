import mongoose from 'mongoose'

const RSVPSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  attending: String,
  plusOne: String,
  children: Number,
  dateTime: String,
  guestOf: String,
})

export const Rsvp = mongoose.model('Rsvp', RSVPSchema)
