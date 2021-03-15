module.exports = async data => {
  const axios = require('axios')
  const timeSpan = require('../utils/timeSpan')
  //个人巡检详细信息
  const personInfoUrl = 'http://180.167.227.14/ydxx/doe.ydxx.service2018/GPServer.asmx/GetCheckRoutePoint'
  //个人巡检详细信息模型
  const GetCheckRoutePoint = require('../models/GetCheckRoutePoint')
  //站队详细信息模型
  const QueryCheckStatics = require('../models/QueryCheckStatics')

  const allpersons = await QueryCheckStatics.find({ checktime: data }) //调出当天存入的所有人员
  // console.log(
  //   '第4步，取出所有人员信息===================================================================================='
  // )
  //请求个人详细巡检
  for (let i = 0; i < allpersons.length; i++) {
    let peronres
    //判断有的人员巡检点较多,需要2次请求才能全部请求到数据
    if (
      allpersons[i].ssdwdm === '275955843072' ||
      allpersons[i].ssdwdm === '276022951936' ||
      allpersons[i].ssdwdm === '276035534848'
    ) {
      //第1次请求
      let res_first = await axios.post(personInfoUrl, {
        begindate: data,
        enddate: data,
        routeid: allpersons[i].routeid,
        pageNumber: 1,
        pageSize: 50,
      })
      //第2次请求
      let res_second = await axios.post(personInfoUrl, {
        begindate: data,
        enddate: data,
        routeid: allpersons[i].routeid,
        pageNumber: 2,
        pageSize: 50,
      })
      //2次请求的数据合成1个数组
      peronres = JSON.parse(res_first.data.d).rows.concat(JSON.parse(res_second.data.d).rows)
      // console.log('我是2次请求的站队', peronres)
    } else {
      let res = await axios.post(personInfoUrl, {
        begindate: data,
        enddate: data,
        routeid: allpersons[i].routeid,
        pageNumber: 1,
        pageSize: 50,
      })
      peronres = JSON.parse(res.data.d).rows
    }

    // console.log(
    //   '第5步,正在请求个人详细巡检==============================================================================='
    // )

    let amchecktime = [] //上午巡检点位名称 时长
    let pmchecktime = [] //下午巡检点位名称 时长
    //每个人巡检的所有点数组
    peronres.forEach(item => {
      const checktime = item.checktime.split(' ').pop()
      //判断上下午时间
      checktime <= '12:00:00'
        ? amchecktime.push({ pointname: item.pointname, checktime: item.checktime })
        : pmchecktime.push({ pointname: item.pointname, checktime: item.checktime })
    })
    //计算时长
    const [amtimelong, amlognseconds] = await timeSpan(amchecktime) //上午时长
    const [pmtimelong, pmlognseconds] = await timeSpan(pmchecktime) //下午时长
    const [ampmtimelong] = await timeSpan(amlognseconds + pmlognseconds) //总时长
    // console.log('第6步，计算时长完成=============================================================================')

    // const username
    allpersons[i].checkedcount === 0 ? (username = '未巡检') : (username = peronres[0].username)
    //存入表GetCheckRoutePoint
    const result = await GetCheckRoutePoint.updateOne(
      { $and: [{ checktime: data }, { routeid: allpersons[i].routeid }] },
      {
        amchecktime,
        pmchecktime,
        amtimelong,
        pmtimelong,
        ampmtimelong,
        username: username,
        routeid: allpersons[i].routeid,
        querycheckstatics: allpersons[i]._id,
      },
      { upsert: true }
    )
    console.log(`${allpersons[i].departmentname}:${username} update success | Number:${i + 1}`)
  }
}
