<script setup lang="ts">

import{computed,ref} from 'vue';
import Movieview from '@/views/Movieview.vue';
import type { Product } from '@/types/product';
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Random from '@/views/Random.vue'
import GenresView from '@/views/GenresView.vue';

const user = useUserStore()
const router = useRouter()
</script>
<template>
<Random/>
<Movieview/>

</template>
<style scoped>

</style>