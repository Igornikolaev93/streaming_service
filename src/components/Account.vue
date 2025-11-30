<template>
  <div class="account-page">
    <div v-if="currentUser" class="wrapper">
      <div class="account">Мой аккаунт</div>
      <div class="wrapper__title">
        <div class="wrapper__title_item" :class="{ selected: activeTab === 'favorites' }" @click="activeTab = 'favorites'">
          <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.5 0C17.5376 0 20 2.5 20 6C20 13 12.5 17 10 18.5C7.5 17 0 13 0 6C0 2.5 2.5 0 5.5 0C7.35997 0 9 1 10 2C11 1 12.64 0 14.5 0ZM10.9339 15.6038C11.8155 15.0485 12.61 14.4955 13.3549 13.9029C16.3337 11.533 18 8.9435 18 6C18 3.64076 16.463 2 14.5 2C13.4241 2 12.2593 2.56911 11.4142 3.41421L10 4.82843L8.5858 3.41421C7.74068 2.56911 6.5759 2 5.5 2C3.55906 2 2 3.6565 2 6C2 8.9435 3.66627 11.533 6.64514 13.9029C7.39 14.4955 8.1845 15.0485 9.0661 15.6038C9.3646 15.7919 9.6611 15.9729 10 16.1752C10.3389 15.9729 10.6354 15.7919 10.9339 15.6038Z" fill="white" />
          </svg>
          <span>Избранные фильмы</span>
         <!-- <span class="favorites-count">({{ favorites.length }})</span>-->
        </div>
        <div class="wrapper__title_item" :class="{ selected: activeTab === 'settings' }" @click="activeTab = 'settings'">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.5 3C19.5376 3 22 5.5 22 9C22 16 14.5 20 12 21.5C9.5 20 2 16 2 9C2 5.5 4.5 3 7.5 3C9.35997 3 11 4 12 5C13 4 14.64 3 16.5 3ZM12.9339 18.6038C13.8155 18.0485 14.61 17.4955 15.3549 16.9029C18.3337 14.533 20 11.9435 20 9C20 6.64076 18.463 5 16.5 5C15.4241 5 14.2593 5.56911 13.4142 6.41421L12 7.82843L10.5858 6.41421C9.74068 5.56911 8.5759 5 7.5 5C5.55906 5 4 6.6565 4 9C4 11.9435 5.66627 14.533 8.64514 16.9029C9.39 17.4955 10.1845 18.0485 11.0661 18.6038C11.3646 18.7919 11.6611 18.9729 12 19.1752C12.3389 18.9729 12.6354 18.7919 12.9339 18.6038Z" fill="white" />
          </svg>
          <span>Настройка аккаунта</span>
        </div>
      </div>

      
      <div v-if="activeTab === 'favorites'" class="tab-content">
        <div v-if="favorites.length > 0" class="favorites-grid">
          <div 
            v-for="movie in favorites" 
            :key="movie.id" 
            class="favorite-movie-card"
            @click="goToMovie(movie.id)"
          >
            <div class="movie-poster">
              <img 
                :src="movie.posterUrl" 
                :alt="movie.title"
                @error="handleImageError"
              />
              <!-- Cross button in upper right corner -->
              <button class="remove-cross" @click.stop="removeFromFavorites(movie.id)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
