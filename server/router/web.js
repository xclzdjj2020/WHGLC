module.exports = app => {
  const express = require('express')
  const router = express.Router()

  //站队基本信息模型
  const SsdwdmName = require('../models/SsdwdmName')
  const QueryCheckStatics = require('../models/QueryCheckStatics')
  const DigitalFlop = require('../models/DigitalFlop') //展示巡检时长信息的表
  const CenterSwiper = require('../models/CenterSwiper') //左侧轮播图信息
  const PieRight = require('../models/PieRight') //饼图
  const SelectTable = require('../models/SelectTable') //右侧表格

  // //请求所有站队数据 根据日期
  router.get('/index/ssdwdm', async (req, res) => {
    const result = await SsdwdmName.find().lean()
    res.send(result)
  })
  // router.get('/index/:data', async (req, res) => {
  //   const result = await SsdwdmName.find()
  //     .populate({
  //       path: 'querycheckstatics',
  //       match: { checktime: req.params.data }, //根据日期查询当前所有数据
  //       populate: { path: 'getcheckroutepoint', match: { checktime: req.params.data } },
  //     })
  //     .lean()
  //   res.send(result)
  // })

  //digitalFlop 上部显示巡检点总数部分
  router.get('/index/digitalflop/:data', async (req, res) => {
    const result = await DigitalFlop.find({ checktime: req.params.data }).lean()
    res.send(result)
  })

  //centersiper 左侧轮播图
  router.get('/index/centersiper/:data', async (req, res) => {
    const result = await CenterSwiper.find({ checktime: req.params.data }).lean()
    res.send(result)
  })

  //pieright 饼图
  router.get('/index/pieright/:data', async (req, res) => {
    const result = await PieRight.find({ checktime: req.params.data }).lean()
    res.send(result)
  })

  //根据时间,id 请求各站队数据 selectTable
  router.get('/index/:time/:ssdwdm', async (req, res) => {
    const result = await SelectTable.find({
      $and: [{ checktime: req.params.time }, { ssdwdm: req.params.ssdwdm }],
    }).lean()
    res.send(result)
  })
  // router.get('index/:data/:ssdwdm', async (req, res) => {
  //   const result = await SelectTable.find({
  //     $and: [{ checktime: req.params.time }, { ssdwdm: req.params.ssdwdm }],
  //   }).lean()
  //   res.send(result)
  // })

  app.use('/web/api', router)
}
