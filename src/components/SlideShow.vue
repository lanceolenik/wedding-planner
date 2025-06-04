<template>
  <div class="slideshow-container">
    <!-- Loading Icon -->
    <i v-if="loading" class="loading-icon icon-loading-flower" title="Loading slideshow..."></i>

    <!-- Iframe -->
    <div class="iframe-wrapper" :class="{ loaded: !loading }">
      <iframe
        loading="lazy"
        :src="embedUrl"
        allowfullscreen="allowfullscreen"
        allow="fullscreen"
        @error="handleIframeError"
      ></iframe>
    </div>
    <!-- <a :href="designLink" target="_blank" rel="noopener" class="design-link">
      {{ linkText || `${designId} Slideshow` }} by Lance Olenik
    </a> -->
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

// Props: designId (required) and optional linkText for custom link text
const props = defineProps({
  designId: {
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

// Compute the Canva embed URL and design link based on the designId
const embedUrl = computed(() => {
  return `https://www.canva.com/design/${props.designId}/watch?embed`
})

const designLink = computed(() => {
  return `https://www.canva.com/design/${props.designId}/watch?utm_content=${props.designId}&utm_campaign=designshare&utm_medium=embeds&utm_source=link`
})

// Handle iframe load with timeout
const handleLoad = () => {
  loadTimeout = setTimeout(() => {
    loading.value = false
  }, 5000) // 5 seconds timeout as a fallback
}

const handleIframeError = () => {
  clearTimeout(loadTimeout)
  loading.value = false // Hide loader on error, though content may not load
  console.error('Iframe failed to load:', embedUrl.value)
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
.iframe-wrapper {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 56.25%;
  padding-bottom: 0;
  background: radial-gradient(#fff, #ccc);
  box-shadow: 0 2px 8px 0 rgba(63, 69, 81, 0.16);
  margin-top: 1.6em;
  margin-bottom: 0.9em;
  overflow: hidden;
  border-radius: 8px;
  will-change: transform;
  transition: all 0.3s ease-in;
  iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border: none;
    padding: 0;
    margin: 0;
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