<!---
              <div class="movie-overlay">
                <span class="remove-text">Удалить из избранного</span>
              </div>-->

            </div>
            <!--
            <div class="movie-info">
              <h4 class="movie-title">{{ movie.title || movie.originalTitle }}</h4>
              <div class="movie-details">
                <span class="movie-year">{{ movie.releaseYear }}</span>
                <span class="movie-rating">★ {{ movie.tmdbRating?.toFixed(1) || 'N/A' }}</span>
              </div>
              <div class="movie-genres">
                <span 
                  v-for="genre in movie.genres?.slice(0, 2)" 
                  :key="genre" 
                  class="genre-tag"
                >
                  {{ genre }}
                </span>
              </div>
            </div>
          -->
          </div>
        </div>
        
        <div v-else class="empty-favorites">
          <div class="empty-icon">🎬</div>
          <h3>Нет избранных фильмов</h3>
          <p>Добавляйте фильмы в избранное, нажимая на сердечко</p>
          <button class="browse-movies" @click="goToHome">Найти фильмы</button>
        </div>
      </div>

      
      <div v-if="activeTab === 'settings'" class="tab-content">
        <div class="wrapper__description">
          <div class="wrapper__description_item">
            <div class="user-avatar">
              <span class="avatar">
              {{ userInitials }}</span>
            </div>
            <div class="wrapper__description_info">
              <span class="explain">Имя и Фамилия</span>
              {{ currentUser.name }} {{ currentUser.surname }}
            </div>
          </div>
          <div class="wrapper__description_item">
          <div class="user-avatar">
             <!-- <span class="avatar">-->
                <svg class="male" width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 0C21.5523 0 22 0.44772 22 1V17.0066C22 17.5552 21.5447 18 21.0082 18H2.9918C2.44405 18 2 17.5551 2 17.0066V16H20V4.3L12 11.5L2 2.5V1C2 0.44772 2.44772 0 3 0H21ZM8 12V14H0V12H8ZM5 7V9H0V7H5ZM19.5659 2H4.43414L12 8.8093L19.5659 2Z" fill="white" />
                </svg>
       <!---     </span>-->
            </div>
            <div class="wrapper__description_info">
              <span class="explain">Электронная почта</span>
              {{ currentUser.email }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="isLoading" class="loading">
      Загрузка данных...
    </div>
    
    <div v-else class="error">
      Не удалось загрузить данные пользователя
    </div>
    
    <button class="out" @click="handleLogout" :disabled="isLoading">
      Выйти из аккаунта
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { Genres, Product, User } from '@/types/product';

const userStore = useUserStore()
const router = useRouter()

const currentUser = ref<User | null>(null)
const isLoading = ref(true)
const activeTab = ref('favorites') 

// Список избранных фильмов
const favorites = computed(() => userStore.favorites)

// Удадить из избранного
const removeFromFavorites = (movieId: number) => {
  userStore.removeFromFavorites(movieId)
}

// страница фильма
const goToMovie = (movieId: number) => {
  router.push(`/movie/${movieId}`)
}

// Главная страница
const goToHome = () => {
  router.push('/')
}

//  Отсутствует изображение
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/300x450/2D3748/FFFFFF?text=No+Image'
}

const fetchUserProfile = async () => {
  try {
    isLoading.value = true
    const response = await fetch('https://cinemaguide.skillbox.cc/profile', {
      method: 'GET',
      credentials: 'include'
    })

    if (response.ok) {
      const userData = await response.json()
      currentUser.value = userData
      userStore.setCurrentUser(userData)
      localStorage.setItem('currentUser', JSON.stringify(userData))
    } else {
      userStore.setAuthorization(false)
      router.push('/login')
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    userStore.setAuthorization(false)
    router.push('/login')
  } finally {
    isLoading.value = false
  }
}

const handleLogout = async () => {
  isLoading.value = true
  await userStore.logout()
  router.push('/')
  isLoading.value = false
}

onMounted(() => {
  fetchUserProfile()
})


const userInitials = computed(() => {
  if (!currentUser.value) return ''
  const first = currentUser.value.name?.charAt(0) || ''
  const last = currentUser.value.surname?.charAt(0) || ''
  return (first + last).toUpperCase()
})



</script>

<style scoped>
.wrapper{
    display: flex;
    flex-direction: column;
    color: white;
    height: 100%;
}

.account{
font-family: var(--font-family);
font-weight: 700;
font-size: 48px;
line-height: 117%;
color: #fff;
}

.wrapper__title{
    display: flex;
    gap: 64px;
    margin: 64px 0;
}

.wrapper__title_item{
    display: flex;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 24px;
    line-height: 133%;
    color: #fff;
    align-items: center;
    cursor: pointer;
    padding: 12px 20px;
    border-radius: 12px;
    transition: all 0.3s ease;
    gap: 12px;
}

.wrapper__description_item{
    display: flex;
    align-items: center;
    gap:16px;
    margin-bottom: 40px;
}

.wrapper__description_info{
    display: flex;
    flex-direction: column;
}
.explain{
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 18px;
    line-height: 133%;
    color: #fff;
}

.user-avatar{
  border-radius: 30px;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.5);
  font-family: var(--font-family);
  font-weight: 700;
  font-size: 24px;
  line-height: 133%;
  color: #fff;
}

