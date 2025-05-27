<template>
  <div class="table-wrapper" data-printing="rsvp">
    <h3>
      RSVPs
      <div>
        <button class="print" @click="printTable">
          <i aria-label="Print" class="icon-local_printshop"></i>
        </button>
        <a class="has-icon" href="/invites"
          ><i class="icon-settings" title="Manage Invites/RSVPs"></i
        ></a>
      </div>
    </h3>
    <table>
      <thead>
        <tr>
          <th
            @click="sortTable('name')"
            class="sortable"
            :class="{
              'sort-active': sortKey === 'name',
              'sort-asc': sortKey === 'name' && sortDirection === 'asc',
              'sort-desc': sortKey === 'name' && sortDirection === 'desc',
            }"
          >
            Name
          </th>
          <th>Email</th>
          <th>Phone</th>
          <th
            @click="sortTable('attending')"
            class="sortable"
            :class="{
              'sort-active': sortKey === 'attending',
              'sort-asc': sortKey === 'attending' && sortDirection === 'asc',
              'sort-desc': sortKey === 'attending' && sortDirection === 'desc',
            }"
          >
            Attending
          </th>
          <th>Plus One</th>
          <th>Children</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rsvp in sortedRsvps" :key="rsvp._id">
          <td data-label="Name">{{ rsvp.name }}</td>
          <td data-label="Email">
            <a v-if="rsvp.email" :href="`mailto:${rsvp.email}`" class="email-link">
              {{ rsvp.email }}
            </a>
          </td>
          <td data-label="Phone">
            <a
              v-if="getPhoneDigits(rsvp.phone)"
              :href="`tel:${getPhoneDigits(rsvp.phone)}`"
              class="phone-link"
            >
              {{ formatPhoneNumber(rsvp.phone) }}
            </a>
            <span v-else>{{ formatPhoneNumber(rsvp.phone) }}</span>
          </td>
          <td
            data-label="Attending?"
            class="rsvp-answer"
            :class="{
              '--green': rsvp.attending && rsvp.attending.toLowerCase() === 'yes',
              '--red': rsvp.attending && rsvp.attending.toLowerCase() === 'no',
            }"
          >
            {{ rsvp.attending }}
          </td>
          <td data-label="Plus 1?">{{ rsvp.plusOne || 'N/A' }}</td>
          <td data-label="Extra Guests">{{ rsvp.children || 0 }}</td>
          <td data-label="Date">{{ formatDate(rsvp.dateTime) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import { formatDate } from '@/utils/formatDate'

// Define props explicitly
const props = defineProps({
  rsvps: {
    type: Array,
    required: true,
  },
  printingTable: {
    type: String,
    default: null,
  },
})

// Debug log immediately after defineProps
/*console.log(
  'RsvpTable: props.rsvps defined:',
  typeof props.rsvps !== 'undefined',
  'value:',
  props.rsvps,
)*/

const emit = defineEmits(['print-table'])

const printTable = () => {
  //console.log('RsvpTable: Emitting print-table with sortedRsvps:', sortedRsvps.value)
  emit('print-table', { type: 'rsvp', sortedData: sortedRsvps.value })
}

const getPhoneDigits = (phone) => {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  return digits.length === 10 ? digits : null
}

// Sorting state
const sortKey = ref('') // Current sort column: '' (none), 'name', 'attending'
const sortDirection = ref('asc') // 'asc' or 'desc'

// Computed property for sorted RSVPs
const sortedRsvps = computed(() => {
  //console.log('RsvpTable: Computing sortedRsvps, props.rsvps:', props.rsvps)
  if (!props.rsvps) {
    console.error('RsvpTable: props.rsvps is undefined')
    return []
  }
  if (!sortKey.value) return [...props.rsvps] // Return original order if no sort

  const sorted = [...props.rsvps].sort((a, b) => {
    let valueA = a[sortKey.value]
    let valueB = b[sortKey.value]

    // Handle null/undefined values
    valueA = valueA || ''
    valueB = valueB || ''

    // Case-insensitive sorting for strings
    if (sortKey.value === 'name' || sortKey.value === 'attending') {
      valueA = valueA.toLowerCase()
      valueB = valueB.toLowerCase()
    }

    // Compare values
    if (valueA < valueB) return sortDirection.value === 'asc' ? -1 : 1
    if (valueA > valueB) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })

  return sorted
})

// Toggle sort column and direction
const sortTable = (key) => {
  if (sortKey.value === key) {
    // Same column: toggle direction
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // New column: set key and default to ascending
    sortKey.value = key
    sortDirection.value = 'asc'
  }
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
th {
  cursor: pointer;
  position: relative;
  padding-right: 20px;
}
th.sortable::after {
  content: '↕';
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
}
th.sort-active {
  font-weight: bold;
}
th.sort-asc::after {
  content: '↑';
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
}
th.sort-desc::after {
  content: '↓';
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
}
td[data-label='Date'] {
  width: 82px;
  @media print {
    width: auto;
  }
}
</style>
