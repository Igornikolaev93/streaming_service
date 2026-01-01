<template>
    <div class="movie__info" v-if="product">
    <div class="movie_info_description">
        <div class="movie__info__head">
            <span class="raiting" :class="ratingClass">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.00105 12.1734L3.29875 14.8055L4.34897 9.51997L0.392578 5.86124L5.74394 5.22675L8.00105 0.333374L10.2581 5.22675L15.6095 5.86124L11.6531 9.51997L12.7033 14.8055L8.00105 12.1734Z" fill="white" />
</svg>
                {{ product.tmdbRating }}</span>
            <span>{{ product.releaseYear }}</span>
            <span>{{ product.genres[0] }}</span>
            <span>{{ product.runtime }} мин</span>
        </div>
        <div class="movie__info_name">{{ product.originalTitle }}</div>
        <div class="movie__info_plot">{{ product.plot }}</div>
        <div class="movie__info_button">
            <button class="trailer" @click="watchTrailer">Трейлер</button>
            <button class="like" @click="toggleFavorite" :class="{ 'liked': isFavorite }">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path v-if="isFavorite" d="M16.5 3C19.5376 3 22 5.5 22 9C22 16 14.5 20 12 21.5C9.5 20 2 16 2 9C2 5.5 4.5 3 7.5 3C9.35997 3 11 4 12 5C13 4 14.64 3 16.5 3Z" fill="#ff4081" />
                <path v-else d="M16.5 3C19.5376 3 22 5.5 22 9C22 16 14.5 20 12 21.5C9.5 20 2 16 2 9C2 5.5 4.5 3 7.5 3C9.35997 3 11 4 12 5C13 4 14.64 3 16.5 3ZM12.9339 18.6038C13.8155 18.0485 14.61 17.4955 15.3549 16.9029C18.3337 14.533 20 11.9435 20 9C20 6.64076 18.463 5 16.5 5C15.4241 5 14.2593 5.56911 13.4142 6.41421L12 7.82843L10.5858 6.41421C9.74068 5.56911 8.5759 5 7.5 5C5.55906 5 4 6.6565 4 9C4 11.9435 5.66627 14.533 8.64514 16.9029C9.39 17.4955 10.1845 18.0485 11.0661 18.6038C11.3646 18.7919 11.6611 18.9729 12 19.1752C12.3389 18.9729 12.6354 18.7919 12.9339 18.6038Z" fill="white" />
              </svg>
            </button>
        </div>
    </div>
          <div class="movie__info_image">
            <img class="movie__image" :src="product.posterUrl" :alt="product.title" />
        </div>
        
    </div>
    <div class="movie__description" v-if="product">
        <h2 class="film-about">О фильме</h2>
        <div class="movie__description-elements">
            <div class="movie__description-item">
                <span class="description">Язык оригинала</span>
                           <svg class="line" width="239" height="2" viewBox="0 0 239 2" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M239 1H0" stroke="white" stroke-opacity="0.5" stroke-dasharray="2 2" />
</svg>
                 English
            </div>
            <div class="movie__description-item">
                <span class="description">Бюджет</span> 
                           <svg class="line" width="239" height="2" viewBox="0 0 239 2" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M239 1H0" stroke="white" stroke-opacity="0.5" stroke-dasharray="2 2" />
</svg>
                {{ product.budget }}
            </div>
            <div class="movie__description-item">
                <span class="description">Выручка</span>
                  <svg class="line" width="239" height="2" viewBox="0 0 239 2" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M239 1H0" stroke="white" stroke-opacity="0.5" stroke-dasharray="2 2" />
</svg> 
                {{ product.revenue }}
            </div>
            <div class="movie__description-item">
                <span class="description">Режиссер</span> 
                    <svg class="line" width="239" height="2" viewBox="0 0 239 2" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M239 1H0" stroke="white" stroke-opacity="0.5" stroke-dasharray="2 2" />
