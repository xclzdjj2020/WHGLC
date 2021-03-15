//左侧轮播图数据
const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
  //每个站队巡检率
  //站队名字 id ssdwdm total 不合格人数 日期
  CenterItem: {
    type: Array,
    default: [],
  },
  //数据的日期
  checktime: {
    type: String,
    default: '',
  },
})

module.exports = mongoose.model('CenterSwiper', Schema)
