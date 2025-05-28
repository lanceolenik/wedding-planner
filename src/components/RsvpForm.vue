<template>
  <div v-if="show">
    <!-- Modal rendering -->
    <div v-if="!inline" class="rsvp-modal-overlay">
      <div class="rsvp-modal-content shadowed --notransparency">
        <button v-if="!submitted || confirmationMessage" @click="close" class="rsvp-close-btn">
          ✖
        </button>

        <h2 v-if="!submitted">Wedding RSVP</h2>
        <p v-if="!submitted"><small>* Indicates a required field.</small></p>

        <!-- Thank you message -->
        <div v-if="submitted" class="text-center">
          <h2>Thank you!</h2>
          <p>{{ confirmationMessage }}</p>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="submitForm">
          <div class="required">
            <label>Full Name</label>
            <input v-model="form.name" type="text" ref="nameInput" />
            <p v-if="errors.name" class="error">{{ errors.name }}</p>
          </div>

          <div class="required">
            <label>Email</label>
            <input v-model="form.email" type="email" />
            <p v-if="errors.email" class="error">{{ errors.email }}</p>
          </div>

          <div class="required">
            <label>Phone</label>
            <input v-model="form.phone" type="tel" />
            <p v-if="errors.phone" class="error">{{ errors.phone }}</p>
          </div>

          <div>
            <label>Will you be attending?</label>
            <select v-model="form.attending">
              <option value="">Choose...</option>
              <option value="Yes">Yes, I'm coming</option>
              <option value="No">No, I can't make it</option>
            </select>
            <p v-if="errors.attending" class="error">{{ errors.attending }}</p>
          </div>

          <!-- Show only if attending -->
          <transition name="slide-fade">
            <div v-if="form.attending === 'Yes'">
              <div class="subfield">
                <label>Plus One Name (optional)</label>
                <input v-model="form.plusOne" type="text" />
              </div>
              <div class="subfield">
                <label>Additional Number of People (maximum: 2)</label>
                <input v-model.number="form.children" type="number" min="0" max="2" />
              </div>
            </div>
          </transition>

          <button type="submit" :disabled="!formIsValid || loading">
            {{ loading ? 'Submitting...' : 'Submit RSVP' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Inline rendering -->
    <div v-else class="rsvp-form-content">
      <p v-if="!submitted"><small>* Indicates a required field.</small></p>

      <!-- Thank you message -->
      <div v-if="submitted" class="text-center">
        <h2>Thank you!</h2>
        <p>{{ confirmationMessage }}</p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="submitForm">
        <div class="required">
          <label>Full Name</label>
          <input v-model="form.name" type="text" ref="nameInput" />
          <p v-if="errors.name" class="error">{{ errors.name }}</p>
        </div>

        <div class="required">
          <label>Email</label>
          <input v-model="form.email" type="email" />
          <p v-if="errors.email" class="error">{{ errors.email }}</p>
        </div>

        <div class="required">
          <label>Phone</label>
          <input v-model="form.phone" type="tel" />
          <p v-if="errors.phone" class="error">{{ errors.phone }}</p>
        </div>

        <div>
          <label>Will you be attending?</label>
          <select v-model="form.attending">
            <option value="">Choose...</option>
            <option value="Yes">Yes, I'm coming</option>
            <option value="No">No, I can't make it</option>
          </select>
          <p v-if="errors.attending" class="error">{{ errors.attending }}</p>
        </div>

        <!-- Show only if attending -->
        <transition name="slide-fade">
          <div class="subfield-wrapper" v-if="form.attending === 'Yes'">
            <div class="subfield">
              <label>Plus One Name (optional)</label>
              <input v-model="form.plusOne" type="text" />
            </div>
            <div class="subfield">
              <label>Additional Number of People (maximum: 2)</label>
              <input v-model.number="form.children" type="number" min="0" max="2" />
            </div>
          </div>
        </transition>

        <div class="submit-wrapper">
          <button type="submit" :disabled="!formIsValid || loading">
            {{ loading ? 'Submitting...' : 'Submit RSVP' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  show: { type: Boolean, default: false },
  inline: { type: Boolean, default: false },
  guest: { type: Object, default: null },
})
const emit = defineEmits(['close', 'submitted'])

const form = ref({
  name: '',
  email: '',
  phone: '',
  attending: '',
  plusOne: '',
  children: 0,
  dateTime: '',
})

const errors = ref({})
const loading = ref(false)
const submitted = ref(false)
const confirmationMessage = ref('')
const nameInput = ref(null)

const formIsValid = computed(() => {
  return (
    form.value.name.trim() &&
    form.value.email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
    /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(form.value.phone) &&
    form.value.attending !== ''
  )
})

const validateForm = () => {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Name is required.'
  if (!form.value.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.value.email = 'Valid email is required.'
  }
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  if (!form.value.phone.trim()) {
    errors.value.phone = 'Phone is required.'
  } else if (!phoneRegex.test(form.value.phone)) {
    errors.value.phone = 'Please enter a valid US phone number.'
  }
  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) return
  loading.value = true
  try {
    const payload = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      plusOne: form.value.plusOne,
      children: form.value.children,
      dateTime: form.value.dateTime,
    }
    if (form.value.attending) {
      payload.attending = form.value.attending
    }
    const response = await axios.post(import.meta.env.VITE_API_URL + '/api/rsvp', payload)
    submitted.value = true
    confirmationMessage.value =
      response.data.message === 'RSVP updated successfully!'
        ? 'Your RSVP has been updated! Thank you for letting us know.'
        : 'Your RSVP has been received! Thank you!'
    emit('submitted')
    setTimeout(function () {
      document.body.classList.remove('modal-open')
      emit('close')
    }, 2000)
  } catch (err) {
    alert('Failed to submit RSVP.')
    console.error(err)
  } finally {
    loading.value = false
  }
}

const close = () => emit('close')

// Auto-populate form if guest data is provided
onMounted(() => {
  form.value.dateTime = new Date().toISOString()
  if (props.guest) {
    form.value.name = props.guest.name || ''
    form.value.email = props.guest.email || ''
    form.value.phone = props.guest.phone || ''
    form.value.attending = props.guest.attending || ''
    form.value.plusOne = props.guest.plusOne || ''
    form.value.children = props.guest.children || 0
  }
})

watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) {
      if (!props.inline) {
        document.body.classList.add('modal-open')
      }
      setTimeout(() => nameInput.value?.focus(), 50)
    } else {
      document.body.classList.remove('modal-open')
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  document.body.classList.remove('modal-open')
})
</script>

<style scoped lang="scss">
.rsvp-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 101;
}
.rsvp-modal-content,
.rsvp-form-content {
  position: relative;
  padding: 2rem 5vw;
  border-radius: 1rem;
  width: 100%;
}
.rsvp-modal-content {
  max-width: 640px;
}
.rsvp-form-content {
  max-width: 100%;
  @media (min-width: 768px) {
    form {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      > div {
        width: calc(50% - 10px);
        > div {
        }
      }
      > div.subfield-wrapper,
      > div.submit-wrapper {
        width: 100%;
      }
      > div.subfield-wrapper {
        display: flex;
        gap: 20px;
        > div {
          width: calc(50% - 10px);
        }
      }
    }
  }
}
.rsvp-close-btn {
  position: absolute;
  top: 0;
  right: 0;
  min-width: initial;
  border: none;
  background: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
  &:hover {
    color: #000;
    box-shadow: none;
  }
  @media (prefers-color-scheme: dark) {
    &:hover {
      color: #fff;
    }
  }
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  max-height: 500px;
  opacity: 1;
  transform: translateY(0);
}
</style>
