//处理时长
module.exports = amchecktime => {
  const moment = require('moment') //时间库
  let addtime = 0 //时长
  //如果是参数传进来是数组 判断参数是否是数组 amchecktime instanceof Array
  if (amchecktime instanceof Array) {
    //计算累计秒数
    for (let i = 0; i < amchecktime.length - 1; i++) {
      let t1 = amchecktime[i].checktime
      let t2 = amchecktime[i + 1].checktime
      const s1 = moment(t1).diff(moment(t2), 'seconds')
      //判断大于40分钟，不计入时长
      if (s1 > 2400) {
        continue
      }
      addtime += s1
    }
  }

  //转换成时分秒
  let time = moment.duration(amchecktime instanceof Array ? addtime : amchecktime, 'seconds') //得到一个对象，里面有对应的时分秒等时间对象值
  let hours = time.hours()
  let minutes = time.minutes()
  let seconds = time.seconds()
  return [moment({ h: hours, m: minutes, s: seconds }).format('HH:mm:ss'), addtime]
}
