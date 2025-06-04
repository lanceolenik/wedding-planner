<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import RsvpForm from '../components/RsvpForm.vue'

const rsvpConfirmed = ref(false)
const guest = ref(null)
const route = useRoute()

// Fetch guest data if guestId is in URL
onMounted(async () => {
  if (localStorage.getItem('rsvpSubmitted') === 'true') {
    rsvpConfirmed.value = true
  }
  const guestId = route.query.guestId
  if (guestId && !rsvpConfirmed.value) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/invites/${guestId}`)
      guest.value = response.data
    } catch (err) {
      console.error('Failed to fetch guest:', err)
      // Optionally show error to user
      // alert('Invalid or missing guest information.')
    }
  }
})

// Handle RSVP confirmation
const handleRSVP = () => {
  rsvpConfirmed.value = true
  localStorage.setItem('rsvpSubmitted', 'true')
}

// RSVP Again
const clearRSVP = () => {
  rsvpConfirmed.value = false
  localStorage.removeItem('rsvpSubmitted')
}
</script>

<template>
  <div class="auto-rsvp">
    <div class="container shadowed">
      <h1>Respondez s'il vous plait</h1>
      <p v-if="!rsvpConfirmed">
        Thank you for your response. Please indicate if you'll be attending as well as your plus one
        and any children (up to 2).
      </p>
      <div v-if="rsvpConfirmed" class="confirmation">
        <p><i class="icon-checkmark"></i> You’ve responded – thanks!</p>
        <button @click="clearRSVP">Reset RSVP</button>
      </div>
      <RsvpForm v-else :show="true" :inline="true" :guest="guest" @submitted="handleRSVP" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auto-rsvp {
  p {
    text-align: center;
  }
  .confirmation {
    text-align: center;
    margin: 20px 0;
    p {
      font-size: 1.2rem;
      margin-bottom: 10px;
      .icon-checkmark {
        color: var(--vt-c-green);
        font-size: 1.5rem;
        vertical-align: middle;
      }
    }
    button {
      padding: 0.5rem 1rem;
      background: var(--vt-c-green);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;
      &:hover {
        background: var(--vt-c-green-dark);
      }
    }
  }
}
</style>
