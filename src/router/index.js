import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import ResetPassword from '@/components/ResetPassword.vue';

const routes = [
  { path: '/', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/home', name: 'home', component: Home },
  { path: '/reset-password', name: 'reset-password', component: ResetPassword },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
