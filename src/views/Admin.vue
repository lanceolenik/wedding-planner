<template>
  <div class="container">
    <div class="header">
      <h2>Admin Dashboard</h2>
      <button @click="logout" class="logout-button">Logout</button>
    </div>
    <div class="shadowed">
      <h4>
        You are logged in as <span class="username">{{ username || 'n/a' }}</span>
      </h4>
      <RsvpTable :rsvps="rsvps" :printing-table="printingTable" @print-table="printTable" />

      <HelpTable
        :help-entries="helpEntries"
        :printing-table="printingTable"
        @print-table="printTable"
      />

      <ContactTable
        :contacts="contacts"
        :printing-table="printingTable"
        @print-table="printTable"
      />

      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ContactTable from '@/components/ContactTable.vue'
import HelpTable from '@/components/HelpTable.vue'
import RsvpTable from '@/components/RsvpTable.vue'

const router = useRouter()
const contacts = ref([])
const helpEntries = ref([])
const rsvps = ref([])
const originalRsvps = ref([])
const username = ref('')
const error = ref('')
const printingTable = ref(null)

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'

const fetchData = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found')
    }
    const config = { headers: { Authorization: `Bearer ${token}` } }

    const [userRes, contactsRes, helpRes, rsvpsRes] = await Promise.all([
      axios.get(`${apiUrl}/api/admin/user`, config),
      axios.get(`${apiUrl}/api/admin/contacts`, config),
      axios.get(`${apiUrl}/api/admin/help`, config),
      axios.get(`${apiUrl}/api/admin/rsvps`, config),
    ])

    username.value = userRes.data.username || 'n/a'
    contacts.value = contactsRes.data
    helpEntries.value = helpRes.data
    rsvps.value = rsvpsRes.data
    originalRsvps.value = [...rsvpsRes.data]
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to fetch data'
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('token')
      router.push('/login')
    }
  }
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const printTable = (payload) => {
  if (!payload || !payload.type) {
    console.error('Admin: Invalid print-table payload:', payload)
    return
  }
  const { type, sortedData } = payload

  printingTable.value = type

  // Store original RSVPs and apply sorted data for RSVP table
  if (type === 'rsvp' && sortedData) {
    rsvps.value = sortedData
  }

  document.body.setAttribute('data-printing-active', type)
  setTimeout(() => {
    window.print()
    setTimeout(() => {
      printingTable.value = null
      document.body.removeAttribute('data-printing-active')
      // Restore original RSVPs
      if (type === 'rsvp') {
        rsvps.value = [...originalRsvps.value]
      }
    }, 100)
  }, 500)
}

onMounted(fetchData)
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
  @media (max-width: 767px) {
    flex-direction: column-reverse;
  }
}
h4 {
  font-size: 14px;
  text-align: right;
  .username {
    text-transform: capitalize;
  }
}
.logout-button {
  padding: 0.5rem 1rem;
  background: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  @media (max-width: 767px) {
    min-width: auto;
    background: transparent;
    padding: 0;
    color: var(--vt-c-green);
    align-self: flex-end;
    &:hover {
      box-shadow: none;
      color: var(--vt-c-black-mute);
    }
  }
}
.error-message {
  color: #d32f2f;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
}
</style>
