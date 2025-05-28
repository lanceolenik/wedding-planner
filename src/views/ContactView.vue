<script setup>
import ContactForm from '../components/ContactForm.vue'
import ContactCard from '../components/ContactCard.vue' // Import the images

import graceAvatar from '@/assets/grace.jpg'
import michaelAvatar from '@/assets/michael.jpg'
</script>
<template>
  <div class="contact">
    <div class="container">
      <h1 class="hasHr">Contact Us</h1>
      <div class="flex">
        <ContactCard
          name="Grace Olenik"
          email="grace@oleniks.net"
          phone="2082013956"
          :avatar="graceAvatar"
          instagram="https://www.instagram.com/gracie__olenik/"
          facebook="https://www.facebook.com/profile.php?id=61557081781201"
          snapchat="https://snapchat.com/t/1K4pSTPV"
        />
        <ContactCard
          name="Michael Morin"
          email=""
          phone="7604728794"
          :avatar="michaelAvatar"
          instagram="https://www.instagram.com/gracie__olenik/"
          facebook="https://www.facebook.com/profile.php?id=61551019472330"
          snapchat="https://snapchat.com/t/1QXPUb2P"
        />
      </div>
      <ContactForm />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flex {
  display: flex;
  justify-content: center;
  gap: 2vw;
  width: 100%;
  @media (max-width: 767px) {
    flex-direction: column;
  }
}
</style>
