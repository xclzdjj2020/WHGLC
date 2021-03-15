//站队id name total
const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  ssdwdm: {
    type: String,
  },
  name: {
    type: String,
  },
  total: {
    type: Number,
    default: null,
  },
})

//添加虚拟字段
Schema.virtual('querycheckstatics', {
  ref: 'QueryCheckStatics',
  localField: '_id',
  foreignField: 'ssdwdmname',
  justOne: false,
})

module.exports = mongoose.model('SsdwdmName', Schema)
