import axios from 'axios'
import { Loading } from 'element-ui'
const http = axios.create({
  baseURL: 'http://localhost:5001/web/api',
})

//如果页面有多个请求一起请求，如果都使用一个服务loading，很可能会出现较快结束请求的那个直接把loading关了，而请求时间长的还没有结束请求。
let loading
//记录正在请求的数量
let loadingNum = 0
function startLoading() {
  if (loadingNum == 0) {
    loading = Loading.service({
      lock: true,
      text: '数据加载中...',
      background: 'rgba(0, 0, 0, 0.8)',
    })
  }
  //请求数量加1
  loadingNum++
}
function endLoading() {
  //请求数量减1
  loadingNum--
  if (loadingNum <= 0) {
    loading.close()
  }
}

//添加请求的拦截器 可以添加token
http.interceptors.request.use(
  request => {
    startLoading()
    return request
  },
  err => {
    console.log('请求失败！', err)
  }
)

//响应拦截器
http.interceptors.response.use(
  response => {
    endLoading()

    return response
  },
  err => {
    endLoading()
    console.log('响应失败！', err)
  }
)

export default http
