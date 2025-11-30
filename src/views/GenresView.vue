<script setup lang="ts">
import {computed, ref, onMounted} from 'vue';
import { storeToRefs } from 'pinia';
import type { Product } from '@/types/product';
import MovieCard from '@/components/MovieCard.vue';
import type { Genres } from '@/types/product';
import GenresCard from '@/components/GenresCard.vue';
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'

const isLoading = ref(false)
const products = ref<Product[]>([])
const genres = ref<string[]>([]) 
const genreImages = ref<Record<string, string>>({}) 

const router = useRouter()
const message = ref('')


async function getGenreImages(movies: Product[]) {
  const genrePosters: Record<string, string> = {}
  
  
  genres.value.forEach(genre => {
    const genreMovies = movies.filter(movie => 
      movie.genres && movie.genres.includes(genre)
    )
    
    if (genreMovies.length > 0) {
      
      const bestMovie = genreMovies.sort((a, b) => 
        (b.tmdbRating || 0) - (a.tmdbRating || 0)
      )[0]
      
      if (bestMovie.posterUrl) {
        genrePosters[genre] = bestMovie.posterUrl
      } else {
        const movieWithPoster = genreMovies.find(m => m.posterUrl)
        if (movieWithPoster) {
          genrePosters[genre] = movieWithPoster.posterUrl
        }
      }
    }
    
    if (!genrePosters[genre]) {
      genrePosters[genre] = getGenrePlaceholder(genre)
    }
  })
  
  return genrePosters
}

function getGenrePlaceholder(genreName: string): string {
  const colors = [
    '4A5568', '38A169', 'E53E3E', '805AD5', '3182CE', 
    '1A202C', 'F56565', 'DD6B20', '2D3748', '744210',
    '2C7A7B', '38B2AC', '319795', 'D69E2E', '718096',
    'B83280', '276749'
  ]
  const color = colors[Math.abs(genreName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length]
  return `https://via.placeholder.com/300x450/${color}/FFFFFF?text=${encodeURIComponent(genreName)}`
}

// Навигация по жанрам
function navigateToGenre(genreName: string) {
  router.push(`/genres/${encodeURIComponent(genreName)}`)
}

async function loadProducts() {
  isLoading.value = true

  try {
    const [moviesRes, genresRes] = await Promise.all([
      fetch('https://cinemaguide.skillbox.cc/movie'),
      fetch('https://cinemaguide.skillbox.cc/movie/genres')
    ])
    
    if (!moviesRes.ok || !genresRes.ok) {
      throw new Error('Failed to fetch data')
    }
    
    const moviesData = await moviesRes.json()
    const genresData = await genresRes.json()
    
  
    products.value = moviesData.movies || moviesData.items || moviesData || []
    
    
    if (Array.isArray(genresData)) {
      genres.value = genresData
    } else if (genresData.genres && Array.isArray(genresData.genres)) {
      genres.value = genresData.genres
    } else if (typeof genresData === 'object') {
      
      genres.value = Object.values(genresData).filter(val => typeof val === 'string') as string[]
    } else {
      throw new Error('Unexpected genres data format')
    }
    
   
    
    
    genreImages.value = await getGenreImages(products.value)
    
  } catch (error) {
    console.error('Error loading data:', error)
    
    genres.value = [
      'драма', 'комедия', 'боевик', 'триллер', 'фантастика', 
      'ужасы', 'романтика', 'приключения', 'детектив', 'фэнтези',
      'исторический', 'биография', 'мультфильм', 'семейный', 'вестерн'
    ]
    
    // Изображение жанров фильма
    const placeholders: Record<string, string> = {}
    genres.value.forEach(genre => {
      placeholders[genre] = getGenrePlaceholder(genre)
    })
    genreImages.value = placeholders
  } finally {
    isLoading.value = false
  }
}


function getGenreGradient(genreName: string): string {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8caba 0%, #5d4157 100%)',
    'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
    'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    'linear-gradient(135deg, #fd746c 0%, #ff9068 100%)'
  ]
  
  const index = Math.abs(genreName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % gradients.length
  return gradients[index]
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div class="genres-container">
    <div v-if="isLoading" class="loading">
      <div class="loading-spinner"></div>
      <p>Загрузка жанров...</p>
    </div>

    <div v-else>
      <div class="cart"></div>
      <h2> Жанры фильмов</h2>
      <div class="catalog">
        <div 
          class="genre-card" 
          v-for="(genreName, index) in genres"
          :key="index"
          @click="navigateToGenre(genreName)"
        >
          <div class="genre-image-container">
      
            <img 
              class="genre-image" 
              :src="genreImages[genreName]" 
              :alt="`Фильмы в жанре ${genreName}`"
              @error="(e) => { 
                
                e.target.style.display = 'none';
                const fallback = e.target.parentElement?.querySelector('.genre-gradient-fallback') as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }"
            >
           
            <div 
              class="genre-gradient-fallback" 
              :style="{ background: getGenreGradient(genreName) }"
            >
              <span class="genre-text">
                {{ genreName }}</span>
            </div>
            
            
            <div class="genre-overlay">
              <span class="genre-overlay-text">Смотреть фильмы</span>
            </div>
          </div>
          
          <div class="genre-name">
            {{ genreName }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2{
  align-content: left;
}

.genres-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 80vh;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: white;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #393b3c;
  border-top: 3px solid #67a5eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

h2 {
  display: flex;
  color: white;
  text-align: center;
  margin-bottom: 10px;
  font-size: 32px;
  font-weight: 600;
}

.genres-subtitle {
  color: #ccc;
  text-align: center;
  margin-bottom: 30px;
  font-size: 16px;
}

.cart {
  margin-top: 24px;
  margin-bottom: 16px;
}

.catalog {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  padding: 20px 0;
}

.genre-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  overflow: hidden;
  background-color: #1a1a2e;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #393b3c;
  height: 100%;
  position: relative;
}

.genre-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(103, 165, 235, 0.3);
  border-color: #67a5eb;
}

.genre-image-container {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.genre-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.genre-card:hover .genre-image {
  transform: scale(1.1);
}

.genre-gradient-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
  text-align: center;
  padding: 20px;
  display: none; 
}

.genre-text {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: 600;
}

.genre-overlay {
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

.genre-card:hover .genre-overlay {
  opacity: 1;
}

.genre-overlay-text {
  color: white;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  padding: 10px;
}

.genre-name {
  padding: 16px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: white;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: black;
}

.genre-movie-count {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(103, 165, 235, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}


@media (max-width: 768px) {
  .catalog {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
  
  .genre-image-container {
    height: 200px;
  }
  
  h2 {
    font-size: 24px;
  }
  
  .genres-subtitle {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .catalog {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 12px;
  }
  
  .genre-image-container {
    height: 180px;
  }
  
  .genre-name {
    font-size: 14px;
    padding: 12px;
  }
  
  .genres-container {
    padding: 10px;
  }
}
</style>