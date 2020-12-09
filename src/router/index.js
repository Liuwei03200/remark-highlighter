import Vue from 'vue'
import VueRouter from 'vue-router'
import RemarkIndex from '../views/remark/index.vue';
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Remark',
    // component: Remark
    // 初版
    component:RemarkIndex
    //ui重新设计版，模块化
  },
  {
    path: '/oldRemark',
    name: 'OldRemark',
    component: () => import('../views/Remark.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
