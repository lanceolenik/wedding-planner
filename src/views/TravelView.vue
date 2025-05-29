<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Define range of zip codes
const zipCodes = ['83401', '83402', '83403', '83404', '83405', '83415']
const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'
const hotels = ref([])
const parks = ref([])
const museumsZoos = ref([])
const otherEntertainment = ref([])
const error = ref('')
const isLoading = ref(false)
const hotelsLoading = ref(false)
const parksLoading = ref(false)
const museumsZoosLoading = ref(false)
const otherEntertainmentLoading = ref(false)

// Fallback coordinates for Idaho Falls
const fallbackLocation = { lat: 43.4917, lng: -112.033 }

// Geocode a single zip code to lat/lng
const geocodeZip = async (zip) => {
  try {
    const response = await axios.get(`${apiUrl}/api/google-geocode`, {
      params: { address: zip },
    })
    if (response.data.status !== 'OK' || !response.data.results?.[0]) {
      throw new Error(
        `Geocoding failed for ${zip}: ${response.data.status || 'Unknown'}, error: ${response.data.error_message || 'No error message provided'}`,
      )
    }
    return response.data.results[0].geometry.location
  } catch (err) {
    console.error('Geocoding error for', zip, ':', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      axiosError: err.toJSON?.() || err,
    })
    return null
  }
}

// Fetch hotels/motels for multiple locations
const fetchHotels = async (locations) => {
  hotelsLoading.value = true
  try {
    const cacheKey = `hotels_${zipCodes.join('-')}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      hotels.value = JSON.parse(cached)
      return
    }
    const allHotels = []
    for (const location of locations) {
      if (location) {
        const response = await axios.get(`${apiUrl}/api/google-places/nearbysearch/json`, {
          params: {
            location: `${location.lat},${location.lng}`,
            radius: 20000,
            type: 'lodging',
          },
        })
        if (response.data.status !== 'OK') {
          throw new Error(
            `Hotel fetch failed: ${response.data.status}, error: ${response.data.error_message || 'Unknown'}`,
          )
        }
        allHotels.push(...(response.data.results || []))
      }
    }
    const uniqueHotels = Array.from(
      new Map(allHotels.map((item) => [item.place_id, item])).values(),
    )
    hotels.value = uniqueHotels
      .filter((place) => place.rating >= 3.5)
      .slice(0, 5)
      .map((place) => ({
        name: place.name,
        address: place.vicinity,
        rating: place.rating,
        website:
          place.website ||
          `https://www.google.com/search?q=${encodeURIComponent(place.name + ' Idaho Falls')}`,
      }))
    localStorage.setItem(cacheKey, JSON.stringify(hotels.value))
  } catch (err) {
    console.error('Hotels fetch error:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      axiosError: err.toJSON?.() || err,
    })
    error.value = 'Failed to load accommodations. Please try again later.'
  } finally {
    hotelsLoading.value = false
  }
}

// Fetch entertainment options for multiple locations
const fetchEntertainment = async (locations) => {
  parksLoading.value = true
  museumsZoosLoading.value = true
  otherEntertainmentLoading.value = true
  try {
    const cacheKey = `entertainment_${zipCodes.join('-')}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const { parks, museumsZoos, otherEntertainment } = JSON.parse(cached)
      parks.value = parks
      museumsZoos.value = museumsZoos
      otherEntertainment.value = otherEntertainment
      return
    }

    const parkTypes = ['park']
    const museumZooTypes = ['museum', 'zoo']
    const otherTypes = ['theater', 'bowling_alley']

    const filterPlaces = (place) => {
      const excludedTypes = [
        'bar',
        'night_club',
        'casino',
        'lodging',
        'political',
        'store',
        'laundry',
        'airport',
        'veterinary_care',
      ]
      return !place.types.some((type) => excludedTypes.includes(type)) && place.rating >= 3.5
    }

    const fetchCategory = async (typeArray, categoryArray) => {
      const allResults = []
      for (const location of locations) {
        if (location) {
          for (const type of typeArray) {
            const response = await axios.get(`${apiUrl}/api/google-places/nearbysearch/json`, {
              params: {
                location: `${location.lat},${location.lng}`,
                radius: 20000,
                type,
              },
            })
            if (response.data.status !== 'OK') {
              console.warn(
                `${type} fetch warning: ${response.data.status}, error: ${response.data.error_message || 'Unknown'}`,
              )
              continue // Skip invalid responses instead of throwing
            }
            allResults.push(...(response.data.results || []).filter(filterPlaces))
          }
        }
      }
      const uniqueResults = Array.from(
        new Map(allResults.map((item) => [item.place_id, item])).values(),
      )
      return uniqueResults.slice(0, 3).map((place) => ({
        name: place.name,
        address: place.vicinity,
        rating: place.rating,
        website:
          place.website ||
          `https://www.google.com/search?q=${encodeURIComponent(place.name + ' Idaho Falls')}`,
      }))
    }

    parks.value = await fetchCategory(parkTypes, parks.value)
    museumsZoos.value = await fetchCategory(museumZooTypes, museumsZoos.value)
    otherEntertainment.value = await fetchCategory(otherTypes, otherEntertainment.value)

    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        parks: parks.value,
        museumsZoos: museumsZoos.value,
        otherEntertainment: otherEntertainment.value,
      }),
    )
  } catch (err) {
    console.error('Entertainment fetch error:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      axiosError: err.toJSON?.() || err,
    })
    error.value = 'Failed to load entertainment options. Please try again later.'
  } finally {
    parksLoading.value = false
    museumsZoosLoading.value = false
    otherEntertainmentLoading.value = false
  }
}

