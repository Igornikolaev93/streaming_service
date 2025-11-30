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
      //component:useModalRouter(BaseModal),
      meta: {requiredAuth: false}
    }]
})

//router.beforeEach((to) => {
  //const user = useUserStore()

 //if (to.meta.requiredAuth && !user.isAuthorized) {
 //  return '/'
// }
//})

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token'); // Or however you store auth status
if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if not authenticated
    next({ name: 'login' });
} else {
    next(); // Proceed to the route
}
});




export default router
