<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: String,
  email: String,
  phone: String,
  avatar: String,
  instagram: String,
  facebook: String,
  snapchat: String,
})

// Computed property to format the phone number
const formattedPhone = computed(() => {
  if (!props.phone) return ''
  // Remove any non-digit characters
  const digits = props.phone.replace(/\D/g, '')
  // Format as (xxx) xxx-xxxx
  if (digits.length >= 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }
  // Return original if not enough digits
  return props.phone
})
</script>

<template>
  <div class="contact-card shadowed">
    <div class="contact-heading">
      <div class="contact-avatar">
        <img :src="avatar" alt="Contact Avatar" />
      </div>
      <div class="contact-info">
        <h2 class="likeh3">{{ name }}</h2>
        <p v-if="phone">
          <i class="icon-mobile"></i> <a :href="`tel:${phone}`">{{ formattedPhone }}</a>
        </p>
        <p v-if="email">
          <i class="icon-alternate_email"></i> <a :href="`mailto:${email}`">{{ email }}</a>
        </p>
        <ul class="social-links">
          <li>
            <a v-if="instagram" :href="instagram" target="_blank">
              <i class="icon icon-facebook" alt="Facebook"></i>
            </a>
          </li>
          <li>
            <a v-if="facebook" :href="facebook" target="_blank">
              <i class="icon icon-instagram" alt="Instagram"></i>
            </a>
          </li>
          <li>
            <a v-if="snapchat" :href="snapchat" target="_blank">
              <i class="icon icon-snapchat" alt="Snapchat"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contact-card {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 30px;
  flex-grow: 1;
  h2 {
    margin-bottom: 10px;
  }
  p {
    margin: 0;
  }
  a,
  a:link {
    text-decoration: none;
  }
}

.contact-heading {
  display: flex;
  align-self: flex-start;
}

.contact-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 1rem;
}

.social-links {
  padding: 0;
  margin: 20px 0 0 0;
  list-style-type: none;
  display: flex;
  gap: 10px;
  .icon {
    display: block;
    width: 100%;
    height: 100%;
    transition: all 0.4s;
  }
  a {
    text-decoration: none;
    &:hover {
      .icon-facebook {
        color: #1877f2;
      }
      .icon-instagram {
        color: #c13584;
      }
      .icon-snapchat {
        color: #fffc00;
        text-shadow:
          -1px -1px 0 #000,
          1px -1px 0 #000,
          -1px 1px 0 #000,
          1px 1px 0 #000;
      }
    }
  }
}

.social-icon {
  width: 24px;
  height: 24px;
}
.icon:before {
  font-size: 30px;
}
</style>
