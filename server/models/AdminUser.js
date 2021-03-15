const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
  username:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true,
    set(val) {
      var bcrypt = require('bcryptjs')
      //加密强度为10
      var salt = bcrypt.genSaltSync(10)
      //使用bcryptjs库的散列（同步）方法对值进行加密后再存入数据库
      return bcrypt.hashSync(val, salt)
    }
  }
})

module.exports = mongoose.model('AdminUser',Schema)