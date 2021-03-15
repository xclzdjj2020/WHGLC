//巡检时段占比,饼图
const mongoose = require('mongoose')
const Schema = new mongoose.Schema(
  {
    danChecked: {
      //已完成的所有巡检点数量
      type: Number,
      default: 0,
    },
    timeChecked6_8: {
      //6-8点钟完成的巡检点数量
      type: Number,
      default: 0,
    },
    timeChecked8_10: {
      type: Number,
      default: 0,
    },
    timeChecked10_12: {
      type: Number,
      default: 0,
    },
    timeChecked13_15: {
      type: Number,
      default: 0,
    },
    timeChecked15_17: {
      type: Number,
      default: 0,
    },
    timeCheckedOthers: {
      //其他时间段完成的巡检点数量
      type: Number,
      default: 0,
    },
    //数据的日期
    checktime: {
      type: String,
      default: '',
    },
    updatedAt: Number, //更新时间
    //记录更新时间，时间戳格式
  },
  { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } }
)

module.exports = mongoose.model('PieRight', Schema)
