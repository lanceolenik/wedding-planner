<template>
  <div class="proposal">
    <div class="container">
      <h1 class="hasHr">The Proposal</h1>
      <div class="shadowed">
        <p>On May 31, 2025, this happened:</p>
        <SlideShow source="local" :src-id="Proposal" link-text="Gracie & Michael - The Proposal" />
      </div>
    </div>
  </div>
</template>

<script setup>
import SlideShow from '@/components/SlideShow.vue'
import Proposal from '@/assets/video/proposal.mp4'
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
