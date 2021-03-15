const moment = require('moment')

//把时长换成秒 03:33:12
const timelongtosecond = function (time) {
  let temptime = 0
  time.split(':').forEach((item, index) => {
    if (index === 0) {
      temptime += Number(item) * 3600
    }
    if (index === 1) {
      temptime += Number(item) * 60
    }
    if (index === 2) {
      temptime += Number(item)
    }
  })
  return temptime
}

//秒数转'00:00'格式
const secondsTo = function (second) {
  //转换成时分秒
  let time = moment.duration(second, 'seconds')
  let hours = time.hours()
  let minutes = time.minutes()
  // let seconds = time.seconds()
  return moment({ h: hours, m: minutes }).format('HH:mm')
}

//暴露模块
module.exports = {
  timelongtosecond,
  secondsTo,
}
