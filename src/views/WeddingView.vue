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

<script>
import { Tippy } from 'vue-tippy'
import 'tippy.js/dist/tippy.css' // Base styles
import 'tippy.js/themes/light.css' // Required for theme="light"

export default {
  name: 'WeddingComponent',
  components: {
    Tippy,
  },
}
</script>

<template>
  <div class="wedding">
    <div class="container">
      <h1 class="hasHr">The Wedding</h1>
      <!-- Hide until ready:<div class="rsvp-button-wrapper">
        <button v-if="!rsvpConfirmed" @click="showForm = true" class="rsvp-btn">
          <i class="icon-checkbox"></i> RSVP Now
        </button>
        <div v-else>
          <p><i class="icon-checkmark"></i> You’ve responded – thanks!</p>
          <button @click="clearRSVP">Reset RSVP</button>
        </div>
        <transition name="fade">
          <RsvpForm
            v-if="showForm"
            :show="showForm"
            @close="showForm = false"
            @submitted="handleRSVP"
          />
        </transition>
      </div>-->
      <div class="where shadowed">
        <h2>Where</h2>
        <tippy content="<i class='icon wedding-icons icon-map'></i> Get directions">
          <a class="map" href="https://maps.app.goo.gl/hxu1y68Ne3FrQBV78" target="_blank">
            <i class="icon wedding-icons icon-location_on" title="The Wedding"></i>
            <span class="address">
              <strong>?</strong><br />
              123 Cool Street<br />Idaho Falls, ID
            </span>
            <small>Get Directions</small>
          </a>
        </tippy>
        <figure>
          <img class="venue" src="@/assets/venue.jpg" alt="Venue" />
        </figure>
      </div>
      <div class="when shadowed">
        <h2>When</h2>
        <tippy content="<i class='icon wedding-icons icon-calendar'></i> Add to calendar">
          <a
            class="date-time"
            href="https://stripo.email/storage/ics/2025/3/ics_gracie-michael-wedding-2025-03-18-183846.ics"
          >
            <i
              class="icon wedding-icons icon-Calendar-Heart-Fill--Streamline-Outlined-Fill-Material-Pro-converted"
              title="The Wedding"
            ></i>
            <span class="grid">
              <strong>Date: </strong><span>?</span> <strong>Start: </strong><span>?</span>
              <strong>End: </strong><span>?</span>
            </span>
            <small>Add to Calendar</small>
          </a>
        </tippy>
        <figure>
          <img class="venue" src="@/assets/when.jpg" alt="Pocket Watch" />
        </figure>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wedding {
  .rsvp-button-wrapper {
    width: 100%;
    margin: 20px 0;
    .rsvp-btn {
      display: block;
      margin: 0 auto;
    }
    .icon-check_box {
      font-size: 1.3em;
      vertical-align: -2px;
    }
    > div > p,
    > div > button {
      display: block;
      text-align: center;
      margin-left: auto;
      margin-right: auto;
    }
  }
  h2 {
    margin-bottom: 8px;
  }
  a,
  a:link {
    text-decoration: none;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    transition: all 0.25s ease-in-out;
    i {
      width: 35px;
      margin-top: 10px;
      font-size: 35px;
    }
    i:before {
      display: inline-block;
      transform: rotate(15deg);
      transition: transform 0.25s ease-in-out;
    }
  }
  a:hover,
  a:active,
  a:hover i {
    text-decoration: underline;
    i:before {
      transform: rotate(0deg);
    }
  }
  .where,
  .when {
    width: calc(50% - 10px);
    @media (max-width: 767px) {
      width: calc(100% - 10px);
    }
  }
  .address,
  .grid {
    width: calc(100% - 45px);
  }
  .grid {
    display: grid;
    grid-template-columns: 70px calc(100% - 70px);
  }
  .venue {
    width: 100%;
    margin-top: 20px;
  }
  figure {
    display: block;
    img {
      object-fit: cover;
      object-position: center 60%;
      aspect-ratio: 1.75/1;
    }
  }
  small {
    display: none;
    width: 100%;
    text-align: center;
    background: rgb(var(--vt-c-white-soft));
    border: 1px solid rgb(var(--vt-c-green-light));
    border-radius: 3px;
    padding: 5px;
    @media (max-width: 767px) {
      display: block;
    }
  }
}
</style>
