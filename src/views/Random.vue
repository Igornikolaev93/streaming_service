<script setup lang="ts">

import {computed, ref} from 'vue';
import { storeToRefs } from 'pinia';
import type {Product} from '@/types/product';
import RandomMowie from '@/components/RandomMovie.vue'

const isLoading = ref(false)
const products = ref<Product[]>([])

const handleUpdateMovie = () => {
  loadProducts();
};


const message = ref('')

 async function loadProducts() {
  isLoading.value = true

 const res = await fetch('https://cinemaguide.skillbox.cc/movie/random')
 const data= await res.json()
 products.value = [data]
 isLoading.value = false
}

loadProducts()


</script>

<template >
  <div v-if="!isLoading">
    <div class="catalogs">
      <RandomMowie  v-for = "product in  products"
       :key ="product.id"
       :product="product"
       @updateMovie="handleUpdateMovie"
      />
    </div>
  </div>
  <div v-else>
    Loading books...
  </div>
</template>

<style scoped>

.cart {
  margin-top: 24px;
  margin-bottom: 16px;
  
}

.catalogs{
  display: flex;
}

.catalog {
  width: 1170px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 2em;
}

.product-card__button{
  display: block;
}
</style>