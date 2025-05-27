import { Router } from 'express'
import { Help } from '../models/help.js'
import { sendHelpEmails } from '../utils.js'

const router = Router()

router.post('/', async (req, res) => {
  console.log('Help route registered')
  const { name, phone, email, helpAreas, proAreas, message } = req.body
  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'All fields are required.' })
  }
  try {
    const newHelp = new Help({ name, phone, email, helpAreas, proAreas, message })
    await newHelp.save()
    await sendHelpEmails(name, phone, email, helpAreas, proAreas, message)
    res.status(200).json({ success: true, message: 'Help form submitted successfully!' })
  } catch (error) {
    console.error('❌ Error processing form:', error)
    res.status(500).json({ error: 'Server error, try again later' })
  }
})

export default router
