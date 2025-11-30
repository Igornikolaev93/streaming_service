import { defineStore } from 'pinia'
import { ref } from 'vue'

// Define interfaces for your form data
export interface UserPreferences {
  newsletter: boolean
  updates: boolean
  marketing: boolean
}

export interface FormData {
  name: string
  email: string
  age: number | null
  preferences: UserPreferences
  subscriptionType: 'basic' | 'premium' | 'enterprise'
}

export const useFormStore = defineStore('form', () => {
  // State with TypeScript types
  const formData = ref<FormData>({
    name: '',
    email: '',
    age: null,
    preferences: {
      newsletter: false,
      updates: false,
      marketing: false
    },
    subscriptionType: 'basic'
  })

  // Actions with proper typing
  const setFormData = (data: Partial<FormData>): void => {
    formData.value = { ...formData.value, ...data }
  }

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]): void => {
    formData.value[field] = value
  }

  const updateNestedField = <K extends keyof UserPreferences>(
    field: K, 
    value: UserPreferences[K]
  ): void => {
    formData.value.preferences[field] = value
  }

  const resetForm = (): void => {
    formData.value = {
      name: '',
      email: '',
      age: null,
      preferences: {
        newsletter: false,
        updates: false,
        marketing: false
      },
      subscriptionType: 'basic'
    }
  }

  // Getters with return types
  const getFormData = (): FormData => formData.value
  
  const isFormValid = (): boolean => {
    return formData.value.name.length > 0 && 
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)
  }

  const getUserName = (): string => formData.value.name

  return {
    formData,
    setFormData,
    updateField,
    updateNestedField,
    resetForm,
    getFormData,
    isFormValid,
    getUserName
  }
})