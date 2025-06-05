<template>
  <div class="slideshow-container">
    <!-- Loading Icon -->
    <i v-if="loading" class="loading-icon icon-loading-flower" title="Loading slideshow..."></i>

    <!-- Iframe -->
    <div
      class="iframe-wrapper"
      :class="{ loaded: !loading && props.source === 'canva' }"
      v-if="props.source === 'canva'"
    >
      <iframe
        loading="lazy"
        :src="embedUrl"
        allowfullscreen="allowfullscreen"
        allow="fullscreen"
        @error="handleIframeError"
      ></iframe>
    </div>
    <video controls allowfullscreen v-if="props.source === 'local'">
      <source :src="embedUrl" type="video/mp4" />
    </video>
    <!-- <a :href="designLink" target="_blank" rel="noopener" class="design-link">
      {{ linkText || `${srcId} Slideshow` }} by Lance Olenik
    </a> -->
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

// Props: srcId (required) and optional linkText for custom link text
const props = defineProps({
  source: {
    type: String,
    required: true,
  },
  srcId: {
    type: String,
    required: true,
  },
  linkText: {
    type: String,
    default: '',
  },
})

const loading = ref(true)
let loadTimeout = null

// Compute the Canva embed URL and design link based on the srcId
let embedUrl = ''
if (props.source === 'canva') {
  embedUrl = computed(() => {
    return `https://www.canva.com/design/${props.srcId}/watch?embed`
  })
} else if (props.source === 'local') {
  embedUrl = computed(() => {
    return props.srcId
  })
}

// Handle iframe load with timeout
const handleLoad = () => {
  loadTimeout = setTimeout(() => {
    loading.value = false
  }, 5000) // 5 seconds timeout as a fallback
}

const handleIframeError = () => {
  clearTimeout(loadTimeout)
  loading.value = false // Hide loader on error, though content may not load
  console.error('Failed to load:', embedUrl.value)
}

onMounted(() => {
  handleLoad()
})

onUnmounted(() => {
  clearTimeout(loadTimeout)
})
</script>

<style scoped>
.slideshow-container {
  position: relative;
  width: 100%;
  margin: 0 auto;
  text-align: center;
}
video {
  width: 100%;
  height: auto;
}
.iframe-wrapper {
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
  background: radial-gradient(#fff, #ccc);
  box-shadow: 0 2px 8px 0 rgba(63, 69, 81, 0.16);
  border-radius: 8px;
  aspect-ratio: 16/9;
  overflow: hidden;
  iframe {
    width: 100%;
    height: 100%;
    border: none;
    padding: 0;
    margin: 0;
  }
  &.loaded {
    background: transparent;
  }
}
.loading-icon {
  position: absolute;
  top: calc(50% - 12.5px);
  left: calc(50% - 12.5px);
  z-index: 999;
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

.design-link {
  display: block;
  margin-top: 10px;
  color: rgb(var(--vt-c-green));
  text-decoration: none;
  font-size: 0.9em;
  transition: color 0.25s ease-in-out;
}

.design-link:hover {
  color: rgb(var(--vt-c-green-dark));
  text-decoration: underline;
}
</style>
