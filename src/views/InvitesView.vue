<template>
  <div class="invites">
    <div class="container shadowed">
      <p class="hide-on-print">
        <a href="/admin"><small>« Back to Admin</small></a>
      </p>
      <h1 class="hide-on-print">Manage Invites</h1>
      <!-- Optional: Uncomment to display username -->
      <!-- <h4>Logged in as {{ username }}</h4> -->
      <!-- Guests Table with Filter -->
      <div class="table-heading">
        <h2>Current Invitees</h2>
        <p>These people have been invited. Some have RSVP'd and some have not.</p>
      </div>
      <div class="filter-group hide-on-print">
        <label for="attending-filter">Filter by Attending:</label>
        <select id="attending-filter" v-model="filterAttending">
          <option value="all">All</option>
          <option value="yes">Attending</option>
          <option value="no">Not Attending</option>
        </select>
      </div>
      <div v-if="filteredGuests.length" class="table-wrapper" :data-printing="printingTable">
        <button class="print" @click="printTable">
          <i aria-label="Print" class="icon-local_printshop"></i>
        </button>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Guest Of</th>
              <th>Children</th>
              <th>Attending</th>
              <th v-if="printingTable !== 'invites'">QR Code</th>
              <th v-if="printingTable !== 'invites'">Edit</th>
              <th v-if="printingTable !== 'invites'">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="guest in filteredGuests" :key="guest.id" :data-created="guest.createdAt">
              <td data-label="Name">
                {{ guest.name }}
                {{ guest.plusOne ? ' and ' + guest.plusOne : '' }}
              </td>
              <td data-label="Email">{{ guest.email }}</td>
              <td data-label="Phone">{{ formatPhoneNumber(guest.phone) }}</td>
              <td data-label="Address">
                {{ formatAddress(guest) || '' }}<br />
                {{ guest.city ? guest.city + ',' : '' }} {{ guest.state }} {{ guest.zip }}
              </td>
              <td data-label="Guest Of">{{ guest.guestOf }}</td>
              <td data-label="Children">{{ guest.children }}</td>
              <td
                data-label="Attending"
                :class="{
                  '--green': guest.attending === 'Yes',
                  '--red': guest.attending === 'No',
                }"
              >
                {{ guest.attending || '-' }}
              </td>
              <td v-if="printingTable !== 'invites'" data-label="QR Code">
                <button
                  v-if="guest.qrCodeUrl"
                  class="action-btn qr-btn"
                  @click="downloadQRCode(guest)"
                  title="Download QR Code"
                >
                  <img
                    v-if="guest.qrCodeUrl"
                    :src="guest.qrCodeUrl"
                    alt="QR Code"
                    class="qr-thumbnail"
                    @click="downloadQRCode(guest)"
                    title="Download QR Code"
                  />
                </button>
                <span v-else>-</span>
              </td>
              <td v-if="printingTable !== 'invites'" data-label="Edit">
                <button class="action-btn" @click="editGuest(guest)" title="Edit Guest">
                  <i class="icon-drive_file_rename_outline"></i>
                </button>
              </td>
              <td v-if="printingTable !== 'invites'" data-label="Delete">
                <button
                  class="action-btn delete-btn"
                  @click="deleteGuest(guest.id)"
                  title="Delete Guest"
                >
                  <i class="icon-delete_forever"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else>No guests match the selected filter.</p>
      <hr class="hide-on-print" />
      <!-- Add/Edit Guest Form -->
      <div class="hide-on-print">
        <h2>{{ isEditing ? 'Edit Guest' : 'Add Guest' }}</h2>
        <form @submit.prevent="submitForm" class="guest-form">
          <div class="guest-form-fields">
            <div class="form-group required">
              <label>Name</label>
              <input v-model="form.name" type="text" id="name" />
              <p v-if="errors.name" class="error">{{ errors.name }}</p>
            </div>
            <div class="form-group required">
              <label>Email</label>
              <input v-model="form.email" type="email" />
              <p v-if="errors.email" class="error">{{ errors.email }}</p>
            </div>
            <div class="form-group required">
              <label>Phone</label>
              <input v-model="form.phone" type="tel" />
              <p v-if="errors.phone" class="error">{{ errors.phone }}</p>
            </div>
            <div class="form-group required">
              <label>Address 1</label>
              <input v-model="form.address1" type="text" />
              <p v-if="errors.address1" class="error">{{ errors.address1 }}</p>
            </div>
            <div class="form-group">
              <label>Address 2</label>
              <input v-model="form.address2" type="text" />
            </div>
            <div class="form-group required">
              <label>City</label>
              <input v-model="form.city" type="text" />
              <p v-if="errors.city" class="error">{{ errors.city }}</p>
            </div>
            <div class="form-group required">
              <label>State</label>
              <input v-model="form.state" type="text" />
              <p v-if="errors.state" class="error">{{ errors.state }}</p>
            </div>
            <div class="form-group required">
              <label>Zip</label>
              <input v-model="form.zip" type="text" />
              <p v-if="errors.zip" class="error">{{ errors.zip }}</p>
            </div>
            <div class="form-group">
              <label>Attending</label>
              <select v-model="form.attending">
                <option value="">Choose...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div class="form-group required">
              <label>Guest Of</label>
              <select v-model="form.guestOf">
                <option value="">Select...</option>
                <option value="Bride">Bride</option>
                <option value="Groom">Groom</option>
                <option value="Both">Both</option>
              </select>
              <p v-if="errors.guestOf" class="error">{{ errors.guestOf }}</p>
            </div>
            <div class="form-group">
              <label>Plus One</label>
              <input v-model="form.plusOne" type="text" />
            </div>
            <div class="form-group required">
              <label>Children</label>
              <input v-model.number="form.children" type="number" min="0" max="2" />
              <p v-if="errors.children" class="error">{{ errors.children }}</p>
            </div>
          </div>
          <div class="form-buttons">
            <button type="submit" :disabled="loading">
              {{
                loading
                  ? isEditing
                    ? 'Updating...'
                    : 'Adding...'
                  : isEditing
                    ? 'Update Guest'
                    : 'Add Guest'
              }}
            </button>
            <button v-if="isEditing" type="button" @click="cancelEdit" :disabled="loading">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import QRCode from 'qrcode'
