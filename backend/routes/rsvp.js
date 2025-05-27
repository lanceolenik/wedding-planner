import { Router } from 'express'
import { Rsvp } from '../models/rsvp.js'
import { sendRsvpEmails, isValidEmail } from '../utils.js'
import { syncRsvpsToGuests } from '../utils.js'

const router = Router()

router.post('/', async (req, res) => {
  console.log('RSVP route registered')
  const { name, email, phone, attending, plusOne, children, dateTime } = req.body
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required.' })
  }
  if (attending && !['Yes', 'No'].includes(attending)) {
    return res.status(400).json({ error: 'Attending must be Yes or No' })
  }
  try {
    const normalizedEmail = email.trim().toLowerCase()
    const existingRsvp = await Rsvp.findOne({ email: normalizedEmail })
    if (existingRsvp) {
      await Rsvp.findOneAndUpdate(
        { email: normalizedEmail },
        {
          name,
          email: normalizedEmail,
          phone,
          attending: attending || existingRsvp.attending || '',
          plusOne,
          children,
          dateTime,
        },
        { new: true },
      )
      console.log(`✅ Updated RSVP for ${normalizedEmail}`)
      await sendRsvpEmails(
        name,
        email,
        phone,
        attending || existingRsvp.attending || '',
        plusOne,
        children,
        dateTime,
      )
      await syncRsvpsToGuests()
      res.status(200).json({ success: true, message: 'RSVP updated successfully!' })
    } else {
      const newRsvp = new Rsvp({
        name,
        email: normalizedEmail,
        phone,
        attending: attending || '',
        plusOne,
        children,
        dateTime,
      })
      await newRsvp.save()
      console.log(`✅ Created new RSVP for ${normalizedEmail}`)
      await sendRsvpEmails(name, email, phone, attending || '', plusOne, children, dateTime)
      await syncRsvpsToGuests()
      res.status(200).json({ success: true, message: 'RSVP submitted successfully!' })
    }
  } catch (error) {
    if (error.code === 11000) {
      const normalizedEmail = email.trim().toLowerCase()
      await Rsvp.findOneAndUpdate(
        { email: normalizedEmail },
        {
          name,
          email: normalizedEmail,
          phone,
          attending: attending || existingRsvp?.attending || '',
          plusOne,
          children,
          dateTime,
        },
        { new: true },
      )
      console.log(`✅ Updated RSVP for ${normalizedEmail} after duplicate key error`)
      await sendRsvpEmails(
        name,
        email,
        phone,
        attending || existingRsvp?.attending || '',
        plusOne,
        children,
        dateTime,
      )
      await syncRsvpsToGuests()
      return res.status(200).json({ success: true, message: 'RSVP updated successfully!' })
    }
    console.error('❌ Error processing RSVP:', error)
    res.status(500).json({
      error: 'We couldn’t process your RSVP. Please try again shortly or contact us directly.',
    })
  }
})

export default router