// Initialize data fetching
onMounted(async () => {
  isLoading.value = true
  const locations = await Promise.all(zipCodes.map((zip) => geocodeZip(zip)))
  const validLocations = locations.filter((loc) => loc !== null)
  if (validLocations.length === 0) {
    validLocations.push(fallbackLocation)
  }
  await Promise.all([fetchHotels(validLocations), fetchEntertainment(validLocations)])
  isLoading.value = false
})
</script>

<template>
  <div class="travel">
    <div class="container">
      <h1 class="hasHr">Travel Information</h1>
      <p v-if="isLoading" class="loading">
        <i
          v-if="isLoading"
          class="loading-icon icon-loading-flower"
          title="Loading travel info..."
        ></i>
        Loading travel information...
      </p>
      <p class="center">
        Note: Much of the information here is auto-generated. We do not necessarily endorse any of
        these establishments.
      </p>
      <p v-if="error && !isLoading" class="error">{{ error }}</p>
      <div class="flex">
        <div class="type shadowed">
          <h2>Airports</h2>
          <p>
            The nearest airport is Idaho Falls (IDA). Salt Lake City (SLC) or Boise (BOI) may be
            cheaper to fly into, but SLC is about a 3 hour drive and BOI is about 4 hours.
          </p>
          <i class="circle icon-plane"></i>
        </div>
        <div class="type shadowed">
          <h2>Lodging</h2>
          <div>
            <p>These accommodations are near the wedding venue:</p>
            <h3>Hotels/Motels</h3>
            <i
              v-if="hotelsLoading"
              class="loading-icon icon-loading-flower"
              title="Loading hotels/motels..."
            ></i>
            <ul>
              <li v-for="hotel in hotels" :key="hotel.name">
                <a :href="hotel.website" target="_blank">
                  {{ hotel.name }} ({{ hotel.rating }}★)
                </a>
                <small>{{ hotel.address }}</small>
              </li>
              <li v-if="hotels.length === 0 && !isLoading">No hotels found.</li>
            </ul>
            <h3>Short-term rentals</h3>
            <p>Please check out these websites to search for short-term rentals:</p>
            <ul class="shortterm">
              <li>
                <a
                  class="hasicon"
                  href="https://www.vrbo.com/search?destination=Idaho%20Falls%2C%20ID%2083402%2C%20USA&flexibility=0_DAY&d1=&startDate=&d2=&endDate=&adults=2&sort=RECOMMENDED&isInvalidatedDate=false&upsellingNumNightsAdded=&theme=&userIntent=&semdtl=&upsellingDiscountTypeAdded="
                  target="_blank"
                  ><i class="logo icon-vrbo" title="VRBO"></i
                ></a>
              </li>
              <li>
                <a
                  class="hasicon"
                  href="https://www.airbnb.com/s/Idaho-Falls--ID-83402/homes?refinement_paths%5B%5D=%2Fhomes&place_id=ChIJcwlJ3x9DVFMRUQ1IrWoKjf8&location_bb=Qi6mMsLgDGBCLZUewuDRZw%3D%3D&acp_id=31e795a4-bcc2-4e08-9a05-3d5ec39fce78&date_picker_type=flexible_dates&flexible_trip_lengths%5B%5D=weekend_trip&source=structured_search_input_header&search_type=autocomplete_click"
                  target="_blank"
                  ><i class="logo icon-airbnb" title="Airbnb"></i
                ></a>
              </li>
              <li>
                <a
                  class="hasicon"
                  href="https://www.cozycozy.com/us/search/83402%2C%20Idaho%20Falls%2C%20ID%2C%20United%20States/2025-06-13/2025-06-15/1-2-0/results"
                  target="_blank"
                  ><i class="logo icon-cozycozy" title="CozyCozy.com"></i
                ></a>
              </li>
            </ul>
          </div>
          <i class="circle icon-Bed-Single--Streamline-Ultimate-converted"></i>
        </div>
        <div class="type shadowed">
          <h2>Entertainment</h2>
          <p>Family-friendly activities near the wedding venue:</p>

          <h3>Parks</h3>
          <i
            v-if="parksLoading"
            class="loading-icon icon-loading-flower"
            title="Loading parks..."
          ></i>
          <ul>
            <li v-for="item in parks" :key="item.name">
              <a :href="item.website" target="_blank"> {{ item.name }} ({{ item.rating }}★) </a>
              <small>{{ item.address }}</small>
            </li>
            <li v-if="parks.length === 0 && !isLoading">No parks found.</li>
          </ul>

          <h3>Museums & Zoos</h3>
          <i
            v-if="museumsZoosLoading"
            class="loading-icon icon-loading-flower"
            title="Loading museums/zoos..."
          ></i>
          <ul>
            <li v-for="item in museumsZoos" :key="item.name">
              <a :href="item.website" target="_blank"> {{ item.name }} ({{ item.rating }}★) </a>
              <small>{{ item.address }}</small>
            </li>
            <li v-if="museumsZoos.length === 0 && !isLoading">No museums or zoos found.</li>
          </ul>

          <h3>Other Entertainment</h3>
          <i
            v-if="otherEntertainmentLoading"
            class="loading-icon icon-loading-flower"
            title="Loading entertainment..."
          ></i>
          <ul>
            <li v-for="item in otherEntertainment" :key="item.name">
              <a :href="item.website" target="_blank"> {{ item.name }} ({{ item.rating }}★) </a>
              <small>{{ item.address }}</small>
            </li>
            <li v-if="otherEntertainment.length === 0 && !isLoading">
              No other entertainment options found.
            </li>
          </ul>
          <h3>More</h3>
          <p>The City of Idaho Falls has their own list of upcoming events and attractions:</p>
          <ul>
            <li>
              <a href="https://www.idahofallsidaho.gov/491/Events-Attractions" target="_blank"
                >City Events & Attractions</a
              >
            </li>
          </ul>
          <i class="circle icon-Sport-Bowling--Streamline-Nova-converted"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.travel {
  .container {
    max-width: 1064px;
    margin: 0 auto;
    h1 {
      position: relative;
      margin-bottom: 30px;
    }
    h3 {
      line-height: 1;
    }
    .error {
      color: red;
      margin-bottom: 20px;
    }
    .loading {
      color: var(--color-text);
      font-style: italic;
      margin-bottom: 20px;
    }
    .loading-icon {
      display: inline-block;
      animation: spin 2s linear infinite;
      font-size: 1.5rem;
      width: 25px;
      color: var(--color-text);
      margin-bottom: 10px;
    }
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    a,
    a:link {
      text-decoration: none;
      padding-right: 30px;
      transition: all 0.25s ease-in-out;
      &.hasicon {
        &:after {
          content: '';
        }
        &:hover {
          text-decoration: none;
        }
      }
    }
    a:hover,
    a:active {
      text-decoration: underline;
    }
    ul {
      margin: 0 0 0 23px;
      padding: 0;
      &.shortterm {
        list-style-type: none;
        margin-left: 0;
        li {
          margin: 0;
        }
      }
      li {
        margin-bottom: 10px;
        small {
          display: block;
          color: var(--vt-c-text-light-2);
          font-size: 0.9rem;
        }
      }
    }
    .flex {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      @media (max-width: 767px) {
        flex-direction: column;
      }
    }
    @container icons (max-width: 3000px) {
      .circle:before {
        font-size: min(100cqh, 50cqw);
      }
    }
    .type {
      position: relative;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      text-wrap: pretty;
      margin: 0;
      padding: 30px;
      width: calc(50% - 20px);
      overflow: hidden;
      z-index: 1;
      &:first-child {
        width: 100%;
      }
      .circle {
        position: absolute;
        container: icons / size;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        &:before {
          position: absolute;
          bottom: 0;
          right: 0;
          line-height: 1;
          color: var(--color-green-opaque);
        }
      }
      .logo {
        font-size: 35px;
        line-height: 1.5;
        transition: all 0.25s ease-in-out;
        &.icon-airbnb {
          color: #ff5a5f;
        }
        &.icon-vrbo {
          color: #0e214b;
          @media (prefers-color-scheme: dark) {
            color: #76c5f7;
          }
        }
        &.icon-cozycozy {
          color: hsl(322.64, 43.44%, 52.16%);
        }
      }
      small {
        font-size: 10px;
        letter-spacing: 0;
      }
      @media (max-width: 767px) {
        flex-direction: column;
        width: 100%;
      }
    }
  }
}
</style>
