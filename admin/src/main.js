import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'

import './assets/css/style.scss'
import http from './network/http'
Vue.prototype.$http = http

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
