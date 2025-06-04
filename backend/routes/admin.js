const { Router } = require('express')
const { Contact } = require('../models/contact.js')
const { Help } = require('../models/help.js')
const { Rsvp } = require('../models/rsvp.js')
const { authenticateToken } = require('../middleware.js')
const { User } = require('../models/user.js')

const router = Router()

router.get('/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.status(200).json({ username: user.username })
  } catch (error) {
    console.error('❌ Error fetching user:', error)
    res.status(500).json({ error: 'Server error, try again later' })
  }
})

router.get('/contacts', authenticateToken, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 })
    res.status(200).json(contacts)
  } catch (error) {
    console.error('❌ Error fetching contacts:', error)
    res.status(500).json({ error: 'Server error, try again later' })
  }
})

router.get('/help', authenticateToken, async (req, res) => {
  try {
    const helpEntries = await Help.find().sort({ date: -1 })
    res.status(200).json(helpEntries)
  } catch (error) {
    console.error('❌ Error fetching help entries:', error)
    res.status(500).json({ error: 'Server error, try again later' })
  }
})

router.get('/rsvps', authenticateToken, async (req, res) => {
  try {
    const rsvps = await Rsvp.find().sort({ dateTime: -1 })
    res.status(200).json(rsvps)
  } catch (error) {
    console.error('❌ Error fetching RSVPs:', error)
    res.status(500).json({ error: 'Server error, try again later' })
  }
})

module.exports = router
