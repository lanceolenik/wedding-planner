<script setup>
import HelpForm from '../components/HelpForm.vue'
</script>

<template>
  <div class="help">
    <div class="container">
      <h1 class="hasHr">Help Out</h1>
      <div class="flex">
        <div class="help_areas shadowed">
          <h2 class="likeh3">General Areas of Need</h2>
          <ul>
            <li>Ceremony Setup</li>
            <li>Ceremony Tear-down</li>
            <li>Reception Setup</li>
            <li>Reception Tear-down</li>
          </ul>
        </div>
        <div class="pro_areas shadowed">
          <h2 class="likeh3">Professional Areas of Need</h2>
          <ul>
            <li>Photographer</li>
            <li>Cake Decorator</li>
            <li>Florist</li>
          </ul>
        </div>
      </div>
      <!-- Hide until ready:
      <HelpForm />
      -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flex {
  display: flex;
  text-wrap: pretty;
  width: 100%;
  gap: 20px;
  > div {
    width: 50%;
  }
  @media (max-width: 767px) {
    flex-direction: column;
    > div {
      width: 100%;
    }
  }
}
ul {
  margin-bottom: 20px;
}
</style>