.avatar{
  display: flex;
  padding: 12px;
}

.male{
  display: flex;
  padding: 18px;
}

.out{
    border-radius: 28px;
    padding: 16px 48px;
    max-width: 100%;
    min-height: 56px;
    background: #67a5eb;
    font-family: var(--font-family);
    font-weight: 700;
    font-size: 18px;
    line-height: 133%;
    color: #fff;
    border: none;
    cursor: pointer;
    transition: background 0.3s ease;
    margin-top: 40px;
}

.out:hover {
    background: #5590d6;
}

.wrapper__title_item:hover {
  background: rgba(255, 255, 255, 0.1);
  
}

.wrapper__title_item.selected {
  /*background: rgba(103, 165, 235, 0.2);
  color: #67a5eb;*/
  color: #fff;
}

.wrapper__title_item.selected:first-child {
  /*background: rgba(255, 64, 129, 0.2);
  color: #ff4081;*/
  color: #fff;
}

.favorites-count {
  font-size: 16px;
  opacity: 0.8;
  margin-left: 4px;
}

.tab-content {
  margin: 20px 0;
  min-height: 400px;
}

/* Favorites Grid */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

.favorite-movie-card {
  background: rgba(45, 47, 48, 0.8);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #393b3c;
  position: relative;
}

.favorite-movie-card:hover {
  transform: translateY(-4px);
  border-color: #67a5eb;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.movie-poster {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.movie-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.favorite-movie-card:hover .movie-poster img {
  transform: scale(1.05);
}

.remove-cross {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
  z-index: 10;
}

.remove-cross:hover {
  background: rgb(0, 0, 0);
  transform: scale(1);
}

.favorite-movie-card:hover .remove-cross {
  opacity: 1;
  transform: scale(1);
}

.movie-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.favorite-movie-card:hover .movie-overlay {
  opacity: 1;
}

.remove-text {
  color: white;
  font-family: var(--font-family);
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  padding: 0 20px;
}

.movie-info {
  padding: 16px;
}

.movie-title {
  font-family: var(--font-family);
  font-weight: 600;
  font-size: 18px;
  line-height: 1.3;
  color: white;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.movie-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #ccc;
}

.movie-rating {
  color: #ffd700;
  font-weight: 600;
}

.movie-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.genre-tag {
  background: rgba(103, 165, 235, 0.2);
  color: #67a5eb;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  border: 1px solid rgba(103, 165, 235, 0.3);
}


.empty-favorites {
  text-align: center;
  padding: 60px 20px;
  color: white;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.7;
}

.empty-favorites h3 {
  color: #67a5eb;
  margin-bottom: 12px;
  font-size: 24px;
}

.empty-favorites p {
  color: #ccc;
  margin-bottom: 30px;
  font-size: 16px;
}

.browse-movies {
  background: #67a5eb;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 28px;
  font-family: var(--font-family);
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.browse-movies:hover {
  background: #5590d6;
}


.wrapper__description_item {
  margin-bottom: 40px;
}

.wrapper__description_info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.explain {
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 18px;
  line-height: 133%;
  color: #ccc;
}

.out:disabled {
  background: #393b3c;
  cursor: not-allowed;
}

.loading, .error {
  text-align: center;
  padding: 60px 20px;
  color: white;
  font-size: 18px;
}

.error {
  color: #ff6b6b;
}

/* Медиа*/
@media (max-width: 768px) {
  .wrapper__title {
    flex-direction: row;
    gap: 16px;
    margin: 20px 0;
  }
  
  .wrapper__title_item {
    font-size: 18px;
    padding: 10px 16px;
  }
  
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .movie-poster {
    height: 250px;
  }
  
  .remove-cross {
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
  }
  
  .empty-favorites {
    padding: 40px 15px;
  }
  
  .empty-icon {
    font-size: 48px;
  }
  
  .empty-favorites h3 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .account{
    font-weight: 700;
    font-size: 24px;
    line-height: 133%;
  }
  .favorites-grid {
    grid-template-columns: 1fr;
  }
  
  .movie-poster {
    height: 200px;
  }
  
  .remove-cross {
    top: 6px;
    right: 6px;
    width: 28px;
    height: 28px;
  }
  
  .remove-text {
    font-size: 14px;
  }
}
</style>