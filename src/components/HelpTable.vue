<template>
  <div class="table-wrapper" data-printing="help">
    <h3>
      Help Offers
      <button v-if="helpEntries.length" class="print" @click="printTable">
        <i aria-label="Print" class="icon-local_printshop"></i>
      </button>
    </h3>
    <table v-if="helpEntries.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Help Areas</th>
          <th>Pro Areas</th>
          <th>Message</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="help in helpEntries" :key="help._id">
          <td data-label="Name">{{ help.name }}</td>
          <td data-label="Email">
            <a v-if="help.email" :href="`mailto:${help.email}`" class="email-link">
              {{ help.email }}
            </a>
          </td>
          <td data-label="Phone">
            <a
              v-if="getPhoneDigits(help.phone)"
              :href="`tel:${getPhoneDigits(help.phone)}`"
              class="phone-link"
            >
              {{ formatPhoneNumber(help.phone) }}
            </a>
            <span v-else>{{ formatPhoneNumber(help.phone) }}</span>
          </td>
          <td data-label="General">{{ formatAreas(help.helpAreas) }}</td>
          <td data-label="Professional">{{ formatAreas(help.proAreas) }}</td>
          <td data-label="Message">{{ help.message || 'N/A' }}</td>
          <td data-label="Date">{{ formatDate(help.date) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else><em>There are no offers to help.</em></p>
  </div>
</template>

<script setup>
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import { formatDate } from '@/utils/formatDate'

defineProps({
  helpEntries: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['print-table'])

const printTable = () => {
  emit('print-table', { type: 'help' }) // Emit event to Admin.vue
}

const formatAreas = (areas) => {
  if (!areas || !Array.isArray(areas)) return 'N/A'
  return areas
    .map((a) => a.replace(/_/g, ' '))
    .map((a) => a.charAt(0).toUpperCase() + a.slice(1))
    .join(', ')
}

const getPhoneDigits = (phone) => {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  return digits.length === 10 ? digits : null
}
</script>

<style lang="scss" scoped>
h3 {
  font-family: var(--font-primary);
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  + p {
    margin-top: 0;
  }
}
td[data-label='Name'],
td[data-label='Phone'] {
  white-space: nowrap;
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
.table-wrapper[data-printing='help'] {
  display: block;
}
td[data-label='Date'] {
  width: 82px;
  @media print {
    width: auto;
  }
}
</style>
