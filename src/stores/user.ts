import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, User } from '@/types/product';



export const useUserStore = defineStore('user', () => {
  
  const users = ref<User[]>([])
  const message = ref('')
  const isAuthorized = ref(false)
  const currentUser = ref<User | null>(null)
  const favorites = ref<Product[]>([])
  const showLoginModal = ref(false)
  

const showLoginForm = () => {
  showLoginModal.value = true
}


const hideLoginForm = () => {
  showLoginModal.value = false
}

const loadFavorites = () => {
    if (typeof window !== 'undefined' && currentUser.value) {
      const userFavoritesKey = `userFavorites_${currentUser.value.email}`
      const saved = localStorage.getItem(userFavoritesKey)
      if (saved) {
        favorites.value = JSON.parse(saved)
      } else {
        favorites.value = []
      }
    } else {
      favorites.value = []
    }
  }

const saveFavorites = () => {
    if (typeof window !== 'undefined' && currentUser.value) {
      const userFavoritesKey = `userFavorites_${currentUser.value.email}`
      localStorage.setItem(userFavoritesKey, JSON.stringify(favorites.value))
    }
  }

// Добавить в избранное
const addToFavorites = (movie: Product) => {
   if (!currentUser.value) {
      showLoginForm()
      return false
    }

  if (!favorites.value.some(fav => fav.id === movie.id)) {
    favorites.value.push(movie)
    saveFavorites()
    return true
  }
  return false
}

// удалить из избранного
const removeFromFavorites = (movieId: number) => {
  const index = favorites.value.findIndex(fav => fav.id === movieId)
  if (index !== -1) {
    favorites.value.splice(index, 1)
    saveFavorites()
  }
}

// Проверить в избранном
const isInFavorites = (movieId: number): boolean => {
  return favorites.value.some(fav => fav.id === movieId)
}


  const clearFavorites = () => {
    favorites.value = []
  }

  function addUser(email: string, name: string, surname: string, password: string, repeatPassword: string) {
    const newUser: User = {
      email,
      name,
      surname,
      password,
     repeatPassword
    }
    users.value.push(newUser)
    
    // Also save to localStorage for persistence
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    storedUsers.push(newUser)
    localStorage.setItem('registeredUsers', JSON.stringify(storedUsers))
    
    return newUser
  }

  function getUsers(): User[] {
    const storedUsers = localStorage.getItem('registeredUsers')
    if (storedUsers) {
      users.value = JSON.parse(storedUsers)
    }
    return users.value
  }

  function updateSharedValue(newValue: string) {
    message.value = newValue
  }

  function setAuthorization(status: boolean) {
    isAuthorized.value = status
  }

  function setCurrentUser(user: User | null) {
    currentUser.value = user

      if (user) {
     
      loadFavorites()
    } else {
     
      clearFavorites()
    }
  }




  function logout() {
    isAuthorized.value = false
    currentUser.value = null
    message.value = ''
    localStorage.removeItem('currentUser')
    
    // Also call logout endpoint to clear server session
    fetch('https://cinemaguide.skillbox.cc/auth/logout', {
      method: 'POST',
      credentials: 'include'
    }).catch(err => console.error('Logout error:', err))
  }

  // Check if user is authenticated by verifying with server
  async function checkAuthStatus() {
    try {
      const response = await fetch('https://cinemaguide.skillbox.cc/profile', {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const userData = await response.json()
        setCurrentUser(userData)
        setAuthorization(true)
        localStorage.setItem('currentUser', JSON.stringify(userData))
        return true
      } else {
        setAuthorization(false)
        setCurrentUser(null)
        return false
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setAuthorization(false)
      setCurrentUser(null)
      return false
    }
  }

  // Initialize users from localStorage on store creation
  getUsers()

  // Check auth status on store creation
  checkAuthStatus()

  return {
    // State
    users,
    message,
    isAuthorized,
    currentUser,
    showLoginModal,
     favorites,
    // Actions
    addUser,
    getUsers,
    updateSharedValue,
    setAuthorization,
    setCurrentUser,
    logout,
    checkAuthStatus,
     //favorites,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
  showLoginForm,
  hideLoginForm
  }
})