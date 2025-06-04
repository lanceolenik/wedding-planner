const { Router } = require('express')
const { Rsvp } = require('../models/rsvp.js')
const { authenticateToken } = require('../middleware.js')
const { syncRsvpsToGuests, sendRsvpEmails } = require('../utils.js')
const fs = require('fs/promises')
const config = require('../config.js') // Already updated

const router = Router()

router.get('/', authenticateToken, async (req, res) => {
  try {
    const guests = await syncRsvpsToGuests()
    res.status(200).json(guests)
  } catch (error) {
    console.error('❌ Error fetching guests:', error)
    res.status(500).json({ error: 'Server error, try again later' })
  }
})

router.post('/', authenticateToken, async (req, res) => {
  const {
    name,
    email,
    phone,
    address1,
    address2,
    city,
    state,
    zip,
    guestOf,
    plusOne,
    children,
    attending,
  } = req.body

  if (!name || !email || !phone || !address1 || !city || !state || !zip || !guestOf) {
    return res.status(400).json({ error: 'All required fields must be provided' })
  }
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: 'Invalid email format' })
  }
  if (!phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) {
    return res.status(400).json({ error: 'Invalid US phone number' })
  }
  if (!['Bride', 'Groom', 'Both'].includes(guestOf)) {
    return res.status(400).json({ error: 'Guest Of must be Bride, Groom, or Both' })
  }
  if (!zip.match(/^\d{5}(-\d{4})?$/)) {
    return res.status(400).json({ error: 'Invalid ZIP code' })
  }
  if (!Number.isInteger(children) || children < 0 || children > 2) {
    return res.status(400).json({ error: 'Children must be a number between 0 and 2' })
  }
  if (attending && !['Yes', 'No'].includes(attending)) {
    return res.status(400).json({ error: 'Attending must be Yes or No' })
  }

  try {
    let guests = []
    try {
      const data = await fs.readFile(config.GUESTS_FILE, 'utf8')
      guests = JSON.parse(data)
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
      await fs.writeFile(config.GUESTS_FILE, JSON.stringify([]))
    }

    const normalizedEmail = email.toLowerCase()
    if (guests.some((guest) => guest.email.toLowerCase() === normalizedEmail)) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    const dateTime = attending ? new Date().toISOString() : ''
    const rsvp = new Rsvp({
      name,
      email: normalizedEmail,
      phone,
      guestOf,
      plusOne: plusOne || '',
      children: children || 0,
      attending: attending || '',
      dateTime,
    })
    await rsvp.save()

    const newGuest = {
      id: guests.length ? Math.max(...guests.map((g) => g.id)) + 1 : 1,
      name,
      email: normalizedEmail,
      phone,
      address1,
      address2: address2 || '',
      city,
      state,
      zip,
      guestOf,
      plusOne: plusOne || '',
      children: children || 0,
      attending: attending || '',
      dateTime,
      createdAt: new Date().toISOString(),
    }

    guests.push(newGuest)
    await fs.writeFile(config.GUESTS_FILE, JSON.stringify(guests, null, 2))

    await syncRsvpsToGuests()

    if (attending) {
      await sendRsvpEmails(
        name,
        normalizedEmail,
        phone,
        attending,
        plusOne || '',
        children || 0,
        dateTime,
      )
    }

    res.status(201).json({ success: true, message: 'Guest added successfully', guest: newGuest })
  } catch (error) {
    console.error('❌ Error adding guest:', error)
    res.status(500).json({ error: 'Server error, try again later' })
  }
})

