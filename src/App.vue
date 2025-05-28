<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { computed, watch, onMounted, onBeforeUnmount } from 'vue'
import Footer from '@/components/Footer.vue'

// Get the current route
const route = useRoute()

const routeKey = computed(() => {
  return route.path === '/' ? 'home' : route.path.replace(/^\/+/, '')
})

// Watch for route changes and update body class
watch(
  () => route.path,
  (newPath) => {
    // Clean up old route-* classes
    document.body.classList.forEach((className) => {
      if (className.startsWith('route-')) {
        document.body.classList.remove(className)
      }
    })

    // Clean class name
    const cleanedPath = newPath === '/' ? 'home' : newPath.replace(/^\/+/, '')
    const routeClass = `route-${cleanedPath}`

    document.body.classList.add(routeClass)
  },
  { immediate: true },
)

const updateOrientationClass = () => {
  const isPortrait = window.matchMedia('(orientation: portrait)').matches
  document.body.classList.toggle('portrait', isPortrait)
  document.body.classList.toggle('landscape', !isPortrait)
}

onMounted(() => {
  updateOrientationClass()
  window.addEventListener('resize', updateOrientationClass)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateOrientationClass)
})
</script>

<template>
  <div class="wrapper">
    <header class="site-header">
      <nav>
        <RouterLink to="/">
          <i class="icon wedding-icons icon-home-outline" title="Home"></i>
          <span class="nav-label">Home</span>
        </RouterLink>
        <RouterLink to="/story">
          <i
            class="icon wedding-icons icon-Book-Heart--Streamline-Lucide-converted"
            title="Our Story"
          ></i>
          <span class="nav-label">Our Story</span>
        </RouterLink>
        <RouterLink to="/wedding">
          <i
            class="icon wedding-icons icon-Wedding-Couple--Streamline-Ultimate-converted"
            title="The Wedding"
          ></i>
          <span class="nav-label">The Wedding</span>
        </RouterLink>
        <RouterLink to="/help">
          <i class="icon wedding-icons icon-lifebuoy" title="Help Out"></i>
          <span class="nav-label">Help Out</span>
        </RouterLink>
        <RouterLink to="/travel">
          <i class="icon wedding-icons icon-plane" title="Travel Info"></i>
          <span class="nav-label">Travel Info</span>
        </RouterLink>
        <RouterLink to="/contact">
          <i class="icon wedding-icons icon-old-phone" title="Contact Us"></i>
          <span class="nav-label">Contact Us</span>
        </RouterLink>
      </nav>
    </header>
    <main>
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <Footer class="relative" />
  </div>
</template>

<style lang="scss" scoped>
main {
  position: relative;
  z-index: 1;
}
main > * {
  position: relative;
  z-index: 2;
}
.wrapper {
  min-height: 100vh;
  padding: 100px 0 0;
  background: url(@/assets/hydrangea.webp);
  background-attachment: fixed;
  background-position: top left;
  background-size: cover;
  background-color: var(--color-background-blend);
  background-blend-mode: var(--blend-mode);
  color: var(--vt-c-green);
  .route-home & {
    background: transparent !important;
    padding: 0;
  }
  @media (max-width: 767px) {
    padding-top: 0;
  }
}
header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  text-align: center;
  text-transform: uppercase;
  background: var(--color-background);
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.25);
  z-index: 100;
  nav {
    display: flex;
    justify-content: center;
    -webkit-font-smoothing: auto;
    padding: 1rem 0;
    z-index: 3;
  }
  a {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 2rem 1.2rem;
    border-right: 1px solid var(--color-nav);
    text-decoration: none;
    white-space: nowrap;
    inline-size: min-content;
    transition: all 0.25s ease-in-out;
    .nav-label {
      font-size: 9px;
      line-height: 1;
      transition: all 0.25s ease-in-out;
      @media (min-width: 768px) {
        position: absolute;
        background: var(--color-background);
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 2px;
      }
    }
    i {
      font-size: 22px;
    }
    &.router-link-exact-active {
      color: var(--color-nav-active);
    }
    &.router-link-exact-active:hover {
      background-color: transparent;
    }
    &:last-of-type {
      border: 0;
    }
    &:hover {
      .nav-label {
        @media (min-width: 768px) {
          font-size: 12px;
          top: 40px;
          padding: 10px;
          border-bottom-right-radius: 10px;
          border-bottom-left-radius: 10px;
        }
      }
    }
  }
  .modal-open & {
    filter: blur(5px);
  }
  @media (max-width: 767px) {
    position: fixed;
    bottom: 0;
    top: auto;
    opacity: 0.95;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    box-shadow: 2px -2px 10px rgba(0, 0, 0, 0.5);
    nav {
      padding: 0;
      justify-content: space-evenly;
      align-items: flex-end;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      a {
        flex-grow: 1;
        justify-content: center;
        flex-direction: column-reverse;
        gap: 5px;
        padding: 0.5rem 0;
        width: calc(100% / 6);
        .nav-label {
          position: relative;
          top: initial;
          left: initial;
          transform: unset;
          white-space: normal;
        }
        &:hover {
          .nav-label {
            padding: 0;
          }
        }
      }
    }
  }
}
</style>
