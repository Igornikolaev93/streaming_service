<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, watch, computed, provide, onMounted, onUnmounted, nextTick } from 'vue'
import { useUserStore } from './stores/user'
import type { Genres, Product, User } from '@/types/product';
import BaseModal from './components/BaseModal.vue';

const user = useUserStore()
const router = useRouter()
const currentUser = ref<User | null>(null)
const searchQuery = ref('')
const showSearchDropdown = ref(false)
const allMovies = ref<any[]>([]) 
const filteredMovies = ref<any[]>([]) 
const isLoading = ref(false)
const selectedMovie = ref(null)


const elem= (el:any)=>{
  router.push(`/movie/${el.id}`)

}


onMounted(async () => {
  await user.checkAuthStatus()
  
  getAllMovies()
})


watch(searchQuery, (newValue) => {
  user.updateSharedValue(newValue)
})


let searchTimeout: NodeJS.Timeout | null = null


watch(searchQuery, (newQuery) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    filterMovies(newQuery)
  }, 300) 
})


provide('appModel', {
  value: searchQuery,
  update: (newValue: string) => {
    searchQuery.value = newValue
    user.updateSharedValue(newValue)
  }
})


async function onClick() {
  if (user.isAuthorized) {
    user.logout()
    router.push('/')
  } else {
    router.push('/login')
  }
}


function filterMovies(query: string) {
  if (!query.trim()) {
    
    filteredMovies.value = []
    return
  }
  
  const searchTerm = query.toLowerCase().trim()
  
  filteredMovies.value = allMovies.value.filter(movie => {
    
    const titleMatch = movie.title?.toLowerCase().includes(searchTerm) || 
                      movie.name?.toLowerCase().includes(searchTerm)
    
    
    const genreMatch = movie.genres?.some((genre: string) => 
      genre.toLowerCase().includes(searchTerm)
    )
    
    
    const descriptionMatch = movie.description?.toLowerCase().includes(searchTerm) ||
                           movie.overview?.toLowerCase().includes(searchTerm)
    
    
    const yearMatch = movie.year?.toString().includes(searchTerm) ||
                     movie.releaseYear?.toString().includes(searchTerm)
    
    return titleMatch || genreMatch || descriptionMatch || yearMatch
  }).slice(0, 5) 
}


async function getAllMovies() {
  try {
    isLoading.value = true
    const response = await fetch('https://cinemaguide.skillbox.cc/movie', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })

    if (response.ok) {
      const data = await response.json()
      allMovies.value = data.movies || data.items || data || []
    } else {
      allMovies.value = []
    }
  } catch (error) {
    console.error('Error fetching movies:', error)
    allMovies.value = []
  } finally {
    isLoading.value = false
  }
}

function selectMovie(movie: any) {
  selectedMovie.value = movie
  if (movie.id) {
    router.push(`/movie/${movie.id}`)
    closeSearchDropdown()
  }
}

const showMobileSearch = ref(false)
const showMobileInput = ref(false)

function toggleMobileSearch() {
  if (window.innerWidth <= 768) {
    showMobileInput.value = !showMobileInput.value
    showSearchDropdown.value = showMobileInput.value
    
    if (showMobileInput.value) {
      nextTick(() => {
        const searchInput = document.querySelector('.mobile-search-input') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      })
    }
  } else {
    openSearchDropdown()
  }
}


function openSearchDropdown() {
  showSearchDropdown.value = true
  if (searchQuery.value) {
    filterMovies(searchQuery.value)
  }
}

function closeSearchDropdown() {
  showSearchDropdown.value = false
  if (window.innerWidth <= 768) {
    showMobileInput.value = false
  }
}

function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement
  if (!target.closest('.search-container') && 
      !target.closest('.mobile-search-icon') &&
      !target.closest('.mobile-search-input-container')) {
    closeSearchDropdown()
  }
}


onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSearchDropdown()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>

