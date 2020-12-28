import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw
} from 'vue-router'
import Home from '@/views/Home.vue'
import Search from '@/views/Search.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Home },
  { path: '/search', component: Search }
]

const router = createRouter({
  history: process.env.IS_ELECTRON
    ? createWebHashHistory()
    : createWebHistory(),
  routes
})

export default router