import axios from 'axios'

const router = useRouter()
const username = ref('')
const guests = ref([])
const form = ref({
  name: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  guestOf: '',
  plusOne: '',
  children: 0,
  attending: '',
})
const errors = ref({})
const loading = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const filterAttending = ref('all')
const printingTable = ref(null)

const filteredGuests = computed(() => {
  if (filterAttending.value === 'all') {
    return guests.value
  }
  return guests.value.filter((guest) =>
    filterAttending.value === 'yes' ? guest.attending === 'Yes' : guest.attending === 'No',
  )
})

const formatAddress = (guest) => {
  if (!guest.address1 && !guest.address2) return '-'
  return guest.address2 ? `${guest.address1}, ${guest.address2}` : guest.address1
}

const printTable = () => {
  printingTable.value = 'invites'
  document.body.setAttribute('data-printing-active', 'invites') // Set attribute on body
  setTimeout(() => {
    window.print()
    printingTable.value = null
    document.body.removeAttribute('data-printing-active') // Clean up after printing
  }, 100)
}

const fetchData = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const userResponse = await axios.get(import.meta.env.VITE_API_URL + '/api/admin/user', {
      headers: { Authorization: `Bearer ${token}` },
    })
    username.value = userResponse.data.username // Fixed the division operator typo

    const guestsResponse = await axios.get(import.meta.env.VITE_API_URL + '/api/invites', {
      headers: { Authorization: `Bearer ${token}` },
    })
    guests.value = await Promise.all(
      guestsResponse.data.map(async (guest) => {
        const qrCodeUrl = await generateQRCode(guest.id)
        return { ...guest, qrCodeUrl }
      }),
    )
  } catch (err) {
    console.error('Admin: Error fetching data:', err)
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('token')
      router.push('/login')
    } else {
      alert('Failed to load data. Please try again.')
    }
  }
}

