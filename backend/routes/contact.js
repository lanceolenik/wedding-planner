import { Router } from 'express'
import { Contact } from '../models/contact.js'
import { sendContactEmails } from '../utils.js'

const router = Router()

router.post('/', async (req, res) => {
  const { name, email, message } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' })
  }
  try {
    const newContact = new Contact({ name, email, message })
    await newContact.save()
    await sendContactEmails(name, email, message)
    res.status(200).json({ success: true, message: 'Contact form submitted successfully!' })
  } catch (error) {
    console.error('❌ Error processing form:', error)
    res.status(500).json({ error: 'Server error, try again later' })
  }
})

export default router
