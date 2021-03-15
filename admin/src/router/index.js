import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

import CreateData from '../views/Main/CreatData.vue'
import DataManage from '../views/Main/DataManage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '/home/creatdata',
        component: CreateData
      },
      {
        path: '/home/datamanage',
        component: DataManage
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
