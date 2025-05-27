<template>
  <div class="contact-form shadowed">
    <h2>Contact Us</h2>
    <p><small>* Indicates a required field.</small></p>

    <form @submit.prevent="submitForm">
      <div class="form-group required">
        <label for="name">Name:</label>
        <input
          type="text"
          id="name"
          v-model.trim="form.name"
          @input="validateField('name')"
          required
        />
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>

      <div class="form-group required">
        <label for="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          v-model.trim="form.phone"
          @input="validateField('phone')"
          required
        />
        <p v-if="errors.phone" class="error">{{ errors.phone }}</p>
      </div>

      <div class="form-group required">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          v-model.trim="form.email"
          @input="validateField('email')"
          required
        />
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
      </div>

      <div class="form-group required">
        <label for="message">Message:</label>
        <textarea
          id="message"
          v-model.trim="form.message"
          @input="validateField('message')"
          required
        ></textarea>
        <p v-if="errors.message" class="error">{{ errors.message }}</p>
      </div>

      <tippy
        :content="firstTouched && !formIsValid ? allInvalidReasons.join('\n') : ''"
        placement="bottom"
        theme="translucent"
        interactive
      >
        <div>
          <button
            class="submit-btn"
            type="submit"
            :aria-disabled="!formIsValid || loading"
            :class="{ disabled: !formIsValid || loading }"
            @click="handleClick"
          >
            {{ loading ? 'Sending...' : 'Send' }}
          </button>
        </div>
      </tippy>
    </form>

    <transition name="fade">
      <p v-if="toastMessage" :class="['toast', toastType]">{{ toastMessage }}</p>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'

export default {
  data() {
    return {
      form: {
        name: '',
        phone: '',
        email: '',
        message: '',
      },
      loading: false,
      toastMessage: '',
      toastType: '',
      errors: {},
      firstTouched: false,
    }
  },
  computed: {
    formIsValid() {
      return !this.firstInvalidReason
    },
    firstInvalidReason() {
      const { name, phone, email, message } = this.form
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      if (!name.trim()) return 'Name is required.'
      if (!phone.trim()) return 'Phone is required.'
      if (!phoneRegex.test(phone)) return 'Please enter a valid US phone number.'
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return 'Valid email is required.'
      if (!message.trim() || message.trim().length < 10)
        return 'Message must be at least 10 characters.'
      return ''
    },
    allInvalidReasons() {
      const reasons = []
      const { name, phone, email, message } = this.form
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      if (!name.trim()) reasons.push('Name is required.')
      if (!phone.trim()) reasons.push('Phone is required.')
      else if (!phoneRegex.test(phone)) reasons.push('Invalid US phone number.')
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        reasons.push('Valid email is required.')
      if (!message.trim() || message.trim().length < 10)
        reasons.push('Message must be at least 10 characters.')
      return reasons
    },
  },
  methods: {
    validateField(field) {
      const value = this.form[field]?.trim?.() ?? ''
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      switch (field) {
        case 'name':
          this.errors.name = value ? '' : 'Name is required.'
          break
        case 'phone':
          if (!value) this.errors.phone = 'Phone is required.'
          else if (!phoneRegex.test(value))
            this.errors.phone = 'Please enter a valid US phone number (e.g., 123-456-7890).'
          else this.errors.phone = ''
          break
        case 'email':
          this.errors.email = emailRegex.test(value) ? '' : 'Valid email is required.'
          break
        case 'message':
          this.errors.message = value.length >= 10 ? '' : 'Message must be at least 10 characters.'
          break
      }
    },
    validateForm() {
      this.firstTouched = true
      const errors = {}
      let firstInvalidFieldId = null

      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!this.form.name.trim()) {
        errors.name = 'Name is required.'
        firstInvalidFieldId ||= 'name'
      }

      if (!this.form.phone.trim()) {
        errors.phone = 'Phone is required.'
        firstInvalidFieldId ||= 'phone'
      } else if (!phoneRegex.test(this.form.phone)) {
        errors.phone = 'Please enter a valid US phone number (e.g., 123-456-7890).'
        firstInvalidFieldId ||= 'phone'
      }

      if (!emailRegex.test(this.form.email.trim())) {
        errors.email = 'Valid email is required.'
        firstInvalidFieldId ||= 'email'
      }

      if (this.form.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters.'
        firstInvalidFieldId ||= 'message'
      }

      this.errors = errors

      if (firstInvalidFieldId) {
        this.$nextTick(() => {
          const el = document.getElementById(firstInvalidFieldId)
          if (el?.scrollIntoView) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            el.focus()
          }
        })
      }

      return Object.keys(errors).length === 0
    },
    handleClick() {
      this.firstTouched = true
      const valid = this.validateForm()
      if (valid && !this.loading) {
        this.submitForm()
      }
    },
    async submitForm() {
      if (!this.validateForm()) {
        Object.keys(this.form).forEach(this.validateField)
        return
      }

      this.loading = true
      this.toastMessage = ''
      try {
        const payload = {
          ...this.form,
          phone: formatPhoneNumber(this.form.phone),
        }

        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, payload)
        if (res.status === 200) {
          this.toastMessage = 'Message sent successfully!'
          this.toastType = 'success'
          localStorage.setItem('lastContactSubmission', JSON.stringify(payload))
          this.form = { name: '', phone: '', email: '', message: '' }
          this.errors = {}
        }
      } catch (err) {
        this.toastMessage = 'Failed to send message. Try again.'
        this.toastType = 'error'
      } finally {
        this.loading = false
        setTimeout(() => (this.toastMessage = ''), 3000)
      }
    },
  },
}
</script>

<style scoped>
.contact-form {
  width: 100%;
  margin: 50px auto;
}
</style>
