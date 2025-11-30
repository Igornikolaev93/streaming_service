<script lang="ts" setup>
//import { usePlanStore } from '@/stores/add';
//import {useCartStore} from '@/stores/cart';
//import {useDoneStore} from '@/stores/done';
import type {Product} from '@/types/product';
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';

const props = defineProps<{
  product: Product
  
}>()


const userStore = useUserStore();

</script>

<template>
 

  <div class="product-card">
    <img class="product-card__image" :src="product.posterUrl" :alt="product.title" />
  </div>
</template>

<style scoped >
.product-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: 1px solid var(--color-border);
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 0 80px 0 rgba(255, 255, 255, 0.33);
}

.product-card:hover{
  transition: all 0.3s ease-in-out;
   transform: translateY(-8px);
   box-shadow: 0 12px 30px rgba(103, 165, 235, 0.3);
   border-color: #67a5eb;
}

.product-card__image {
  height: 100%;
  max-width: 100%;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  object-fit: cover;
  
}

.product-card__name {
  padding: 12px;
  flex: 1 1 auto;
}

.product-card__price {
  font-size: 1.2em;
  padding: 0 12px 12px 12px;
}

.product-card__button {
  margin: 8px;
  display: block;
  
}

.status{
  display: block;
}

.raiting{
  max-width: 100%;
  border-radius: 5px;
  background-color: green;
  font-size: 20px;
  color: white;
}

.director{
  font-style: italic;
  font-weight: 400;
}
</style>