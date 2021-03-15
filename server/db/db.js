const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/admin-test',
  {
    useNewUrlParser: true,useUnifiedTopology: true
  },
  () => {
  console.log('数据库连接成功^_^')
})

module.exports = mongoose