//个人详细信息
const mongoose = require('mongoose')
const Schema = new mongoose.Schema(
  {
    //巡检日期
    checktime: {
      type: String,
      default: '',
    },
    //上午巡检时间
    amchecktime: {
      type: Array,
      default: [],
    },
    //下午巡检时间
    pmchecktime: {
      type: Array,
      default: [],
    },
    //上午巡检时长
    amtimelong: {
      type: String,
      default: '00:00:00',
    },
    //下午巡检时长
    pmtimelong: {
      type: String,
      default: '00:00:00',
    },
    //总时长
    ampmtimelong: {
      type: String,
      default: '00:00:00',
    },
    //用户账号
    // checkmanuserid: {
    //   type: String,
    //   default: '',
    // },
    //巡检轮次
    // orders: {
    //   type: Number,
    //   default: null,
    // },
    //巡检人姓名
    username: {
      type: String,
      default: '',
    },
    routeid: {
      type: String,
      default: '',
    },
    //关联字段
    querycheckstatics: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'GetCheckRoutePoint',
    },
    updatedAt: Number, //更新时间
    //记录更新时间，时间戳格式
  },
  { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } }
)

module.exports = mongoose.model('GetCheckRoutePoint', Schema)
