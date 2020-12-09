import Vue from 'vue'
import VueRouter from 'vue-router'
import Remark from '../views/Remark';
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Remark',
    component: Remark
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
