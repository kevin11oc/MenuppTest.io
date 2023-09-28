import { isAuthenticated } from 'src/services/auth';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('pages/loginComponent.vue'),
  },
  {
    path: '/login',
    component: () => import('pages/loginComponent.vue'),
  },
  {
    path: '/registro',
    component: () => import('pages/registerComponent.vue'),
  },
  {
    path: '/home',
    component: () => import('pages/homeComponent.vue'),
    beforeEnter: async (to, from, next) => {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        next();
      } else {
        next('/login');
      }
    },
  },
];

export default routes;
