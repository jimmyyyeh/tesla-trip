import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/trip',
    name: 'trip',
    component: () => import('../views/TripView.vue'),
  },
  {
    path: '/attraction',
    name: 'attraction',
    component: () => import('../views/AttractionView.vue'),
  },
  {
    path: '/car',
    name: 'car',
    component: () => import('../views/CarView.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../views/AuthView.vue'),
  },
  {
    path: '/resetPassword/:token',
    name: 'resetPassword',
    component: () => import('../views/ResetPasswordView.vue'),
  },
  {
    path: '/verify/:token',
    name: 'verify',
    component: () => import('../views/VerifyView.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
