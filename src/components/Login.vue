<template>
  <BaseModal 
  :show="isOpen" @close="isOpen = false"
  @shown="handleSubmit"
  />
  
</template>




<script setup lang="ts">

import { ref } from 'vue'
import BaseModal from './BaseModal.vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router';
const isOpen = ref(true)


const username = ref('');
const password = ref('');
const router = useRouter();




const newValue = ref({})
const user = useUserStore()

const handleSubmit = (payload:object) => { 
  newValue.value = payload
  
  }

//Логин

const login = async () => {
  try {
    
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username: username.value, password: password.value })
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem('token', data.token); 
      router.push({ name: 'home' }); 
      user.isAuthorized= !user.isAuthorized
    } else {
      alert('Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login error');
  }
};


</script>