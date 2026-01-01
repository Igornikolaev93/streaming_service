<script lang="ts" setup>

import {ref} from 'vue'
import type {Genres, Product} from '@/types/product';
import MovieCard from '@/components/MovieCard.vue';
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'

 defineProps<{
  product: Product,
  genres:Genres,
}>()

const products = ref<Product[]>([])

const isLoading = ref(false)
const route = useRoute()
const router = useRouter()

const message = ref('')

 async function loadProducts(item:string) {
  isLoading.value = true

 const res = await fetch('https://cinemaguide.skillbox.cc/movie/')
 const data= await res.json()
const filterData = data.filter((el:any) => {if(el.genres.includes(`${route.params.id}`)) return el})
 products.value = Object.assign({},filterData)
 isLoading.value = false
 
}

loadProducts(String(route.params.id))


const elem= (el:any)=>{
  router.push(`/movie/${el.id}`)

}
</script>
<template>
    <h1>
      <svg width="13" height="22" viewBox="0 0 13 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.714 10.6066L12.9637 18.8561L10.6067 21.2131L0 10.6066L10.6067 0L12.9637 2.35702L4.714 10.6066Z" fill="white" />
      </svg>      
      {{ route.params.id}}
    </h1>

    <div  v-if="!isLoading">
    <div class="cart">
    </div>
    <div class="catalog">
     <MovieCard
      v-for = "product in  products"
       :key ="product.id"
       :product="product"
       @click="elem(product)"
      />
    </div>
  </div>



</template>
<style>
h1{
  font-family: var(--font-family);
  font-weight: 700;
  font-size: 48px;
  line-height: 117%;
  color: white;}

  .cart {
  margin-top: 24px;
  margin-bottom: 16px;
  

  
}

.catalog {
  max-width: 100%;
  width: 1170px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 2em;
 
   
}
  


</style>