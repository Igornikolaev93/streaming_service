<script setup lang="ts">
import type {Product} from '@/types/product';
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { RouterLink, RouterView, useRouter } from 'vue-router'

const userStore = useUserStore();

const router =useRouter();

const props = defineProps<{
  product: Product
}>()


const isFavorite = computed(() => {
  return userStore.isInFavorites(props.product.id);
});


const toggleFavorite = () => {
     
  if (!userStore.isAuthorized) {
    userStore.showLoginForm();
    return;
  }

  if (isFavorite.value) {
    userStore.removeFromFavorites(props.product.id);
  } else {
    userStore.addToFavorites(props.product);
  }
};


const watchTrailer = () => {
  if (props.product.trailerUrl) {
    window.open(props.product.trailerUrl, '_blank');
  } else {
    alert('Трейлер недоступен');
  }
};


const showFilmDetails = (el:any) => {
   router.push(`/movie/${el.id}`)
  
};

//Обновить фильм

const emit = defineEmits<{
  (e: 'updateMovie'): void
}>()


const updateMovie = () => {
  emit('updateMovie');
};

const ratingClass = computed(() => {
  const rating = props.product.tmdbRating;
  if (rating >= 8) return 'rating-high';
  if (rating >= 6) return 'rating-medium';
  if (rating >= 4) return 'rating-low';
  return 'rating-very-low';
});


</script>

<template>
    <div class="movie__info">
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
            <button class="trailer one" @click="watchTrailer">Трейлер</button>
            <button class="film" @click="showFilmDetails(product)">О фильме</button>
            <button class="like" @click="toggleFavorite" :class="{ 'liked': isFavorite }">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path v-if="isFavorite" d="M16.5 3C19.5376 3 22 5.5 22 9C22 16 14.5 20 12 21.5C9.5 20 2 16 2 9C2 5.5 4.5 3 7.5 3C9.35997 3 11 4 12 5C13 4 14.64 3 16.5 3Z" fill="#ffff" />
                <path v-else d="M16.5 3C19.5376 3 22 5.5 22 9C22 16 14.5 20 12 21.5C9.5 20 2 16 2 9C2 5.5 4.5 3 7.5 3C9.35997 3 11 4 12 5C13 4 14.64 3 16.5 3ZM12.9339 18.6038C13.8155 18.0485 14.61 17.4955 15.3549 16.9029C18.3337 14.533 20 11.9435 20 9C20 6.64076 18.463 5 16.5 5C15.4241 5 14.2593 5.56911 13.4142 6.41421L12 7.82843L10.5858 6.41421C9.74068 5.56911 8.5759 5 7.5 5C5.55906 5 4 6.6565 4 9C4 11.9435 5.66627 14.533 8.64514 16.9029C9.39 17.4955 10.1845 18.0485 11.0661 18.6038C11.3646 18.7919 11.6611 18.9729 12 19.1752C12.3389 18.9729 12.6354 18.7919 12.9339 18.6038Z" fill="white" />
              </svg>
            </button>
            <button class="update" @click="updateMovie">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 4C14.7486 4 17.1749 5.38626 18.6156 7.5H16V9.5H22V3.5H20V5.99936C18.1762 3.57166 15.2724 2 12 2C6.47715 2 2 6.47715 2 12H4C4 7.58172 7.58172 4 12 4ZM20 12C20 16.4183 16.4183 20 12 20C9.25144 20 6.82508 18.6137 5.38443 16.5H8V14.5H2V20.5H4V18.0006C5.82381 20.4283 8.72764 22 12 22C17.5228 22 22 17.5228 22 12H20Z" fill="white" />
</svg>
            </button>
        </div>
    </div>
          <div class="movie__info_image">
            <img class="movie__image" :src="product.posterUrl" :alt="product.title" />
        </div>
    </div>
</template>
<style scoped>
.movie__info{
    display: flex;
    flex-wrap: nowrap;
    max-width: 100%;
    justify-content: space-between;
    padding: 25px;
    color: #fff;
    gap:10px;
    

}

.movie_info_description{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    
    
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
  

}

.movie__image{
   border-radius: 16px;
    max-width: 680px;
    height: 552px;
}

.movie__info_name{
    font-family: var(--font-family);
    font-weight: 700;
    font-size: 48px;
    line-height: 117%;
}

.movie__info_plot{
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 24px;
    line-height: 133%;
    color: rgba(255, 255, 255, 0.7);
}

.movie__info_button{
    display: flex;
    gap: 16px;
    border: none;
    outline: none;
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
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    outline: none;
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
     display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    outline: none;
}

.like{
    border: 1px solid rgba(0, 0, 0, 0.4);
    border-radius: 28px;
    padding: 16px 22px;
    background: #333;
    max-width: 68px;
    height: 56px;
    align-items: center;
    border: none;
    outline: none;
     display: flex;
    justify-content: center;

   
}

.update{
    border: 1px solid rgba(0, 0, 0, 0.4);
    border-radius: 28px;
    padding: 16px 22px;
    background: #333;
    cursor: pointer;
    max-width: 68px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    outline: none;
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

    .one{
        width: 100%;
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
