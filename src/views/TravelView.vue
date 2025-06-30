<script setup>
import { ref, onMounted } from 'vue'

const hotels = ref([
  {
    name: 'Hotel 1',
    website: 'website 1',
    rating: 4,
    address: '123 Sesame St.',
  },
  {
    name: 'Hotel 2',
    website: 'website 2',
    rating: 4,
    address: '456 Sesame St.',
  },
])
const parks = ref([
  {
    name: 'Park 1',
    website: 'website 1',
    rating: 4,
    address: '123 Sesame St.',
  },
  {
    name: 'Park 2',
    website: 'website 2',
    rating: 4,
    address: '456 Sesame St.',
  },
])
const museumsZoos = ref([
  {
    name: 'Zoo 1',
    website: 'website 1',
    rating: 4,
    address: '123 Sesame St.',
  },
  {
    name: 'Museum 2',
    website: 'website 2',
    rating: 4,
    address: '456 Sesame St.',
  },
])
const otherEntertainment = ref([
  {
    name: 'Ent 1',
    website: 'website 1',
    rating: 4,
    address: '123 Sesame St.',
  },
  {
    name: 'Ent 2',
    website: 'website 2',
    rating: 4,
    address: '456 Sesame St.',
  },
])
</script>

<template>
  <div class="travel">
    <div class="container">
      <h1 class="hasHr">Travel Information</h1>
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
            <ul>
              <li v-for="hotel in hotels" :key="hotel.name">
                <a :href="hotel.website" target="_blank">
                  {{ hotel.name }} ({{ hotel.rating }}★)
                </a>
                <small>{{ hotel.address }}</small>
              </li>
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
          <ul>
            <li v-for="item in parks" :key="item.name">
              <a :href="item.website" target="_blank"> {{ item.name }} ({{ item.rating }}★) </a>
              <small>{{ item.address }}</small>
            </li>
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
          <ul>
            <li v-for="item in otherEntertainment" :key="item.name">
              <a :href="item.website" target="_blank"> {{ item.name }} ({{ item.rating }}★) </a>
              <small>{{ item.address }}</small>
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
