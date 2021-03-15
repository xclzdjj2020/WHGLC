//巡检总人数,合格人数,巡检率...跨越总人数 模型
const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
  //巡检总人数
  checkTotalNumber: {
    type: Number,
    default: 0,
  },
  //合格人数
  checkQuTotalNumber: {
    type: Number,
    default: 0,
  },
  //未合格人员信息
  checkUnquTotalNumber: {
    type: Array,
    default: [],
  },
  //合格有效率
  checkQuPercent: {
    type: String,
    default: '0%',
  },
  //平均时长
  avgTime: {
    type: String,
    default: '00:00',
  },
  //跨越盾构总人数
  bridgeTotalNumber: {
    type: Number,
    default: 0,
  },
  //合格人数
  bridgeQuTotalNumber: {
    type: Number,
    default: 0,
  },
  //未合格人员信息
  bridgeUnquTotalNumber: {
    type: Array,
    default: [],
  },
  //合格有效率
  bridgekQuPercent: {
    type: String,
    default: '0%',
  },
  //数据的日期
  checktime: {
    type: String,
    default: '',
  },
})

module.exports = mongoose.model('DigitalFlop', Schema)