</svg>
                {{ product.director }}
            </div>
            <div class="movie__description-item">
                <span class="description">Продакшен</span> 
                  <svg class="line" width="239" height="2" viewBox="0 0 239 2" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M239 1H0" stroke="white" stroke-opacity="0.5" stroke-dasharray="2 2" />
</svg>
                {{ product.production }}
            </div>
            <div class="movie__description-item">
                <span class="description">Награды</span> 
                  <svg class="line" width="239" height="2" viewBox="0 0 239 2" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M239 1H0" stroke="white" stroke-opacity="0.5" stroke-dasharray="2 2" />
</svg>
                {{ product.awardsSummary }}
            </div>
        </div>
    </div>
    <div v-else-if="isLoading">
      Загрузка...
    </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref, onMounted } from 'vue';
import type { Product } from '@/types/product';
import { useUserStore } from '@/stores/user';

const route = useRoute()
const userStore = useUserStore()
const product = ref<Product | null>(null)
const isLoading = ref(true)



// Фильм в избранном
const isFavorite = computed(() => {
  if (!product.value) return false
  return userStore.isInFavorites(product.value.id)
})

// Смена статуса
const toggleFavorite = () => {
  if (!product.value) return

   // Проверка авторизации
  if (!userStore.isAuthorized) {
    userStore.showLoginForm();
    return;
  }
  
  if (isFavorite.value) {
    userStore.removeFromFavorites(product.value.id)
  } else {
    userStore.addToFavorites(product.value)
  }
}

// Трейлер фильма
const watchTrailer = () => {
  if (product.value?.trailerUrl) {
    window.open(product.value.trailerUrl, '_blank')
  } else {
    alert('Трейлер недоступен')
  }
}

const getProduct = async(productId:number):Promise<Product> => {
  try {
    const fetchResponce = await fetch(`https://cinemaguide.skillbox.cc/movie/${productId}`)
    const products = await fetchResponce.json()
    return products
  } catch(err) {
    throw new Error('Error fetching movie details')
  }
}

