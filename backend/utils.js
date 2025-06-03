import nodemailer from 'nodemailer'
import fs from 'fs/promises'
import { config } from './config.js'
import { Rsvp } from './models/rsvp.js'

const transporter = nodemailer.createTransport({
  host: config.EMAIL_HOST,
  port: config.EMAIL_PORT,
  secure: config.EMAIL_SECURE,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
})

export const syncRsvpsToGuests = async () => {
  try {
    let guests = []
    try {
      const data = await fs.readFile(config.GUESTS_FILE, 'utf8')
      guests = JSON.parse(data)
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
      await fs.writeFile(config.GUESTS_FILE, JSON.stringify([]))
      guests = []
    }

    const rsvps = await Rsvp.find().lean()
    console.log('✅ Fetched RSVPs:', rsvps.length)

    const guestMap = guests.reduce((map, guest) => {
      map[guest.email.toLowerCase()] = guest
      return map
    }, {})

    const updatedGuests = []
    const processedEmails = new Set()

    for (const guest of guests) {
      const email = guest.email.toLowerCase()
      const rsvp = rsvps.find((r) => r.email.toLowerCase() === email)
      updatedGuests.push({
        ...guest,
        name: rsvp ? rsvp.name : guest.name,
        phone: rsvp ? rsvp.phone : guest.phone,
        guestOf: rsvp ? rsvp.guestOf || guest.guestOf : guest.guestOf,
        plusOne: rsvp ? rsvp.plusOne || '' : guest.plusOne || '',
        children: rsvp
          ? Number.isInteger(rsvp.children)
            ? rsvp.children
            : 0
          : guest.children || 0,
        attending: rsvp ? rsvp.attending || '' : guest.attending || '',
        dateTime: rsvp ? rsvp.dateTime || '' : guest.dateTime || '',
      })
      processedEmails.add(email)
    }

    for (const rsvp of rsvps) {
      const email = rsvp.email.toLowerCase()
      if (!processedEmails.has(email)) {
        const maxId = guests.length ? Math.max(...guests.map((g) => g.id)) : 0
        updatedGuests.push({
          id: maxId + updatedGuests.length + 1,
          name: rsvp.name || '',
          email: rsvp.email,
          phone: rsvp.phone || '',
          address1: '',
          address2: '',
          city: '',
          state: '',
          zip: '',
          guestOf: rsvp.guestOf || '',
          plusOne: rsvp.plusOne || '',
          children: Number.isInteger(rsvp.children) ? rsvp.children : 0,
          attending: rsvp.attending || '',
          dateTime: rsvp.dateTime || '',
          createdAt: new Date().toISOString(),
        })
        processedEmails.add(email)
        console.log(`✅ Added new guest from RSVP: ${rsvp.email}`)
      }
    }

    await fs.writeFile(config.GUESTS_FILE, JSON.stringify(updatedGuests, null, 2))
    console.log('✅ Synced RSVPs to guests.json')
    return updatedGuests
  } catch (error) {
    console.error('❌ Error syncing RSVPs to guests:', error)
    throw error
  }
}

export const formatAreas = (areasString) => {
  return areasString
    .split(',')
    .map((a) => a.replace(/_/g, ' '))
    .map((a) => a.charAt(0).toUpperCase() + a.slice(1))
    .join(', ')
}

export const sendContactEmails = async (name, email, message) => {
  try {
    await transporter.sendMail({
      from: `"The Wedding Planner" <${config.EMAIL_USER}>`,
      to: 'info@lokowebdesign.com',
      subject: 'Wedding Planner: New Contact Form Submission',
      text: `New message via the Wedding Planner contact form from ${name}:\n\nEmail: ${email}\n\nMessage: \n${message}`,
    })
    await transporter.sendMail({
      from: `"The Wedding Planner" <${config.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting The Wedding Planner!',
      text: `Hi ${name},\n\nThank you for reaching out! We received your message and will get back to you soon.\n\nYour message:\n"${message}"\n\nBest regards,\nThe Wedding Planner`,
    })
    console.log('✅ Emails sent successfully!')
  } catch (error) {
    console.error('❌ Error sending emails:', error)
  }
}

export const sendHelpEmails = async (name, phone, email, helpAreas, proAreas, message) => {
  try {
    const formattedHelpAreas = formatAreas(helpAreas)
    const formattedProAreas = formatAreas(proAreas)
    await transporter.sendMail({
      from: `"The Wedding Planner" <${config.EMAIL_USER}>`,
      to: 'info@lokowebdesign.com',
      subject: 'Wedding Planner: New Help Form Submission',
      text: `New message via the Wedding Planner help form from ${name}:\n\nEmail: ${email}\n\nPhone: ${phone}\n\nHelp Areas:\n${formattedHelpAreas}\n\nPro Area:\n${formattedProAreas}\n\nComments:\n${message}`,
    })
    await transporter.sendMail({
      from: `"The Wedding Planner" <${config.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting The Wedding Planner!',
      text: `Hi ${name},\n\nThank you for reaching out! We received your offer to help and will get back to you soon.\n\nYour message:\n\nHelp Area(s):"${formattedHelpAreas}"\n\nPro Area:\n${formattedProAreas}\n\nComments:\n${message}"\n\nBest regards,\nThe Wedding Planner`,
    })
    console.log('✅ Emails sent successfully!')
  } catch (error) {
    console.error('❌ Error sending emails:', error)
  }
}

export const sendRsvpEmails = async (
  name,
  email,
  phone,
  attending,
  plusOne,
  children,
  dateTime,
) => {
  try {
    if (!isValidEmail(email)) {
      console.warn(`⚠️ Skipping email to invalid user address: ${email}`)
      return
    }
    if (!isValidEmail('info@lokowebdesign.com')) {
      console.warn(`⚠️ Skipping email to invalid admin address: info@lokowebdesign.com`)
      return
    }

    const attendingText = attending || 'Pending'
    await transporter.sendMail({
      from: `"The Wedding Planner" <${config.EMAIL_USER}>`,
      to: 'info@lokowebdesign.com',
      subject: `Wedding RSVP: ${name} is ${attendingText}`,
      html: `New Wedding RSVP:<br><br>Response: ${attendingText}<br><br>Name: ${name}<br><br>Plus One: ${plusOne}<br><br>Additional people: ${children}<br><br>Email: ${email}<br><br>Phone: ${phone}<br><br><small>Submitted: ${dateTime}</small>`,
    })

    await transporter.sendMail({
      from: `"The Wedding Planner" <${config.EMAIL_USER}>`,
      to: email,
      subject: 'Wedding RSVP Confirmed!',
      html: `Hi ${name},<br><br>Thank you for your RSVP! You indicated that your attendance is ${attendingText}.<br><br>Here is the information you provided:<br><br>Name: ${name}<br><br>Plus One: ${plusOne}<br><br>Additional people: ${children}<br><br>Email: ${email}<br><br>Phone: ${phone}<br><br><small>Submitted: ${dateTime}</small>`,
    })

    console.log('✅ Emails sent successfully to info@lokowebdesign.com and', email)
  } catch (error) {
    console.error('❌ Error sending emails:', error.message)
  }
}

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
