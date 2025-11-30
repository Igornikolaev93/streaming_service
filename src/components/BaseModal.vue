<template>
  <teleport to="body">
    <div v-if="show || userStore.showLoginModal" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <slot />
        <div class="modal-content__title">
          <img src="../assets/mar.png">
          Маруся
          <svg width="110" height="24" viewBox="0 0 110 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            
          </svg>
        </div>
        <form @submit.prevent="handleSubmit">
          <input required v-if="!inform" class="login" type="email" id="email" v-model="formData.email" placeholder="Электронная почта">
          <input v-if="isVisible && !inform" required class="login" type="text" id="name" v-model="formData.name" placeholder="Имя">
          <input v-if="isVisible && !inform" required class="login" type="text" id="surname" v-model="formData.surname" placeholder="Фамилия">
          <input v-if="!inform" required class="login" type="password" id="password" v-model="formData.password" placeholder="Пароль">
          <input v-if="isVisible && !inform" required class="login" type="password" id="repeatPassword" v-model="formData.repeatPassword" placeholder="Подтвердите пароль">
          
    
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <div v-if="!isVisible && inform">Регистрация завершена</div>
          <div v-if="!isVisible && inform">Используйте Вашу электронную почту для входа</div>
      
          <button v-if="isVisible" class="enter" type="submit" @click="handleRegistration" :disabled="isLoading">
            {{ isLoading ? 'Регистрация...' : 'Создать аккаунт' }}
          </button>
          <button v-if="!isVisible && !inform" class="enter" type="submit" @click="handleLogin" :disabled="isLoading">
            {{ isLoading ? 'Вход...' : 'Войти' }}
          </button>
          <button v-if="!isVisible && inform" class="enter" type="button" @click="handleLoginAfterRegistration">
            Войти
          </button>
          
          <button v-if="!inform" class="registr" type="button" @click="toggleVisibility" :disabled="isLoading">
            {{ isVisible ? 'У меня есть пароль' : 'Регистрация' }}
          </button>
        </form> 
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['close','shown'])

const userStore = useUserStore()
const router = useRouter()

const formData = ref({
  email: '',
  name: '',
  surname: '',
  password: '',
  repeatPassword: ''
})

const isVisible = ref(false)
const inform = ref(false)
const error = ref<string | null>(null)
const isLoading = ref(false)

function close() { 
  emit('close') 
}

const handleSubmit = () => {
  emit('shown', formData.value)
}

const toggleVisibility = () => {
  isVisible.value = !isVisible.value
  error.value = null
}

const handleRegistration = async () => {
  if (formData.value.password !== formData.value.repeatPassword) {
    error.value = 'Пароли не совпадают'
    return
  }
  
  if (!formData.value.name || !formData.value.surname || !formData.value.email || !formData.value.password) {
    error.value = 'Все поля обязательны для заполнения'
    return
  }
  
  isLoading.value = true
  error.value = null

  try {
    const response = await fetch('https://cinemaguide.skillbox.cc/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.value.name,
        surname: formData.value.surname,
        password: formData.value.password,
        email: formData.value.email
      }),
      credentials: 'include' 
    })

    if (response.ok) {
      
      isVisible.value = false
      inform.value = true
      console.log('Registration successful')
    } else {
      const errorData = await response.json()
      error.value = errorData.message || 'Ошибка регистрации'
    }
  } catch (err) {
    error.value = 'Ошибка подключения к серверу'
    console.error('Registration error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleLogin = async () => {
  if (!formData.value.email || !formData.value.password) {
    error.value = 'Введите email и пароль'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const response = await fetch('https://cinemaguide.skillbox.cc/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: formData.value.email,
        password: formData.value.password
      }),
      credentials: 'include' 
    })

    if (response.ok) {
      const userData = await response.json()
      
     
      userStore.setAuthorization(true)
      userStore.setCurrentUser(userData)
      
      
      localStorage.setItem('currentUser', JSON.stringify(userData))
      
      
      router.push('/account')
      close()
    } else {
      const errorData = await response.json()
      error.value = errorData.message || 'Неверный email или пароль'
    }
  } catch (err) {
    error.value = 'Ошибка подключения к серверу'
    console.error('Login error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleLoginAfterRegistration = () => {
  isVisible.value = false
  inform.value = false
  const email = formData.value.email
  formData.value = {
    email: email,
    name: '',
    surname: '',
    password: '',
    repeatPassword: ''
  }
}


watch(() => props.show, (newVal) => {
  if (!newVal) {
    formData.value = {
      email: '',
      name: '',
      surname: '',
      password: '',
      repeatPassword: ''
    }
    isVisible.value = false
    inform.value = false
    error.value = null
    isLoading.value = false
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: #ffffff; 
  color: #110606; 
  border-radius: 24px;
  padding: 64px 40px;
  width: 420px;
  min-height: 455px;
}

.modal-content__title{
  display: flex;
  max-width: 100%;
  justify-content: center;
  align-items: center;
  gap:10px;

}
form{
  display: flex;
  flex-direction: column;
  max-width: 100%;
  padding: 40px;
   gap: 12px;
}

.login{
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  
  max-width: 340px;
  height: 56px;
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 18px;
  line-height: 133%;
  color: rgba(0, 0, 0, 0.4);
}
.enter{
  border-radius: 28px;
  padding: 16px 48px;
  width: 340px;
  height: 56px;
  background: #67a5eb;
  border-style: none;
  font-family: var(--font-family);
  font-weight: 700;
  font-size: 18px;
  line-height: 133%;
  color: #fff;
}

.registr{
  border-style:none ;
  background-color: #fff;
  font-family: var(--font-family);
  font-weight: 700;
  font-size: 18px;
  line-height: 133%;
  color: #000;
}
</style>