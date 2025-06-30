<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

// Reactive state for theme
const isDarkMode = ref(false)

// Toggle theme function
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  updateTheme()
}

// Update theme classes on body
const updateTheme = () => {
  document.body.classList.toggle('dark-mode', isDarkMode.value)
  document.body.classList.toggle('light-mode', !isDarkMode.value)
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

// Sync toggle appearance with isDarkMode
watch(isDarkMode, (newValue) => {
  updateTheme()
})

// Check system preference and saved theme on mount
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  // Set initial value based on saved theme or system preference
  isDarkMode.value = savedTheme
    ? savedTheme === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches
  updateTheme()

  // Add listener for system preference changes (e.g., macOS dark mode toggle)
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handlePreferenceChange = (e) => {
    if (!localStorage.getItem('theme')) {
      isDarkMode.value = e.matches
      updateTheme()
    }
  }
  mediaQuery.addEventListener('change', handlePreferenceChange)

  // Cleanup listener on unmount
  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handlePreferenceChange)
  })
})
</script>

<template>
  <div class="theme-toggle">
    <input
      id="theme-switch"
      type="checkbox"
      class="theme-toggle__input"
      :checked="isDarkMode"
      :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      @click="toggleTheme"
    />
    <label for="theme-switch" class="theme-toggle__label">
      <span class="theme-toggle__icon theme-toggle__icon--sun icon-sun" title="Light Mode"></span>
      <span class="theme-toggle__icon theme-toggle__icon--moon icon-moon" title="Dark Mode"></span>
      <span class="theme-toggle__text">Light</span>
      <span class="theme-toggle__text">Dark</span>
    </label>
  </div>
</template>

<style scoped lang="scss">
.theme-toggle {
  position: absolute;
  right: 0.5rem;
  top: 0.75rem;
  z-index: 101;
}

.theme-toggle__input {
  display: none;
}

.theme-toggle__label {
  display: flex;
  align-items: center;
  width: 60px;
  height: 30px;
  background: var(--vt-c-green-light); /* Yellow for light mode */
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s ease;
  padding: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.theme-toggle__input:checked + .theme-toggle__label {
  background: var(--vt-c-green-dark); /* Dark blue for dark mode */
}

.theme-toggle__icon,
.theme-toggle__text {
  position: absolute;
  transition: transform 0.3s ease;
}
.theme-toggle__text {
  display: none;
}

.theme-toggle__icon--sun,
.theme-toggle__icon--moon {
  font-size: 24px;
  z-index: 1;
}

.theme-toggle__icon--sun {
  left: 3px;
  color: var(--color-link);
}

.theme-toggle__icon--moon {
  right: 3px;
  color: #fff;
  .theme-toggle__input:checked + .theme-toggle__label & {
    color: #2c3e50;
  }
}

.theme-toggle__text {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}

.theme-toggle__text:nth-child(3) {
  /* Light text */
  left: 10px;
}

.theme-toggle__text:nth-child(4) {
  /* Dark text */
  right: 10px;
  color: #ecf0f1;
}

.theme-toggle__label::after {
  content: '';
  position: absolute;
  width: 26px;
  height: 26px;
  background: #fff;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 0;
}

.theme-toggle__input:checked + .theme-toggle__label::after {
  transform: translateX(30px);
}

.theme-toggle__input:checked ~ .theme-toggle__icon--sun,
.theme-toggle__input:checked ~ .theme-toggle__text:nth-child(3) {
  transform: translateX(-50px);
  opacity: 0;
}

.theme-toggle__input:checked ~ .theme-toggle__icon--moon,
.theme-toggle__input:checked ~ .theme-toggle__text:nth-child(4) {
  transform: translateX(50px);
  opacity: 1;
}

.theme-toggle__input:not(:checked) ~ .theme-toggle__icon--moon,
.theme-toggle__input:not(:checked) ~ .theme-toggle__text:nth-child(4) {
  transform: translateX(50px);
  opacity: 0;
}

.theme-toggle__input:not(:checked) ~ .theme-toggle__icon--sun,
.theme-toggle__input:not(:checked) ~ .theme-toggle__text:nth-child(3) {
  transform: translateX(0);
  opacity: 1;
}

@media (max-width: 767px) {
  .theme-toggle {
    position: fixed;
    top: 0;
    right: 0;
  }
}
</style>
