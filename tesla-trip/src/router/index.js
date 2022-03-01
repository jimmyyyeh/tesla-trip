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
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