const loadData = async (id:number) => {
  try {
    isLoading.value = true
    const data = await getProduct(id)
    product.value = data
  } catch (error) {
    console.error('Error loading movie:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData(Number(route.params.id))
})

const ratingClass = computed(() => {
  if (!product.value) return 'rating-very-low';
  const rating = product.value.tmdbRating;
  if (rating >= 8) return 'rating-high';
  if (rating >= 6) return 'rating-medium';
  if (rating >= 4) return 'rating-low';
  return 'rating-very-low';
});
</script>

<style scoped>
  .movie__info{
    display: flex;
    flex-wrap: nowrap;
    max-width: 100%;
    justify-content: space-between;
    padding: 25px;
    color: #fff;
    gap:10px;
    height: 100%;
    

}

.movie_info_description{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    max-width: 100%; 
}

.movie__description-item{
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 18px;
  line-height: 133%;
  color: #fff;
}

.movie__info__head{
    font-weight: 400;
    font-size: 25px;
    line-height: 133%;
    display: flex;
    justify-content: flex-start;
    gap:16px;
    font-family: var(--font-family);
    color: rgba(255, 255, 255, 0.7);
    align-items: center;
    margin-bottom: 16px;
  
}

.movie__info_image{
    width: 100%;
    height: 100%;

}

.movie__image{
   border-radius: 16px;
   width: 100%;
   height: 100%;
}

.movie__info_name{
    font-family: var(--font-family);
    font-weight: 700;
    font-size: 48px;
    line-height: 117%;
    margin-bottom: 16px;
}

.movie__info_plot{
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 24px;
    line-height: 133%;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 60px;
}

.movie__info_button{
    display: flex;
    justify-content: space-between;
    max-width: 256px;
}

.raiting{
    display: flex;
    justify-content: space-between;
    border-radius: 16px;
    padding: 4px 12px;
    background: #308e21;
    max-width: 100%;
   align-items: center;
}

.rating-high {
    background: #308e21; 
}

.rating-medium {
    background: #e6a700; 
}

.rating-low {
    background: #e67e00; 
}

.rating-very-low {
    background: #b10101; 
}

.trailer{
    border-radius: 28px;
    padding: 16px 48px;
    max-width: 100%;
    height: 56px;
    background: #67a5eb;
    font-family: var(--font-family);
    font-weight: 700;
    font-size: 18px;
    line-height: 133%;
    color: #fff;
    border: none;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.film{
    border: 1px solid rgba(0, 0, 0, 0.4);
    border-radius: 28px;
    padding: 16px 48px;
    height: 56px;
    font-family: var(--font-family);
    font-weight: 700;
    font-size: 18px;
    line-height: 133%;
    color: #fff;
    background: #393b3c;
    border: none;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.like{
    border: 1px solid rgba(0, 0, 0, 0.4);
    border-radius: 28px;
    padding: 16px 22px;
    background: #333;
     border: none;
    outline: none;
}

.film-about{
    font-family: var(--font-family);
    font-weight: 700;
    font-size: 40px;
    line-height: 120%;
    color: #fff;
   
}

.movie__description{
    display: flex;
    flex-direction: column;
    max-width: 100%;
    padding: 25px;
    
}
.movie__description-elements{
    display: flex;
    flex-direction: column;
    max-width: 100%;
}
.movie__description-item{
    gap:8px;
    display: flex;
    justify-content: flex-start;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 18px;
    line-height: 133%;
    color: #fff;
    align-items: flex-end;
}

.line{
    stroke-width: 1px;
    stroke: rgba(255, 255, 255, 0.5);
    vertical-align: bottoms;
}

.description{
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 14px;
  line-height: 143%;
  color: rgba(255, 255, 255, 0.5);
}
/* Адаптивные стили */
@media (max-width: 1200px) {
    .movie__info {
        flex-direction: column;
        align-items: center;
        gap: 30px;
    }
    
    .movie_info_description {
        gap: 20px;
        order: 2;
    }
    
    .movie__image {
        order: 1;
        max-width: 500px;
        height: auto;
    }
}

@media (max-width: 768px) {
    .movie__info {
        padding: 15px;
    }
    
    .movie__info__head {
        font-size: 18px;
        flex-wrap: wrap;
        gap: 12px;
    }
    
    .movie__info_name {
        font-size: 36px;
        line-height: 1.2;
    }
    
    .movie__info_plot {
        font-size: 18px;
        line-height: 1.4;
    }
    
    .movie__info_button {
        justify-content: center;
    }
    
    .trailer,
    .film {
        padding: 12px 32px;
        height: 50px;
        font-size: 16px;
    }
    
    .like,
    .update {
        padding: 12px;
    }
    
    .movie__image {
        max-width: 400px;
    }
}

@media (max-width: 480px) {

  .movie__description-item{
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
    .movie__info {
        padding: 10px;
        gap: 20px;
    }
    
    .movie__info__head {
        font-size: 16px;
        gap: 8px;
    }
    
    .movie__info_name {
        font-size: 28px;
    }
    
    .movie__info_plot {
        font-size: 16px;
    }
    
    .movie__info_button {
        flex-direction: column;
        align-items: center;
        width: 100%;
    }
    
    .trailer,
    .film,
    .like,
    .update {
        width: 100%;
        max-width: 280px;
        margin-bottom: 10px;
    }
    
    .like,
    .update {
        height: 50px;
    }
    
    .movie__image {
        max-width: 100%;
    }
    .line{
      display: none;
    }
}

@media (max-width: 360px) {
    .movie__info__head {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    
    .movie__info_name {
        font-size: 24px;
    }
    
    .movie__info_plot {
        font-size: 14px;
    }
}
</style>