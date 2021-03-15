//右侧表格数据模型
const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
  //站队
  departmentname: {
    type: String,
    default: '',
  },
  //站队id
  ssdwdm: {
    type: String,
    default: '',
  },
  //姓名
  username: {
    type: String,
    default: '',
  },
  //个人id
  routeid: {
    type: String,
    default: '',
  },
  //巡检区段
  routename: {
    type: String,
    default: '',
  },
  //应巡点
  basecount: {
    type: Number,
    default: 0,
  },
  //已巡点
  checkedcount: {
    type: Number,
    default: 0,
  },
  //未巡点
  scheckedcount: {
    type: Number,
    default: 0,
  },
  //巡检率
  percent: {
    type: String,
    default: '0',
  },
  //上午时长
  //
  amtimelong: {
    type: String,
    default: '00:00:00',
  },
  //下午巡检时长
  pmtimelong: {
    type: String,
    default: '00:00:00',
  },
  //上午起始时间
  amstart: {
    type: String,
    default: '00:00:00',
  },
  //上午结束时间
  amend: {
    type: String,
    default: '00:00:00',
  },
  //下午起始时间
  pmstart: {
    type: String,
    default: '00:00:00',
  },
  //下午结束时间
  pmend: {
    type: String,
    default: '00:00:00',
  },
  //全天时长
  ampmtimelong: {
    type: String,
    default: '00:00:00',
  },
  //巡检日期
  checktime: {
    type: String,
    default: '',
  },
  //备注
  checkps: {
    type: String,
    default: '',
  },
})

module.exports = mongoose.model('SelectTable', Schema)
