module.exports = app => {
  const express = require('express')
  const router = express.Router()
  const AdminUser = require('../models/AdminUser')
  const bcryptjs = require('bcryptjs')
  const assert = require('http-assert')
  const jwt = require('jsonwebtoken')
  const middleAuth = require('../middleware/auth')

  //站队基本信息模型
  const SsdwdmName = require('../models/SsdwdmName')
  //个人巡检详细信息模型
  const GetCheckRoutePoint = require('../models/GetCheckRoutePoint')
  //站队详细信息模型
  const QueryCheckStatics = require('../models/QueryCheckStatics')

  //登录接口
  router.post('/login', async (req, res) => {
    //验证用户
    const { username, password } = req.body //前台传过来的数据
    const user = await AdminUser.findOne({ username })
    assert(user, 422, '用户名不存在')

    //验证密码
    const isValid = bcryptjs.compareSync(password, user.password)
    assert(isValid, 422, '密码错误')

    //返回token
    const token = jwt.sign({ id: user._id }, '234234ekladfa')
    res.send(token)
  })

  // // 取到3个表所有数据 利用关联查询
  // router.get('/home/datamanage', async (req, res) => {
  //   const result = await SsdwdmName.find()
  //     .populate({
  //       path: 'querycheckstatics',
  //       // select: 'ssdwdmname',
  //       populate: { path: 'getcheckroutepoint' },
  //     })
  //     .lean()
  //   res.send(result)
  // })

  app.use('/admin/api', middleAuth(), router)

  //错误处理中间件
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message,
    })
  })
}