<template>
  <BaseModal :show="user.showLoginModal" @close="user.hideLoginForm" />
  <div class="header">
    <nav class="list">
      <router-link class="logo links" to="/">
        <img src="./assets/mar.png">
        Маруся</router-link>
      <router-link class="links" to="/">
       <span class="links__title"> Главная </span>
      </router-link>
      <router-link class="links" to="/genres">
        <span class="links__title">Жанры </span>
        <svg class="links__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7 11.5C4.51472 11.5 2.5 9.48528 2.5 7C2.5 4.51472 4.51472 2.5 7 2.5C9.48528 2.5 11.5 4.51472 11.5 7C11.5 9.48528 9.48528 11.5 7 11.5ZM7 21.5C4.51472 21.5 2.5 19.4853 2.5 17C2.5 14.5147 4.51472 12.5 7 12.5C9.48528 12.5 11.5 14.5147 11.5 17C11.5 19.4853 9.48528 21.5 7 21.5ZM17 11.5C14.5147 11.5 12.5 9.48528 12.5 7C12.5 4.51472 14.5147 2.5 17 2.5C19.4853 2.5 21.5 4.51472 21.5 7C21.5 9.48528 19.4853 11.5 17 11.5ZM17 21.5C14.5147 21.5 12.5 19.4853 12.5 17C12.5 14.5147 14.5147 12.5 17 12.5C19.4853 12.5 21.5 14.5147 21.5 17C21.5 19.4853 19.4853 21.5 17 21.5ZM7 9.5C8.38071 9.5 9.5 8.38071 9.5 7C9.5 5.61929 8.38071 4.5 7 4.5C5.61929 4.5 4.5 5.61929 4.5 7C4.5 8.38071 5.61929 9.5 7 9.5ZM7 19.5C8.38071 19.5 9.5 18.3807 9.5 17C9.5 15.6193 8.38071 14.5 7 14.5C5.61929 14.5 4.5 15.6193 4.5 17C4.5 18.3807 5.61929 19.5 7 19.5ZM17 9.5C18.3807 9.5 19.5 8.38071 19.5 7C19.5 5.61929 18.3807 4.5 17 4.5C15.6193 4.5 14.5 5.61929 14.5 7C14.5 8.38071 15.6193 9.5 17 9.5ZM17 19.5C18.3807 19.5 19.5 18.3807 19.5 17C19.5 15.6193 18.3807 14.5 17 14.5C15.6193 14.5 14.5 15.6193 14.5 17C14.5 18.3807 15.6193 19.5 17 19.5Z" fill="white" />
</svg>
      </router-link>
  
    <div class="search-container">
      <div class="search desktop-search">
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.3591 14.6168L20.6418 18.8995L19.2276 20.3137L14.9449 16.031C13.405 17.263 11.4521 18 9.32812 18C4.36013 18 0.328125 13.968 0.328125 9C0.328125 4.032 4.36013 0 9.32812 0C14.2961 0 18.3281 4.032 18.3281 9C18.3281 11.124 17.5911 13.0769 16.3591 14.6168ZM14.3528 13.8748C15.5756 12.6146 16.3281 10.8956 16.3281 9C16.3281 5.1325 13.1956 2 9.32812 2C5.46062 2 2.32812 5.1325 2.32812 9C2.32812 12.8675 5.46062 16 9.32812 16C11.2237 16 12.9427 15.2475 14.2029 14.0247L14.3528 13.8748Z" fill="white" fill-opacity="0.5" />
        </svg>
        <input
          type="text" 
          v-model="searchQuery" 
          placeholder="Поиск"
          @focus="openSearchDropdown"
          @click="openSearchDropdown"
        />
      </div>

      <div class="mobile-search-icon" @click="toggleMobileSearch">
        <svg class="links__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z" fill="white" />
        </svg>
      </div>

      <div v-if="showMobileInput" class="mobile-search-input-container">
        <div class="search mobile-search">
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.3591 14.6168L20.6418 18.8995L19.2276 20.3137L14.9449 16.031C13.405 17.263 11.4521 18 9.32812 18C4.36013 18 0.328125 13.968 0.328125 9C0.328125 4.032 4.36013 0 9.32812 0C14.2961 0 18.3281 4.032 18.3281 9C18.3281 11.124 17.5911 13.0769 16.3591 14.6168ZM14.3528 13.8748C15.5756 12.6146 16.3281 10.8956 16.3281 9C16.3281 5.1325 13.1956 2 9.32812 2C5.46062 2 2.32812 5.1325 2.32812 9C2.32812 12.8675 5.46062 16 9.32812 16C11.2237 16 12.9427 15.2475 14.2029 14.0247L14.3528 13.8748Z" fill="white" fill-opacity="0.5" />
          </svg>
          <input
            class="mobile-search-input"
            type="text" 
            v-model="searchQuery" 
            placeholder="Поиск"
            @focus="openSearchDropdown"
            @click="openSearchDropdown"
          />
        </div>
      </div>
        
      <div v-if="showSearchDropdown" class="search-dropdown">
        <div v-if="isLoading" class="dropdown-loading">
          <div class="loading-spinner"></div>
        </div>

        <div v-else-if="filteredMovies.length > 0" class="dropdown-results">
          <div class="dropdown-movies-list">
            <div
              v-for="movie in filteredMovies"
              :key="movie.id"
              class="dropdown-movie-item"
              @click="selectMovie(movie),elem(movie)"
            >
              <div class="movie-poster-small">
                <img
                  v-if="movie.poster || movie.posterUrl"
                  :src="movie.poster || movie.posterUrl"
                  :alt="movie.title || movie.name"
                  @error="(e) => { e.target.style.display = 'none'; }"
                />
                <div v-else class="no-poster-small">
                  <span>🎬</span>
                </div>
              </div>
              
              <div class="movie-info-small">
                <div class="movie-info-add">
                  <div v-if="movie.rating || movie.tmdbRating" class="movie-rating-small">
                    ★ {{ (movie.rating || movie.tmdbRating)?.toFixed(1) || 'N/A' }}
                  </div>
                  <p v-if="movie.year || movie.releaseYear" class="movie-year-small">
                    {{ movie.year || movie.releaseYear }}
                  </p>
                  <div v-if="movie.genres && movie.genres.length" class="movie-genres-small">
                    <span
                      v-for="genre in movie.genres.slice(0, 2)"
                      :key="genre"
                      class="genre-tag-small"
                    >
                      {{ genre }}
                    </span>
                  </div>
                </div>
                <div class="movie-title-small">{{ movie.title || movie.name }}</div>
              </div>
            </div>
          </div>
    
          <div v-if="searchQuery && searchQuery.length == 0" class="dropdown-more-results">
            <p>Показаны первые 5 результатов</p>
            <p class="refine-search">Уточните запрос для более точного поиска</p>
          </div>
        </div>
             
        <div v-else-if="searchQuery && searchQuery.length > 0 && !isLoading" class="dropdown-no-results">
          <div class="no-results-icon">🔍</div>
          <h4>Фильмы не найдены</h4>
          <p>Попробуйте изменить поисковый запрос</p>
        </div>

        <div v-else class="dropdown-initial-state">
          <div class="search-icon">🎬</div>
          <h4>Найдите ваш фильм</h4>
          <p>Введите название фильма для поиска</p>
        </div>
      </div>
    </div>

      <router-link v-if="user.isAuthorized" class="links" to="/account">
       <span class="links__title"> {{ user.currentUser?.name || 'Мой аккаунт' }}</span>
       <svg class="links__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z" fill="white" />
