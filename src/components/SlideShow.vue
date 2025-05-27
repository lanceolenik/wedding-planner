<template>
  <div class="slideshow-container">
    <div
      style="
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 56.25%;
        padding-bottom: 0;
        box-shadow: 0 2px 8px 0 rgba(63, 69, 81, 0.16);
        margin-top: 1.6em;
        margin-bottom: 0.9em;
        overflow: hidden;
        border-radius: 8px;
        will-change: transform;
      "
    >
      <iframe
        loading="lazy"
        style="
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          border: none;
          padding: 0;
          margin: 0;
        "
        :src="embedUrl"
        allowfullscreen="allowfullscreen"
        allow="fullscreen"
      ></iframe>
    </div>
    <!--<a :href="designLink" target="_blank" rel="noopener" class="design-link">
      {{ linkText || `${designId} Slideshow` }} by Lance Olenik
    </a>-->
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

// Compute the Canva embed URL and design link based on the designId
const embedUrl = computed(() => {
  return `https://www.canva.com/design/${props.designId}/watch?embed`
})

const designLink = computed(() => {
  return `https://www.canva.com/design/${props.designId}/watch?utm_content=${props.designId}&utm_campaign=designshare&utm_medium=embeds&utm_source=link`
})
</script>

<style scoped>
.slideshow-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
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
