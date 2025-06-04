const jwt = require('jsonwebtoken')
const { Router } = require('express')
const bcrypt = require('bcryptjs')
const { User } = require('../models/user.js')
const { authenticateToken } = require('../middleware.js')

const router = Router()

router.post('/register', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  try {
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({ username, password: hashedPassword })
    await user.save()

    res.status(201).json({ success: true, message: 'User registered successfully' })
  } catch (error) {
    console.error('❌ Error registering user:', error)
    res.status(500).json({ error: 'Server error, try again later' })
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  try {
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })

    res.status(200).json({ success: true, token })
  } catch (error) {
    console.error('❌ Error logging in:', error)
    res.status(500).json({ error: 'Server error, try again later' })
  }
})

module.exports = router
