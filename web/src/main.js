import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'

import './assets/scss/common.css'

//引入全局变量
import nowData from './Global'
Vue.prototype.$nowData = nowData

import http from './network/http'
Vue.prototype.$http = http

import moment from 'moment'
Vue.prototype.$moment = moment

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//前后端通信
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIO('ws://localhost:5001'),
  })
)

// 将自动注册所有组件为全局组件
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)

//引入echarts
import echarts from 'echarts'
import './plugins/element.js'
Vue.prototype.$echarts = echarts

//事件总线
Vue.prototype.$bus = new Vue()

Vue.config.productionTip = false

new Vue({
  sockets: {
    connecting() {
      console.log('正在连接')
    },
    disconnect() {
      console.log('Socket 断开')
    },
    connect_failed() {
      cosnole.log('连接失败')
    },
    connect() {
      console.log('socket connected 连接成功')
    },
  },
  router,
  render: h => h(App),
}).$mount('#app')