</svg>
      </router-link>
      <button v-if="!user.isAuthorized" class="auth-button" @click="onClick">
        {{ user.isAuthorized ? 'Выйти' : 'Войти' }}
      </button>
  </nav>
  </div>
  <RouterView />
  <footer class="footer_wrapper">
    <div class="footer__item">
      <svg class="footer__image" width="19" height="11" viewBox="0 0 19 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M18.4865 1.37968C18.6253 0.985106 18.4865 0.698125 17.8719 0.698125H15.8298C15.3144 0.698125 15.0764 0.949207 14.9377 1.21829C14.9377 1.21829 13.8869 3.51408 12.4198 5.00273C11.9439 5.4332 11.7259 5.57669 11.4682 5.57669C11.3293 5.57669 11.1509 5.4332 11.1509 5.03862V1.36173C11.1509 0.895411 10.9923 0.680176 10.5561 0.680176H7.34436C7.02714 0.680176 6.8289 0.895411 6.8289 1.11065C6.8289 1.55907 7.56243 1.66666 7.64174 2.92217V5.64843C7.64174 6.24034 7.52281 6.34793 7.26505 6.34793C6.57115 6.34793 4.88596 4.03419 3.87484 1.39763C3.67655 0.877462 3.47831 0.680176 2.96286 0.680176H0.90093C0.306165 0.680176 0.207031 0.93131 0.207031 1.20034C0.207031 1.68461 0.90093 4.12389 3.43863 7.35236C5.12388 9.55846 7.52281 10.7422 9.68383 10.7422C10.9923 10.7422 11.1509 10.4732 11.1509 10.0248V8.3568C11.1509 7.81868 11.2699 7.72904 11.6862 7.72904C11.9836 7.72904 12.5189 7.87248 13.7283 8.9307C15.1161 10.1862 15.354 10.7602 16.1272 10.7602H18.1693C18.764 10.7602 19.0416 10.4911 18.883 9.97098C18.7046 9.45087 18.0305 8.69757 17.1582 7.80073C16.6823 7.29857 15.9686 6.74256 15.7505 6.47347C15.4531 6.1148 15.5324 5.97131 15.7505 5.64843C15.7307 5.64843 18.2287 2.45585 18.4865 1.37968Z" fill="white" fill-opacity="0.8" />
      </svg>
    </div>
     <div class="footer__item">
      <svg class="footer__image" width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0008 1.04957C14.6617 1.23093 15.1822 1.7653 15.3588 2.4439C15.6798 3.67379 15.6798 6.23997 15.6798 6.23997C15.6798 6.23997 15.6798 8.80606 15.3588 10.036C15.1822 10.7146 14.6617 11.249 14.0008 11.4305C12.8031 11.76 7.99982 11.76 7.99982 11.76C7.99982 11.76 3.1966 11.76 1.99878 11.4305C1.33786 11.249 0.817366 10.7146 0.640726 10.036C0.319824 8.80606 0.319824 6.23997 0.319824 6.23997C0.319824 6.23997 0.319824 3.67379 0.640726 2.4439C0.817366 1.7653 1.33786 1.23093 1.99878 1.04957C3.1966 0.719971 7.99982 0.719971 7.99982 0.719971C7.99982 0.719971 12.8031 0.719971 14.0008 1.04957ZM6.55979 4.0802V8.88021L10.3998 6.4803L6.55979 4.0802Z" fill="white" fill-opacity="0.8" />
      </svg>
    </div>
     <div class="footer__item">
      <img src="./assets/odn.png">
    </div>
     <div class="footer__item">
      <svg class="footer__image" width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.600573 6.85881C2.28392 5.93157 4.163 5.15769 5.91872 4.37985C8.93924 3.10581 11.9718 1.85385 15.0349 0.688292C15.6309 0.489692 16.7017 0.295472 16.8067 1.17867C16.7492 2.42883 16.5127 3.67167 16.3504 4.91451C15.9387 7.64763 15.4627 10.3714 14.9986 13.0955C14.8387 14.0029 13.702 14.4726 12.9747 13.892C11.2268 12.7113 9.46544 11.5421 7.73984 10.3341C7.17458 9.75969 7.69874 8.93487 8.20358 8.52471C9.64322 7.10595 11.17 5.90055 12.5344 4.40847C12.9024 3.51969 11.815 4.26873 11.4563 4.49823C9.48542 5.85639 7.56278 7.29747 5.48486 8.49111C4.42346 9.07539 3.18638 8.57607 2.12546 8.25003C1.17421 7.85619 -0.219723 7.45941 0.600477 6.85887L0.600573 6.85881Z" fill="white" fill-opacity="0.8" />
      </svg>
    </div>
  </footer>
