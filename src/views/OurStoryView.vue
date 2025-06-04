<template>
  <div class="story">
    <div class="container">
      <h1 class="hasHr">Our Story</h1>
      <div class="shadowed">
        <h2>Coming Soon</h2>
        <p>...</p>
        <h2>A Visual Story</h2>
        <SlideShow
          design-id="DAGolM-yMqg/YOBrZOwj5ePlQbDzKyg0Eg"
          link-text="Gracie & Michael - A Visual Story"
        />
        <h2>The Proposal</h2>
        <SlideShow
          design-id="DAGpVEevkdo/37m-gC4p7pXf1BxjbVuUVA"
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
.story {
  .container {
    max-width: 807px;
    text-wrap: pretty;
    .shadowed {
      width: 100%;
    }
    h2 {
      margin-top: 30px;
    }
    a,
    a:link {
      color: rgb(var(--vt-c-green));
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
      color: rgb(var(--vt-c-green-dark));
      text-decoration: underline;
      i:before {
        transform: rotate(0deg);
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
}
</style>