router.put('/:id', authenticateToken, async (req, res) => {
  console.log('PUT /api/invites/:id payload:', req.body)
  const { id } = req.params
  const {
    name,
    email,
    phone,
    address1,
    address2,
    city,
    state,
    zip,
    guestOf,
    plusOne,
    children,
    attending,
  } = req.body

  if (!name || !email || !phone || !address1 || !city || !state || !zip || !guestOf) {
    return res.status(400).json({ error: 'All required fields must be provided' })
  }
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: 'Invalid email format' })
  }
  if (!phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) {
    return res.status(400).json({ error: 'Invalid US phone number' })
  }
  if (!['Bride', 'Groom', 'Both'].includes(guestOf)) {
    return res.status(400).json({ error: 'Guest Of must be Bride, Groom, or Both' })
  }
  if (!zip.match(/^\d{5}(-\d{4})?$/)) {
    return res.status(400).json({ error: 'Invalid ZIP code' })
  }
  if (!Number.isInteger(children) || children < 0 || children > 2) {
    return res.status(400).json({ error: 'Children must be a number between 0 and 2' })
  }
  if (attending && !['Yes', 'No'].includes(attending)) {
    return res.status(400).json({ error: 'Attending must be Yes or No' })
  }

  try {
    let guests = []
    try {
      const data = await fs.readFile(config.GUESTS_FILE, 'utf8')
      guests = JSON.parse(data)
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
      await fs.writeFile(config.GUESTS_FILE, JSON.stringify([]))
    }

    const guestIndex = guests.findIndex((guest) => guest.id === parseInt(id))
    if (guestIndex === -1) {
      return res.status(404).json({ error: 'Guest not found' })
    }

    const normalizedEmail = email.toLowerCase()
    const currentGuest = guests[guestIndex]

    if (
      guests.some(
        (guest, index) => index !== guestIndex && guest.email.toLowerCase() === normalizedEmail,
      )
    ) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    const existingRsvp = await Rsvp.findOne({ email: currentGuest.email.toLowerCase() })
    let updatedRsvp
    const dateTime = new Date().toISOString()

    if (attending === 'Yes' || attending === 'No') {
      const rsvpData = {
        name,
        email: normalizedEmail,
        phone,
        guestOf,
        plusOne: plusOne || '',
        children: children || 0,
        attending,
        dateTime,
      }

      if (existingRsvp) {
        const previousAttending = existingRsvp.attending
        updatedRsvp = await Rsvp.findOneAndUpdate(
          { email: currentGuest.email.toLowerCase() },
          { $set: rsvpData },
          { new: true, runValidators: true },
        )
        if (attending !== previousAttending) {
          await sendRsvpEmails(
            name,
            normalizedEmail,
            phone,
            attending,
            plusOne || '',
            children || 0,
            dateTime,
          )
        }
      } else {
        updatedRsvp = new Rsvp(rsvpData)
        await updatedRsvp.save()
        await sendRsvpEmails(
          name,
          normalizedEmail,
          phone,
          attending,
          plusOne || '',
          children || 0,
          dateTime,
        )
      }
    } else if (existingRsvp) {
      const updateData = {}
      const fields = ['name', 'email', 'phone', 'guestOf', 'plusOne', 'children']
      fields.forEach((field) => {
        if (req.body[field] !== undefined && req.body[field] !== existingRsvp[field]) {
          updateData[field] = req.body[field]
        }
      })
      if (Object.keys(updateData).length > 0) {
        updateData.email = normalizedEmail
        updateData.dateTime = dateTime
        updatedRsvp = await Rsvp.findOneAndUpdate(
          { email: currentGuest.email.toLowerCase() },
          { $set: updateData },
          { new: true, runValidators: true },
        )
      } else {
        updatedRsvp = existingRsvp
      }
    } else {
      updatedRsvp = null
    }

    const updatedGuest = {
      id: parseInt(id),
      name,
      email: normalizedEmail,
      phone,
      address1,
      address2: address2 || '',
      city,
      state,
      zip,
      guestOf,
      plusOne: plusOne || '',
      children: children || 0,
      attending: attending || '',
      dateTime: updatedRsvp?.dateTime || currentGuest.dateTime || (attending ? dateTime : ''),
      createdAt: currentGuest.createdAt,
      updatedAt: dateTime,
    }

    guests[guestIndex] = updatedGuest
    await fs.writeFile(config.GUESTS_FILE, JSON.stringify(guests, null, 2))

    await syncRsvpsToGuests()

    res.status(200).json({
      success: true,
      message: 'Guest updated successfully',
      guest: updatedGuest,
    })
  } catch (error) {
    if (error.code === 11000) {
      const dateTime = new Date().toISOString()
      const rsvpData = {
        name,
        email: normalizedEmail,
        phone,
        guestOf,
        plusOne: plusOne || '',
        children: children || 0,
        attending: attending || '',
        dateTime,
      }
      try {
        updatedRsvp = await Rsvp.findOneAndUpdate(
          { email: normalizedEmail },
          { $set: rsvpData },
          { new: true, runValidators: true },
        )
        if (attending === 'Yes' || attending === 'No') {
          await sendRsvpEmails(
            name,
            normalizedEmail,
            phone,
            attending,
            plusOne || '',
            children || 0,
            dateTime,
          )
        }

        const updatedGuest = {
          id: parseInt(id),
          name,
          email: normalizedEmail,
          phone,
          address1,
          address2: address2 || '',
          city,
          state,
          zip,
          guestOf,
          plusOne: plusOne || '',
          children: children || 0,
          attending: attending || '',
          dateTime: updatedRsvp?.dateTime || dateTime,
          createdAt: currentGuest.createdAt,
          updatedAt: dateTime,
        }

        guests[guestIndex] = updatedGuest
        await fs.writeFile(config.GUESTS_FILE, JSON.stringify(guests, null, 2))

        await syncRsvpsToGuests()

        return res.status(200).json({
          success: true,
          message: 'Guest and RSVP updated successfully',
          guest: updatedGuest,
        })
      } catch (updateError) {
        console.error('❌ Error updating RSVP after duplicate key:', updateError)
        return res.status(500).json({ error: 'Server error, try again later' })
      }
    }
    console.error('❌ Error updating guest:', error)
    res.status(500).json({ error: 'Server error, try again later' })
  }
})

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params

  try {
    let guests = []
    try {
      const data = await fs.readFile(config.GUESTS_FILE, 'utf8')
      guests = JSON.parse(data)
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
      await fs.writeFile(config.GUESTS_FILE, JSON.stringify([]))
    }

    const guestIndex = guests.findIndex((guest) => guest.id === parseInt(id))
    if (guestIndex === -1) {
      return res.status(404).json({ error: 'Guest not found' })
    }

    const guestEmail = guests[guestIndex].email.toLowerCase()
    await Rsvp.deleteOne({ email: guestEmail })
    guests.splice(guestIndex, 1)
    await fs.writeFile(config.GUESTS_FILE, JSON.stringify(guests, null, 2))

    res.status(200).json({ success: true, message: 'Guest deleted successfully' })
  } catch (error) {
    console.error('❌ Error deleting guest:', error)
    res.status(500).json({ error: 'Server error, try again later' })
  }
})

module.exports = router
