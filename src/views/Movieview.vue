<script setup lang="ts" >

import {computed, ref,inject, watch} from 'vue';
import { storeToRefs } from 'pinia';
import type { Genres, Product } from '@/types/product';
import MovieCard from '@/components/MovieCard.vue';
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user';

const props = defineProps<{
  searchQuery: string
}>()

const appModel:any = inject('appModel')
const modelValue= appModel.value



const user = useUserStore()


const isLoading = ref(false)
const products = ref<Product[]>([])

const route = useRoute()

const router = useRouter()

const message = ref('')

 async function loadProducts() {
  isLoading.value = true

 const res = await fetch('https://cinemaguide.skillbox.cc/movie/top10')
 const data= await res.json()
products.value = Object.assign({},data)
 isLoading.value = false

}

loadProducts()

const findItem = computed(()=>{
  let p =products.value;
  if(user.message)
{return p.filter((product)=> product.title.indexOf(user.message) !== -1 )} 
 return p
});

const filteredProducts = computed(() => {
  const searchTerm = props.searchQuery.toLowerCase().trim()
  
})



const elem= (el:any)=>{
  router.push(`/movie/${el.id}`)

}


const selectedMovie = ref(null)
const moviesList = ref([]) 





</script>

<template >

  <div  v-if="!isLoading">
    <div class="cart">
    </div>
    <div class="catalog">
     <div
      v-for = "(product, index) in products"
       :key ="product.id"
       class="movie-card-wrapper"
       @click="elem(product)"
      >
       <div class="movie-number-badge">
         {{ Number(index)+1}}
       </div>
       <MovieCard
         :product="product"
       />
      </div>
    </div>
  </div>
  <div v-else>
  </div>

</template>

<style scoped>


.cart {
  margin-top: 24px;
  margin-bottom: 16px;
  
}

.catalog {
  position: relative;
  max-width: 100%;
  padding: 25px;
  width: 1280px;
  display: grid;
  /*background-color: rgb(3, 3, 70);*/
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 2em;
  padding-bottom: 120px;
  /*box-shadow: 0 0 80px 0 rgba(255, 255, 255, 0.33);*/
   
}

.movie-card-wrapper {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.movie-card-wrapper:hover {
  transform: translateY(-5px);
}

.movie-number-badge {
  position: absolute;
  top: -8px;
  left: -8px;
  background: #fff;
  color: #6a5dc2;
  font-family: var(--font-family);
  font-weight: 700;
  font-size: 24px;
  line-height: 133%;
  border-radius: 50px;
  padding: 8px 24px;
  z-index: 1;
}

.movie-card-wrapper:hover .movie-number-badge {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.product-card__button{
  display: block;
}

/* Адаптивные стили */
@media (max-width: 768px) {
  .catalog {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    grid-gap: 1.5em;
  }
  
  .movie-number-badge {
    width: 28px;
    height: 28px;
    font-size: 12px;
    top: -6px;
    left: -6px;
  }
}

@media (max-width: 480px) {
  .catalog {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    grid-gap: 1em;
  }
  
  .movie-number-badge {
    width: 24px;
    height: 24px;
    font-size: 11px;
    top: -5px;
    left: -5px;
  }
}
</style>