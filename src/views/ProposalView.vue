<template>
  <div class="proposal">
    <div class="container">
      <h1 class="hasHr">The Proposal</h1>
      <div class="shadowed">
        <p>On May 31, 2025, this happened:</p>
        <SlideShow
          design-id="DAGpVEevkdo/En8-UX7G5WW9Z7yPMmbqXQ"
          link-text="Gracie & Michael - The Proposal"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import SlideShow from '@/components/SlideShow.vue'
</script>

<style lang="scss" scoped>
.proposal {
  .container {
    .shadowed {
      width: 100%;
    }
    h2 {
      margin-top: 30px;
    }
  }
}
</style>
