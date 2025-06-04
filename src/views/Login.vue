<template>
  <div class="login-container">
    <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>
    <form @submit.prevent="handleSubmit" class="login-form">
      <div class="form-group">
        <label for="username">Username</label>
        <input id="username" v-model="form.username" type="text" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" v-model="form.password" type="password" required />
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
      <button type="submit" class="submit-button">
        {{ isLogin ? 'Login' : 'Register' }}
      </button>
    </form>
    <!--<p class="toggle-text">
      {{ isLogin ? 'Need an account?' : 'Already have an account?' }}
      <button @click="toggleMode" class="toggle-button">
        {{ isLogin ? 'Register' : 'Login' }}
      </button>
    </p>-->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isLogin = ref(true)
const form = ref({ username: '', password: '' })
const error = ref('')

const isProduction = import.meta.env.MODE === 'production'
const basePath = isProduction ? '/wedding' : ''
const apiPath = isProduction ? '/api' : '/api' // Adjust base API path
const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5001') + basePath + apiPath

const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
  form.value = { username: '', password: '' }
}

const handleSubmit = async () => {
  try {
    const endpoint = isLogin.value ? '/api/login' : '/api/register'
    const response = await axios.post(`${apiUrl}${endpoint}`, form.value)

    if (isLogin.value) {
      localStorage.setItem('token', response.data.token)
      router.push('/admin')
    } else {
      toggleMode()
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'An error occurred'
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: var(--color-background, #fff);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: #333;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: var(--vt-c-green, #42b983);
    outline: none;
  }
}

.error-message {
  color: #d32f2f;
  font-size: 0.85rem;
  text-align: center;
}

.submit-button {
  padding: 0.75rem;
  background: var(--vt-c-green, #42b983);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.toggle-text {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

.toggle-button {
  color: var(--color-nav);
  padding: 0;
  margin: 0;
  min-width: initial;
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  &:hover,
  &:focus,
  &:active {
    box-shadow: none;
    color: var(--color-nav-hover);
  }
}
</style>
