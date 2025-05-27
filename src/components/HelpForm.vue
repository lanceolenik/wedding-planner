<template>
  <div class="help-form shadowed">
    <h2 class="likeh3">Sign Up to Help</h2>
    <p><small>* Indicates a required field.</small></p>

    <form @submit.prevent="submitForm">
      <div class="required">
        <label for="name">Name</label>
        <input
          type="text"
          id="name"
          v-model.trim="form.name"
          required
          @input="validateField('name')"
        />
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>

      <div class="required">
        <label for="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          v-model.trim="form.phone"
          required
          @input="validateField('phone')"
        />
        <p v-if="errors.phone" class="error">{{ errors.phone }}</p>
      </div>

      <div class="required">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model.trim="form.email"
          required
          @input="validateField('email')"
        />
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
      </div>

      <div class="optional">
        <label>Area for which you'd like to help</label>
        <div class="checkbox-group">
          <div v-for="option in helpOptions" :key="option.value" class="checkbox-item">
            <input
              type="checkbox"
              :id="option.value"
              :value="option.value"
              v-model="form.helpAreas"
              @change="validateField('helpAreas')"
            />
            <label :for="option.value">{{ option.label }}</label>
          </div>
        </div>
        <p v-if="errors.helpAreas" class="error">{{ errors.helpAreas }}</p>
      </div>

      <div class="optional">
        <label>Help professionally</label>
        <div class="radio-group">
          <div v-for="option in proOptions" :key="option.value" class="radio-item">
            <input
              type="radio"
              :id="option.value"
              :value="option.value"
              v-model="form.proAreas"
              @change="validateField('proAreas')"
            />
            <label :for="option.value">{{ option.label }}</label>
          </div>
        </div>
        <p v-if="errors.proAreas" class="error">{{ errors.proAreas }}</p>
      </div>

      <div class="optional">
        <label for="message">Additional details and/or comments</label>
        <textarea
          id="message"
          v-model.trim="form.message"
          @input="validateField('message')"
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
            @mouseenter="firstTouched = true"
          >
            {{ loading ? 'Sending...' : 'Send' }}
          </button>
        </div>
      </tippy>
    </form>

    <transition name="fade">
      <p v-if="toastMessage" :class="toastType" class="toast">{{ toastMessage }}</p>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        helpAreas: [],
        proAreas: [],
        message: '',
      },
      helpOptions: [
        { label: 'Ceremony Setup', value: 'ceremony_setup' },
        { label: 'Ceremony Tear-down', value: 'ceremony_teardown' },
        { label: 'Reception Setup', value: 'reception_setup' },
        { label: 'Reception Tear-Down', value: 'reception_teardown' },
      ],
      proOptions: [
        { label: 'Photography', value: 'photography' },
        { label: 'Cake Decorating', value: 'cake_decorating' },
        { label: 'Floral', value: 'floral' },
      ],
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
      const { name, phone, email, helpAreas, proAreas } = this.form
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      if (!name.trim()) return 'Name is required.'
      if (!phone.trim()) return 'Phone is required.'
      if (!phoneRegex.test(phone)) return 'Please enter a valid US phone number.'
      if (!emailValid) return 'Valid email is required.'
      if (helpAreas.length === 0 && proAreas.length === 0)
        return 'Please select at least one area to help.'
      return ''
    },
    allInvalidReasons() {
      const reasons = []
      const { name, phone, email, helpAreas, proAreas } = this.form
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      if (!name.trim()) reasons.push('Name is required.')
      if (!phone.trim()) reasons.push('Phone is required.')
      else if (!phoneRegex.test(phone)) reasons.push('Invalid US phone number.')
      if (!email.trim() || !emailValid) reasons.push('Valid email is required.')
      if (helpAreas.length === 0 && proAreas.length === 0)
        reasons.push('Please select at least one area to help.')
      return reasons
    },
  },
  methods: {
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

      if (this.form.helpAreas.length === 0 && this.form.proAreas.length === 0) {
        errors.helpAreas = 'Please select at least one area where you would like to help.'
        errors.proAreas = 'Please select at least one area where you would like to help.'
        firstInvalidFieldId ||= 'help-group'
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
            el.focus?.()
          }
        })
      }

      return Object.keys(errors).length === 0
    },
    validateField(field) {
      const val = this.form[field]
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      switch (field) {
        case 'name':
          this.errors.name = val.trim() ? '' : 'Name is required.'
          break
        case 'phone':
          if (!val.trim()) this.errors.phone = 'Phone is required.'
          else if (!phoneRegex.test(val))
            this.errors.phone = 'Please enter a valid US phone number.'
          else this.errors.phone = ''
          break
        case 'email':
          this.errors.email = emailRegex.test(val.trim()) ? '' : 'Valid email is required.'
          break
        case 'message':
          this.errors.message =
            val.trim().length >= 10 ? '' : 'Message must be at least 10 characters.'
          break
        case 'helpAreas':
        case 'proAreas': {
          const helpValid = this.form.helpAreas.length > 0
          const proValid = !!this.form.proAreas
          const valid = helpValid || proValid
          this.errors.helpAreas = valid
            ? ''
            : 'Please select at least one area where you would like to help.'
          this.errors.proAreas = valid
            ? ''
            : 'Please select at least one area where you would like to help.'
          break
        }
      }
    },
    async submitForm() {
      if (!this.validateForm()) {
        // Manually run field-level validation so errors reactively disappear as fields are corrected
        Object.keys(this.form).forEach(this.validateField)
        return
      }
      this.loading = true
      this.toastMessage = ''
      try {
        const response = await axios.post(import.meta.env.VITE_API_URL + '/api/help', this.form)
        if (response.status === 200) {
          this.toastMessage = 'Message sent successfully!'
          this.toastType = 'success'
          localStorage.setItem('lastHelpSubmission', JSON.stringify(this.form))
          this.form = {
            name: '',
            phone: '',
            email: '',
            helpAreas: [],
            proAreas: [],
            message: '',
          }
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

<style lang="scss" scoped>
.help-form {
  width: 100%;
}
</style>
