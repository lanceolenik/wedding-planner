<template>
  <div class="table-wrapper" data-printing="contact">
    <h3>
      Contact Messages
      <button class="print" @click="printTable">
        <i aria-label="Print" class="icon-local_printshop"></i>
      </button>
    </h3>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Message</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contact in contacts" :key="contact._id">
          <td data-label="Name">{{ contact.name }}</td>
          <td data-label="Email">
            <a v-if="contact.email" :href="`mailto:${contact.email}`" class="email-link">
              {{ contact.email }}
            </a>
          </td>
          <td data-label="Phone">
            <a
              v-if="getPhoneDigits(contact.phone)"
              :href="`tel:${getPhoneDigits(contact.phone)}`"
              class="phone-link"
            >
              {{ formatPhoneNumber(contact.phone) }}
            </a>
            <span v-else>{{ formatPhoneNumber(contact.phone) }}</span>
          </td>
          <td data-label="Message">
            <span v-if="contact.message">
              <!-- Show full message when printing -->
              <span v-if="printingTable === 'contact'" class="message-content">
                {{ contact.message }}
              </span>
              <!-- Interactive truncated message for UI -->
              <Transition
                v-else
                :name="expandedMessages[contact._id] ? 'slide' : 'slide'"
                @before-enter="beforeEnter"
                @enter="enter"
                @before-leave="beforeLeave"
                @leave="leave"
              >
                <span
                  :key="expandedMessages[contact._id] ? 'expanded' : 'collapsed'"
                  class="message-content"
                >
                  {{
                    expandedMessages[contact._id]
                      ? contact.message
                      : truncateMessage(contact.message)
                  }}
                </span>
              </Transition>
              <i
                v-if="needsTruncation(contact.message) && printingTable !== 'contact'"
                class="toggle-button"
                @click="toggleMessage(contact._id)"
                :class="expandedMessages[contact._id] ? 'icon-file_upload' : 'icon-file_download'"
                :title="expandedMessages[contact._id] ? 'Collapse' : 'Expand'"
              ></i>
            </span>
            <span v-else>N/A</span>
          </td>
          <td data-label="Date">{{ formatDate(contact.date) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import { formatDate } from '@/utils/formatDate'

defineProps({
  contacts: {
    type: Array,
    required: true,
  },
  printingTable: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['print-table'])

const printTable = () => {
  emit('print-table', { type: 'contact' })
}

const getPhoneDigits = (phone) => {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  return digits.length === 10 ? digits : null
}

const expandedMessages = ref({})

const truncateMessage = (message) => {
  if (!message) return ''
  const words = message.trim().split(/\s+/)
  if (words.length <= 20) return message
  return words.slice(0, 20).join(' ') + '...'
}

const needsTruncation = (message) => {
  if (!message) return false
  const words = message.trim().split(/\s+/)
  return words.length > 20
}

const toggleMessage = (id) => {
  expandedMessages.value[id] = !expandedMessages.value[id]
}

const beforeEnter = (el) => {
  el.style.maxHeight = '0'
  el.style.opacity = '0'
}

const enter = (el) => {
  el.style.maxHeight = `${el.scrollHeight}px`
  el.style.opacity = '1'
}

const beforeLeave = (el) => {
  el.style.maxHeight = `${el.scrollHeight}px`
  el.style.opacity = '1'
}

const leave = (el) => {
  el.style.maxHeight = '0'
  el.style.opacity = '0'
}
</script>

<style lang="scss" scoped>
h3 {
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
td[data-label='Name'],
td[data-label='Phone'] {
  white-space: nowrap;
}
td[data-label='Message'] {
  padding-bottom: 5px;
}
td[data-label='Date'] {
  width: 82px;
  @media print {
    width: auto;
  }
}
.message-content {
  display: inline-block;
  overflow: hidden;
}
.toggle-button {
  &:before {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: var(--vt-c-green);
    color: var(--vt-c-white-soft);
    border-radius: 50%;
    padding: 5px;
    width: 25px;
    height: 25px;
    cursor: pointer;
    transition: all 0.2s;
  }
  &:hover:before {
    background-color: var(--vt-c-black-soft);
  }
}
.slide-enter-active,
.slide-leave-active {
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;
}
</style>
