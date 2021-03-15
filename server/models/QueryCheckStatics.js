const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
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
  //巡检日期
  checktime: {
    type: String,
    default: '',
  },
  //巡检率
  percent: {
    type: String,
    default: '0',
  },
  //区段名
  routename: {
    type: String,
    default: '',
  },
  //所属站队的编号
  ssdwdm: {
    type: String,
    default: '0',
  },
  //站队名
  departmentname: {
    type: String,
    default: '',
  },
  //巡线员ID
  routeid: {
    type: String,
    default: '',
  },
  ssdwdmname: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'SsdwdmName',
  },
})

//添加虚拟字段
Schema.virtual('getcheckroutepoint', {
  ref: 'GetCheckRoutePoint',
  localField: '_id',
  foreignField: 'querycheckstatics',
  justOne: false,
})

module.exports = mongoose.model('QueryCheckStatics', Schema)
