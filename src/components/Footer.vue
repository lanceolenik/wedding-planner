<!-- src/components/Footer.vue -->
<template>
  <footer class="site-footer">
    <div>
      <span class="copyright"> © {{ new Date().getFullYear() }} | </span>
      <RouterLink to="/admin"
        ><i class="icon-settings"></i> <span class="nav-label">Admin</span></RouterLink
      >
      <span class="loko">
        | <a href="https://lokowebdesign.com/" target="_blank">Loko Web Design</a></span
      >
    </div>
  </footer>
</template>

<style lang="scss">
.site-footer {
  position: relative;
  font-size: 14px;
  padding: 50px 3px 10px;
  text-align: right;
  z-index: 1;
  a {
    text-decoration: none;
    color: inherit;
    &:hover {
      text-decoration: underline;
    }
  }
  .modal-open & {
    filter: blur(5px);
  }
  .route-home & {
    display: none !important;
  }
  @media (max-width: 767px) {
    position: fixed;
    bottom: 120px;
    right: -2px;
    padding: 0;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    .loko {
      display: none;
    }
  }
}
</style>
