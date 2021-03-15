//处理数据
module.exports = async data => {
  const SsdwdmName = require('../models/SsdwdmName')
  const DigitalFlop = require('../models/DigitalFlop') //展示巡检时长信息的表
  const CenterSwiper = require('../models/CenterSwiper') //左侧轮播图信息
  const SelectTable = require('../models/SelectTable') //右侧表格信息
  const PieRight = require('../models/PieRight') //饼图
  const moment = require('moment')
  const seconds = require('./secondsTo')

  let userCheckedNum = {
    danChecked: 0,
    timeChecked6_8: 0,
    timeChecked8_10: 0,
    timeChecked10_12: 0,
    timeChecked13_15: 0,
    timeChecked15_17: 0,
    timeCheckedOthers: 0,
  } //巡检点位时间分类 饼图
  let AllPersonSeconds = 0 //记录巡线人员时长合
  let centerItem = [] // 左侧轮播图信息

  //数据暂存
  let DigitalFlopData = [
    {
      xxNumber: 0, //巡线总人数
      heNumber: 0, //合格人数
      noheNumber: [], //不合格人信息
      percent: '0%', //合格百分比
      avgtimelong: '00:00', //平均时长
    },
    {
      kyNumber: 0, //盾构跨越总人数
      heNumber: 0, //合格人数
      noheNumbe: [], //不合格人信息
      percent: '0%', //合格百分比
    },
  ]

  //第一步 取得所有数据
  const result = await SsdwdmName.find()
    .populate({
      path: 'querycheckstatics',
      match: { checktime: data },
      populate: {
        path: 'getcheckroutepoint',
        match: { checktime: data },
      },
    })
    .lean()
  console.log('开始处理数据')
  //第二步 处理数据
  result.forEach(item_r1 => {
    let allbasecount = 0 //站队所有应巡点 计算站队巡检率
    let allcheckdcount = 0 //站队所有已巡点
    let tempnochecknumber = 0 //每个站队巡检不合格人员人数,每轮清0

    let amstart = '00:00:00'
    let amend = '00:00:00'
    let pmstart = '00:00:00'
    let pmend = '00:00:00'

    //判断巡线员 或 跨越盾构人员
    item_r1.querycheckstatics.forEach(item_r2 => {
      allbasecount += item_r2.basecount
      allcheckdcount += item_r2.checkedcount

      item_r2.getcheckroutepoint.forEach(async item_r3 => {
        //是跨越或盾构 应巡点为4个点或8个点 且属于 忠县或红岩寺或榔坪或长阳或枝江
        if (
          (item_r2.basecount === 4 || item_r2.basecount === 8) &&
          (item_r2.ssdwdm === '276043923456' ||
            item_r2.ssdwdm === '276027146240' ||
            item_r2.ssdwdm === '276060700672' ||
            item_r2.ssdwdm === '276031340544' ||
            item_r2.ssdwdm === '276064894976')
        ) {
          //是跨越盾构 这里处理数据
          //统计跨越总人数
          DigitalFlopData[1].kyNumber += 1
          //合格人数 巡检率100%
          if (item_r2.checkedcount < item_r2.basecount) {
            tempnochecknumber += 1 //本轮当前站队不合格人员+1
            //不合格人数信息存入
            DigitalFlopData[1].noheNumbe.push({
              departmentname: item_r2.departmentname, //站队
              username: item_r3.username, //姓名
              basecount: item_r2.basecount, //应巡点
              checkedcount: item_r2.checkedcount, //已巡点
              uncount: item_r2.basecount - item_r2.checkedcount, //未巡点
              percent: item_r2.percent, //巡检率
              reason: '巡检率未达到100%', //原因
            })
          }
        } else {
          //不是跨越 这里处理数据
          //统计巡检总人数
          DigitalFlopData[0].xxNumber += 1
          //所有人时长合 单位秒
          AllPersonSeconds += seconds.timelongtosecond(item_r3.ampmtimelong)

          userCheckedNum.danChecked += item_r3.amchecktime.length //所有巡线的点位上午
          userCheckedNum.danChecked += item_r3.pmchecktime.length //所有巡线的点位下午

          //合格人数
          //全天时长<3小时 下午时长 <30分钟 巡检率小于100
          if (
            item_r2.checkedcount < item_r2.basecount ||
            item_r3.ampmtimelong < '03:00:00' ||
            item_r3.pmtimelong < '00:30:00'
          ) {
            tempnochecknumber += 1 //本轮当前站队不合格人员+1

            DigitalFlopData[0].noheNumber.push({
              date: data,
              departmentname: item_r2.departmentname, //站队
              username: item_r3.username, //姓名
              basecount: item_r2.basecount, //应巡点
              checkedcount: item_r2.checkedcount, //已巡点
              uncount: item_r2.basecount - item_r2.checkedcount, //未巡点
              percent: item_r2.percent, //巡检率
              pmtimelong: item_r3.pmtimelong, //下午时长
              ampmtimelong: item_r3.ampmtimelong, //全天时长
              reason: '',
            })
          }

          //判断巡检点位时段 上午时段
          //第4轮循环
          //checktime pointname
          if (item_r3.amchecktime.length !== 0) {
            item_r3.amchecktime.forEach(chick_item => {
              let t = chick_item.checktime.split(' ')[1]
              if (t >= '06:00:00' && t < '08:00:00') {
                userCheckedNum.timeChecked6_8 += 1
              } else if (t >= '08:00:00' && t < '10:00:00') {
                userCheckedNum.timeChecked8_10 += 1
              } else if (t >= '10:00:00' && t < '12:00:00') {
                userCheckedNum.timeChecked10_12 += 1
              } else {
                userCheckedNum.timeCheckedOthers += 1
              }
            })
          }

          //判断巡检点位时段 下午时段
          //第4轮循环
          //checktime pointname
          if (item_r3.pmchecktime.length !== 0) {
            item_r3.pmchecktime.forEach(chick_item => {
              let t = chick_item.checktime.split(' ')[1]
              if (t >= '13:00:00' && t < '15:00:00') {
                userCheckedNum.timeChecked13_15 += 1
              } else if (t >= '15:00:00' && t < '17:00:00') {
                userCheckedNum.timeChecked15_17 += 1
              } else {
                userCheckedNum.timeCheckedOthers += 1
              }
            })
          }
        }

        //更新右侧表格数据
        if (item_r3.amchecktime.length != 0) {
          amstart = item_r3.amchecktime[item_r3.amchecktime.length - 1].checktime.split(' ')[1]
          amend = item_r3.amchecktime[0].checktime.split(' ')[1]
          // console.log(amstart, amend, item_r2.departmentname, item_r3.username)
        } else {
          amstart = '00:00:00'
          amend = '00:00:00'
        }

        if (item_r3.pmchecktime.length != 0) {
          pmstart = item_r3.pmchecktime[item_r3.pmchecktime.length - 1].checktime.split(' ')[1]
          pmend = item_r3.pmchecktime[0].checktime.split(' ')[1]
          // console.log(pmstart, pmend, item_r2.departmentname, item_r3.username)
        } else {
          pmstart = '00:00:00'
          pmend = '00:00:00'
        }

        //右侧表格数据存入数据库
        await SelectTable.updateOne(
          {
            $and: [{ checktime: data }, { routeid: item_r2.routeid }],
          },
          {
            departmentname: item_r2.departmentname,
            ssdwdm: item_r2.ssdwdm,
            username: item_r3.username,
            routeid: item_r2.routeid,
            routename: item_r2.routename,
            basecount: item_r2.basecount,
            checkedcount: item_r2.checkedcount,
            scheckedcount: item_r2.scheckedcount,
            percent: item_r2.percent,
            amtimelong: item_r3.amtimelong,
            pmtimelong: item_r3.pmtimelong,
            amstart,
            amend,
            pmstart,
            pmend,
            ampmtimelong: item_r3.ampmtimelong,
            checktime: item_r2.checktime,
            checkps: '',
          },
          {
            upsert: true,
          }
        )
      })
    })

    // 左侧轮播图数据
    centerItem.push({
      perstatus: Math.round((allcheckdcount / allbasecount) * 1000) / 10, //站队巡检率
      name: item_r1.name, //站队名
      ssdwdm: item_r1.ssdwdm,
      total: item_r1.total,
      id: item_r1._id,
      number: tempnochecknumber, //不合格人数
      data: data, //日期
    })
  })

  //巡线合格人数
  DigitalFlopData[0].heNumber = DigitalFlopData[0].xxNumber - DigitalFlopData[0].noheNumber.length
  //巡线合格百分比
  DigitalFlopData[0].percent = Math.round((DigitalFlopData[0].heNumber / DigitalFlopData[0].xxNumber) * 1000) / 10 + '%'
  //巡线所有人平均时长
  DigitalFlopData[0].avgtimelong = seconds.secondsTo(parseInt(AllPersonSeconds / DigitalFlopData[0].xxNumber))
  //跨越巡检合格人数
  DigitalFlopData[1].heNumber = DigitalFlopData[1].kyNumber - DigitalFlopData[1].noheNumbe.length
  //跨越合格百分比
  DigitalFlopData[1].percent = Math.round((DigitalFlopData[1].heNumber / DigitalFlopData[1].kyNumber) * 1000) / 10 + '%'

  //第三步 得到所有数据后 存入相应表
  //更新上部分信息统计表格数据
  await DigitalFlop.updateOne(
    { checktime: data }, //根据时间更新
    {
      checkTotalNumber: DigitalFlopData[0].xxNumber, //巡线总人数
      checkQuTotalNumber: DigitalFlopData[0].heNumber, //巡线合格人数
      checkUnquTotalNumber: DigitalFlopData[0].noheNumber, //巡线未合格人员信息
      checkQuPercent: DigitalFlopData[0].percent, //巡线合格百分比
      avgTime: DigitalFlopData[0].avgtimelong, //巡线平均时长
      bridgeTotalNumber: DigitalFlopData[1].kyNumber, //跨越盾构总人数
      bridgeQuTotalNumber: DigitalFlopData[1].heNumber, //跨越盾构合格人数
      bridgeUnquTotalNumber: DigitalFlopData[1].noheNumbe, //跨越盾构未合格人员信息
      bridgekQuPercent: DigitalFlopData[1].percent, //跨越盾构合格百分比
      checktime: data,
    },
    { upsert: true }
  )
  console.log(`巡线人数:${DigitalFlopData[0].xxNumber} | 跨越人数:${DigitalFlopData[1].kyNumber}`)
  //更新左侧轮播图数据
  await CenterSwiper.updateOne(
    { checktime: data },
    {
      CenterItem: centerItem,
      checktime: data,
    },
    { upsert: true }
  )

  //更新饼图数据
  await PieRight.updateOne(
    { checktime: data },
    {
      danChecked: userCheckedNum.danChecked,
      timeChecked6_8: userCheckedNum.timeChecked6_8,
      timeChecked8_10: userCheckedNum.timeChecked8_10,
      timeChecked10_12: userCheckedNum.timeChecked10_12,
      timeChecked13_15: userCheckedNum.timeChecked13_15,
      timeChecked15_17: userCheckedNum.timeChecked15_17,
      timeCheckedOthers: userCheckedNum.timeCheckedOthers,
      checktime: data,
    },
    { upsert: true }
  )

  console.log(`数据处理完成 | ${moment().format('HH:mm:ss')}`)
}