const validateForm = () => {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Name is required.'
  if (!form.value.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.value.email = 'Valid email is required.'
  }
  if (!form.value.phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) {
    errors.value.phone = 'Valid US phone number is required.'
  }
  if (!form.value.address1.trim()) errors.value.address1 = 'Address 1 is required.'
  if (!form.value.city.trim()) errors.value.city = 'City is required.'
  if (!form.value.state.trim()) errors.value.state = 'State is required.'
  if (!form.value.zip.match(/^\d{5}(-\d{4})?$/)) errors.value.zip = 'Valid ZIP code is required.'
  if (!['Bride', 'Groom', 'Both'].includes(form.value.guestOf)) {
    errors.value.guestOf = 'Please select Bride, Groom, or Both.'
  }
  if (
    !Number.isInteger(form.value.children) ||
    form.value.children < 0 ||
    form.value.children > 2
  ) {
    errors.value.children = 'Children must be a number between 0 and 2.'
  }
  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) return
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    let newGuest
    const payload = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      address1: form.value.address1,
      address2: form.value.address2,
      city: form.value.city,
      state: form.value.state,
      zip: form.value.zip,
      guestOf: form.value.guestOf,
      plusOne: form.value.plusOne,
      children: form.value.children,
    }
    if (form.value.attending) {
      payload.attending = form.value.attending
    }
    if (isEditing.value) {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/invites/${editingId.value}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      newGuest = response.data.guest
      newGuest.qrCodeUrl = await generateQRCode(newGuest.id)
      const index = guests.value.findIndex((guest) => guest.id === editingId.value)
      guests.value[index] = newGuest
      alert('Guest updated successfully!')
    } else {
      const response = await axios.post(import.meta.env.VITE_API_URL + '/api/invites', payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      newGuest = response.data.guest
      newGuest.qrCodeUrl = await generateQRCode(newGuest.id)
      guests.value.push(newGuest)
      alert('Guest added successfully!')
    }
    resetForm()
  } catch (err) {
    if (err.response?.status === 400 || err.response?.status === 404) {
      errors.value = { general: err.response.data.error }
      alert(err.response.data.error)
    } else {
      alert(isEditing.value ? 'Failed to update guest.' : 'Failed to add guest.')
    }
    console.error(isEditing.value ? 'Error updating guest:' : 'Error adding guest:', err)
  } finally {
    loading.value = false
  }
}

const editGuest = (guest) => {
  isEditing.value = true
  editingId.value = guest.id
  form.value = {
    name: guest.name,
    email: guest.email,
    phone: guest.phone,
    address1: guest.address1 || '',
    address2: guest.address2 || '',
    city: guest.city || '',
    state: guest.state || '',
    zip: guest.zip || '',
    guestOf: guest.guestOf || '',
    plusOne: guest.plusOne || '',
    children: guest.children || 0,
    attending: guest.attending || '',
  }
  // Scroll to form top with header offset for tablet/desktop (≥768px)
  const header = document.querySelector('.site-header')
  const headerHeight = header ? header.getBoundingClientRect().height : 0
  const formElement = document.querySelector('.guest-form')
  const formTop = formElement ? formElement.getBoundingClientRect().top + window.scrollY : 0
  const isTabletOrDesktop = window.innerWidth >= 768
  const scrollTop = isTabletOrDesktop ? Math.max(formTop - headerHeight, 0) : 0
  nextTick(() => {
    const nameInput = document.getElementById('name')
    if (nameInput) {
      nameInput.focus()
    }
  })
  setTimeout(function () {
    console.log(scrollTop)
    window.scrollTo({ top: scrollTop, behavior: 'smooth' })
  }, 0)
}

const cancelEdit = () => {
  resetForm()
}

const deleteGuest = async (id) => {
  if (!confirm('Are you sure you want to delete this guest?')) return
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/invites/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    guests.value = guests.value.filter((guest) => guest.id !== id)
    alert('Guest deleted successfully!')
  } catch (err) {
    alert('Failed to delete guest.')
    console.error('Error deleting guest:', err)
  } finally {
    loading.value = false
  }
}

