const express = require('express')
const app = express()
const http = require('http')
const socketIO = require('socket.io')
const server = http.createServer(app)

const io = socketIO(server, {
  //跨域
  cors: {
    origin: '*',
  },
})
io.on('connection', () => {
  // io.emit('message', 'Updata Done')
})

const data = '2021-01-08' //统计哪天

const schedule = require('node-schedule') //引入定时对象
const moment = require('moment') //时间库

app.use(express.json())
app.use(require('cors')())

require('./db/db')
require('./router/admin')(app) //admin路由
require('./router/web')(app) //web路由

//数据请求设置成定时任务
const setTime = () => {
  // rule.minute = [40]
  //'0 10,40 5-23 * * *' 每天5－23点
  schedule.scheduleJob('0 10,40 * * * *', async () => {
    //利用时间格式化方法得到今日日期
    await require('./request/requestData')(moment().format('YYYY-MM-DD')) //请求存储所有数据
    //处理前端需要的格式数据
    await require('./utils/ProcessData')(moment().format('YYYY-MM-DD'))

    //向前端广播数据更新消息
    io.emit('message', 'Updata Done')
    console.log('给前端发送消息')
  })
}
setTime()

// require('./utils/ProcessData')('2021-02-17')
server.listen(5001, () => {
  console.log('http://localhost:5001')
})