</template>

<style scoped>
.odn{
  display: flex;
  flex-direction: column;
}

.search {
  display: flex;
  align-items: center;
  max-width: 665px;
  width: 100%;
  border-radius: 8px;
  padding: 16px;
  background: #393b3c;
  border: 2px solid transparent;
  font-weight: 400;
  font-size: 18px;
  line-height: 133%;
  color: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
  gap: 12px;
}

.search input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 16px;
  width: 100%;
}

.search input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.mobile-search-icon {
  display: none; 
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: #393b3c;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.mobile-search-input-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  z-index: 1001;
}

.mobile-search {
  margin: 0;
}

.search:focus {
  outline: none;
  border-color: #67a5eb;
  background: #2d2f30;
}

.header {
  backdrop-filter: blur(20px);
  color: white;
  padding: 20px;
}

.links {
  display: flex;
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 24px;
  line-height: 133%;
  color: #fff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.links:hover {
  text-decoration: underline;
  text-decoration-color: #b345a0;
}

.links__icon{
  display: none;
}

.list {
  list-style: none;
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 100%;
  gap: 20px;
  font-size: 18px;
  color: white;
}

.logo {
  display: flex;
  justify-content: space-between;
  max-width: 100%;
  gap: 3px;
  font-weight: bold;
  font-size: 24px;
  color: #fff;
}

.search-container {
  position: relative;
  max-width: 600px;
  width: 100%;
  margin: 0 80px;
}

.auth-button {
  background: transparent;
  border: 2px solid #67a5eb;
  color: #67a5eb;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.auth-button:hover {
  background: #67a5eb;
  color: white;
}


.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #393b3c;
  border-radius: 12px;
  margin-top: 8px;
  border: 1px solid #393b3c;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  max-height: 400px;
  overflow: hidden;
}


