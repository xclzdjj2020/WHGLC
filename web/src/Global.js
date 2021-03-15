//全局变量
import moment from 'moment'

import io from 'socket.io-client'
const socket = io('http://localhost:5001')

let nowData = moment().format('YYYY-MM-DD') //今日日期

socket.on('message', () => {
  nowData = moment().format('YYYY-MM-DD') //今日日期   
  console.log('重新获取今日日期')
})

export default nowData