const generateQRCode = async (guestId) => {
  try {
    const rsvpUrl = `${import.meta.env.VITE_APP_URL}/rsvp?guestId=${guestId}`
    const qrCodeUrl = await QRCode.toDataURL(rsvpUrl, {
      width: 300,
      margin: 1,
      color: { dark: '#000000', light: '#FFFFFF' },
    })
    return qrCodeUrl
  } catch (err) {
    console.error('Error generating QR code:', err)
    return null
  }
}

const downloadQRCode = (guest) => {
  const link = document.createElement('a')
  link.href = guest.qrCodeUrl
  link.download = `qrcode-${guest.name.replace(/\s+/g, '-')}-${guest.id}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    guestOf: '',
    plusOne: '',
    children: 0,
    attending: '',
  }
  errors.value = {}
  isEditing.value = false
  editingId.value = null
}

const formatDate = (isoString) => {
  if (!isoString) return '-'
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return '-'
  return date
    .toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .replace(',', '')
    .replace(/ AM| PM/, (match) => match.toLowerCase())
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.invites {
  .container {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
  h2 {
    text-align: left;
    font-family: var(--font-primary);
    font-size: 20px;
    display: flex;
    justify-content: space-between;
  }
  .print {
    background: transparent;
    color: var(--vt-c-green);
    font-size: 25px;
    margin-top: 8px;
    min-width: initial;
    &:active,
    &:focus,
    &:hover {
      box-shadow: none;
      color: var(--vt-c-black-mute);
    }
  }
  p {
    margin-top: 0;
  }
  .guest-form {
    width: 100%;
  }
  .guest-form-fields {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 30px;
    row-gap: 10px;
    @media (max-width: 767px) {
      grid-template-columns: 1fr 1fr;
      column-gap: 10px;
    }
    @media (max-width: 400px) {
      grid-template-columns: 1fr;
    }
  }
  .form-buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  .filter-group {
    display: flex;
    justify-content: flex-end;
    max-width: 300px;
    margin-left: auto;
    gap: 10px;
    label[for='attending-filter'] {
      font-size: 14px;
      white-space: nowrap;
    }
    select {
      font-size: 14px;
      padding: 5px 10px;
    }
  }
  .table-wrapper,
  table {
    width: 100%;
  }
  td[data-label='Name'] {
    min-width: 140px;
  }
  td[data-label='Phone'],
  td[data-label='Address'],
  td[data-label='RSVP Date'] {
    white-space: nowrap;
  }
  td[data-label='QR Code'] {
    text-align: center;
  }
  .qr-btn {
    color: blue;
    width: 50px;
    &:hover,
    &:focus,
    &:active {
      color: darkblue;
    }
  }
  .qr-thumbnail {
    width: 50px;
    height: 50px;
    cursor: pointer;
    display: block;
    margin: 0 auto;
    transition: transform 0.2s;
    &:hover {
      transform: scale(1.1);
    }
  }
  .action-btn {
    display: block;
    background: transparent;
    padding: 0;
    margin: 0 auto;
    min-width: auto;
    color: var(--vt-c-green);
    font-size: 1.5em;
    cursor: pointer;
    &:hover,
    &:focus,
    &:active {
      color: var(--vt-c-green-dark);
      box-shadow: none;
    }
    &.delete-btn {
      color: var(--vt-c-red);
      &:hover,
      &:focus,
      &:active {
        color: var(--vt-c-red-dark);
      }
    }
    @media (max-width: 767px) {
      margin: 0;
      text-align: left;
    }
  }
  @media (max-width: 767px) {
    td[data-label='Edit'],
    td[data-label='Delete'] {
      display: inline-block;
      border-bottom: 0;
      font-size: 1em;
      line-height: 1.5;
      padding: 0.25rem 0;
    }
    td[data-label='Delete'] {
      margin-left: 10px;
    }
  }
  @media (min-width: 400px) and (max-width: 767px) {
    .hide-on-tablet {
      display: none;
    }
  }
  @media print {
    .hide-on-print {
      display: none;
    }
  }
}
</style>