/* Адаптив */
@media (max-width: 768px) {
  .list {
    flex-wrap: nowrap;
    gap: 10px;
  }
  
  .links__title{
    display: none;
  }

  .links__icon{
    display: flex;
  }

  .desktop-search {
    display: none;
  }

  .mobile-search-icon {
    display: flex; 
  }

  .search-container {
    margin: 0;
    max-width: none;
    width: auto;
  }

  .search-dropdown {
    position: fixed;
    top: 120px;
    left: 20px;
    right: 20px;
    max-height: 50vh;
  }
}
/**. */
.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #393b3c;
  background: rgba(2, 2, 48, 0.5);
}

.dropdown-header h3 {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.results-count {
  color: #67a5eb;
  font-size: 12px;
  font-weight: 500;
}

.dropdown-close {
  background: none;
  border: none;
  color: #888;
  font-size: 20px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.dropdown-close:hover {
  background: #393b3c;
  color: white;
}

.dropdown-body {
  max-height: 350px;
  overflow-y: auto;
  padding: 0;
}

.dropdown-loading {
  text-align: center;
  padding: 40px 20px;
  color: white;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 2px solid #393b3c;
  border-top: 2px solid #67a5eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dropdown-results {
  padding: 0;
}

.dropdown-movies-list {
  display: flex;
  flex-direction: column;
}

.dropdown-movie-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #393b3c;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 12px;
}

.dropdown-movie-item:hover {
  background: rgba(103, 165, 235, 0.1);
}

.dropdown-movie-item:last-child {
  border-bottom: none;
}

.movie-poster-small {
  width: 40px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.movie-poster-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-poster-small {
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 12px;
}

.movie-info-small {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 8px;
 
}

.movie-info-add{
  display: flex;
  gap:12px;
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 14px;
  line-height: 143%;
  color: rgba(255, 255, 255, 0.7);
  height: 20px;
  align-items: center;

}

.movie-title-small {
  font-family: var(--font-family);
  font-weight: 700;
  font-size: 18px;
  line-height: 133%;
  color: #fff;
}

.movie-year-small {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
 
}

.movie-genres-small {
  display: flex;
  gap: 4px;
}

.genre-tag-small {
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 14px;
  line-height: 143%;
  color: rgba(255, 255, 255, 0.7);
  padding: 1px 4px;
  border-radius: 4px;
  white-space: nowrap;
}

.movie-rating-small {
  border-radius: 16px;
  max-width: 47px;
  min-height: 20px;
  padding: 2px 8px;
  color: #fff;
  background-color: #308e21;
  font-weight: 700;
  font-size: 12px;
  /*line-height: 133%;*/

}

.dropdown-more-results {
  padding: 12px 16px;
  border-top: 1px solid #393b3c;
  background: rgba(57, 59, 60, 0.3);
  text-align: center;
}

.dropdown-more-results p {
  margin: 4px 0;
  font-size: 11px;
  color: #888;
}

.refine-search {
  color: #67a5eb !important;
  font-size: 10px !important;
}


.dropdown-no-results {
  text-align: center;
  padding: 40px 20px;
  color: white;
}

.no-results-icon {
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.7;
}

.dropdown-no-results h4 {
  color: #ff6b6b;
  margin-bottom: 8px;
  font-size: 14px;
}

.dropdown-no-results p {
  color: #888;
  font-size: 12px;
  margin: 0;
}


.dropdown-initial-state {
  text-align: center;
  padding: 40px 20px;
  color: white;
}

.search-icon {
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.7;
}

.dropdown-initial-state h4 {
  color: #67a5eb;
  margin-bottom: 8px;
  font-size: 14px;
}

.dropdown-initial-state p {
  color: #888;
  font-size: 12px;
  margin: 0;
}

/* Скролл */
.dropdown-body::-webkit-scrollbar {
  width: 4px;
}

.dropdown-body::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.dropdown-body::-webkit-scrollbar-thumb {
  background: #67a5eb;
  border-radius: 2px;
}

.dropdown-body::-webkit-scrollbar-thumb:hover {
  background: #5590d6;
}

.footer_wrapper{
  display: flex;
  justify-content: flex-end;
  padding: 42px 0;
  gap:24px;
}

.footer__item{
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  height: 36px;
}

.footer__image{
  padding: 12px;
  fill: rgba(255, 255, 255, 0.8);
}


@media (min-width: 769px) {
  .mobile-search-icon {
    display: none;
  }
  
  .desktop-search {
    display: flex;
  }
  
  .mobile-search-input-container {
    display: none;
  }
}

@media (max-width: 480px) {
  .dropdown-movie-item {
    padding: 10px 12px;
  }
  
  .movie-poster-small {
    width: 35px;
    height: 50px;
  }
  
  .movie-title-small {
    font-size: 13px;
  }
}


</style>