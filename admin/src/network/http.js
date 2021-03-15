import axios from 'axios'
import Vue from 'vue'

const http = axios.create({
  baseURL: 'http://localhost:5001/admin/api',
})

//请求拦截器
http.interceptors.request.use(
  config => {
    if (localStorage.token) {
      config.headers.Authorization = 'Bearer ' + localStorage.token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

//响应拦截器
http.interceptors.response.use(
  res => {
    return res
  },
  err => {
    if (err.response.data.message) {
      console.log(err.response)
      Vue.prototype.$message({
        type: 'error',
        message: err.response.data.message,
      })
    }

    return Promise.reject(err)
  }
)

export default http
