import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

import { useModalRouter } from 'jenesius-vue-modal';
import BaseModal from '../components/BaseModal.vue';

const router = createRouter({
 history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../components/FirstPage.vue')
    },
    {
      path: '/genres',
      name: 'genres',
      component: () => import('../views/GenresView.vue')
    },
     {
      path: '/movie/:id',
      name: 'movie',
      component: () => import('../components/FilmCard.vue')
    },
     {
      path: '/genres/:id',
      name: 'page',
      component: () => import('../components/GenresCard.vue')
    },
     {
      path: '/account',
      name: 'account',
      component: () => import('../components/Account.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/Login.vue'),
      meta: {requiredAuth: false}
    }]
})


router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token');
if (to.meta.requiresAuth && !isAuthenticated) {
    
    next({ name: 'login' });
} else {
    next(); 
}
});




export default router
