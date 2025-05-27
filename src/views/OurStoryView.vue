<template>
  <div class="story">
    <div class="container">
      <h1 class="hasHr">Our Story</h1>
      <div class="shadowed">
        <h2>Some Heading?</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
        <h3>Another Heading?</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
        <h3>Yet Another Heading?</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
        <h2>Gracie & Michael - A Visual Story</h2>
        <SlideShow
          design-id="DAGolM-yMqg/YOBrZOwj5ePlQbDzKyg0Eg"
          link-text="Gracie & Michael - A Visual Story"
        />
        <h2>Gracie & Michael - The Engagement</h2>
        <SlideShow
          design-id="DAGolM-yMqg/YOBrZOwj5ePlQbDzKyg0Eg"
          link-text="Gracie & Michael - A Visual Story"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import SlideShow from '@/components/SlideShow.vue'
</script>

<style lang="scss" scoped>
.container {
  max-width: 807px;
  text-wrap: pretty;
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
</style>
