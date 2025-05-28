<script setup>
import { ref, onMounted } from 'vue'
import RsvpForm from '../components/RsvpForm.vue'

const showForm = ref(false)
const rsvpConfirmed = ref(false)

// Check localStorage on load
onMounted(() => {
  if (localStorage.getItem('rsvpSubmitted') === 'true') {
    rsvpConfirmed.value = true
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
  <div class="home-view">
    <div class="home-wrapper"></div>
    <header class="home-header">
      <h1>Gracie & Michael</h1>
      <h2>She said yes!</h2>
      <p>June 6, 2026 at 2:00 PM | Really Cool Venue</p>
      <div class="rsvp-button-wrapper">
        <button v-if="!rsvpConfirmed" @click="showForm = true" class="rsvp-btn">
          <i class="icon-checkbox"></i> RSVP Now
        </button>
        <div v-else>
          <p><i class="icon-checkmark"></i> You’ve responded – thanks!</p>
          <button @click="clearRSVP">Reset RSVP</button>
        </div>
      </div>
    </header>
    <!-- RSVP Popup -->
    <transition name="fade">
      <RsvpForm
        v-if="showForm"
        :show="showForm"
        @close="showForm = false"
        @submitted="handleRSVP"
      />
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.home-view {
  position: relative;
}
.home-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.home-header {
  position: relative;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  background: url(@/assets/couple3.webp);
  background-position: 45% 45%;
  background-size: cover;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
  @media (max-width: 767px) {
    padding-bottom: 100px;
  }
  h1 {
    position: relative;
    display: inline-block;
    font-size: clamp(38px, 6.5vw, 60px);
    color: var(--vt-c-white-soft);
    width: auto;
    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: -40px;
      width: 30px;
      border-bottom: 2px solid;
    }
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      right: -40px;
      width: 30px;
      border-bottom: 2px solid;
    }
    .landscape & {
      margin-top: unset;
    }
    @media (max-width: 767px) {
      font-weight: 600;
    }
    @media (min-width: 1100px) {
      margin-top: 0;
    }
  }
  h2 {
    display: block;
    font-family: var(--font-primary);
    font-size: clamp(50px, 11vw, 90px);
    color: var(--vt-c-white-soft);
    line-height: 1;
    text-transform: uppercase;
  }
  p {
    margin-top: 30px;
    color: var(--vt-c-white-soft);
    @media (max-width: 767px) {
      font-weight: 600;
    }
    @media (max-width: 400px) or (max-height: 375px) {
      margin-top: 10px;
    }
  }
  .rsvp-button-wrapper {
    margin-bottom: 10vh;
    button {
      background: linear-gradient(#eee, #ddd);
      color: var(--vt-c-black);
      margin: 0;
    }
    @media (min-width: 1100px) {
      margin-bottom: 10vh;
    }
    @media (max-width: 400px) or (max-height: 375px) {
      margin: 0;
    }
  }
}
</style>
