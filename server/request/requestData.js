const axios = require('axios')
const moment = require('moment') //时间库

//站队基本信息
const ssdwdmName = [
  { ssdwdm: 275955843072, name: '利川保护站' }, //超过50个点位的
  { ssdwdm: 275960037376, name: '十堰分输站' },
  { ssdwdm: 275964231680, name: '武穴分输压气站' },
  { ssdwdm: 275968425984, name: '红安管护站' },
  { ssdwdm: 275972620288, name: '宜城分输站' },
  { ssdwdm: 275976814592, name: '潜江分输站' },
  { ssdwdm: 275981008896, name: '武汉西分输站' },
  { ssdwdm: 275989397504, name: '襄樊分输站' },
  { ssdwdm: 275993591808, name: '仙桃分输站' },
  { ssdwdm: 276001980416, name: '黄陂联络压气站' },
  { ssdwdm: 276010369024, name: '荆州分输站' },
  { ssdwdm: 276014563328, name: '武汉东分输站' },
  { ssdwdm: 276018757632, name: '鄂州分输站' },
  { ssdwdm: 276022951936, name: '江北分输站' }, //超过50个点位的
  { ssdwdm: 276027146240, name: '红岩寺保护站' },
  { ssdwdm: 276031340544, name: '长阳分输站' },
  { ssdwdm: 276039729152, name: '随州分输站' },
  { ssdwdm: 276035534848, name: '孝感分输站' }, //超过50个点位的
  { ssdwdm: 276043923456, name: '忠县分输站' },
  { ssdwdm: 276048117760, name: '枣阳分输压气站' },
  { ssdwdm: 276052312064, name: '恩施分输站' },
  { ssdwdm: 276056506368, name: '监利分输站' },
  { ssdwdm: 276060700672, name: '榔坪分输站' },
  { ssdwdm: 276064894976, name: '枝江分输站' },
  { ssdwdm: 276069089280, name: '荆门分输站' },
  { ssdwdm: 276073283584, name: '黄冈分输站' },
  { ssdwdm: 276077477888, name: '仙人渡分输站' },
]
//站队详细信息
const personUrl = 'http://180.167.227.14/ydxx/doe.ydxx.service2018/GPServer.asmx/QueryCheckStatics'

//站队基本信息模型
const SsdwdmName = require('../models/SsdwdmName')
//站队详细信息模型
const QueryCheckStatics = require('../models/QueryCheckStatics')

module.exports = async data => {
  //把站队id,和name 插入到表中
  //更新站队名和站队id
  for (let i = 0; i < ssdwdmName.length; i++) {
    await SsdwdmName.updateOne(
      { ssdwdm: ssdwdmName[i].ssdwdm },
      {
        ssdwdm: ssdwdmName[i].ssdwdm,
        name: ssdwdmName[i].name,
      },
      { upsert: true }
    )
    console.log(`id ${ssdwdmName[i].name} update success`)
  }

  // const data = '2021-01-05' //统计哪天
  const allData = await SsdwdmName.find() //调出所有站队
  //根据id 请求到站队基本人员信息
  for (let k = 0; k < allData.length; k++) {
    let result = await axios.post(personUrl, {
      begindate: data,
      enddate: data,
      ssdwdm: allData[k].ssdwdm,
      pageNumber: 1,
      pageSize: 50,
      isdanger: 0,
    })
    let resData = JSON.parse(result.data.d) //转成json格式

    //如果应巡点为0 ,不计入total中
    let newtotal = resData.rows.length
    resData.rows.forEach(async item => {
      if (item.basecount == 0) {
        // console.log(item.routename, item.departmentname)
        newtotal -= 1
      }
    })
    //把total值插入SsdwdmName表 查询条件按照ssdwdm
    await SsdwdmName.updateOne({ ssdwdm: resData.rows[0].ssdwdm }, { total: newtotal })
    console.log(`total ${allData[k].name}:${newtotal} update success`)

    //站队人员基本信息存入数据库
    resData.rows.forEach(async item => {
      //如果应巡点为0,跳过
      if (item.basecount === 0) return
      await QueryCheckStatics.updateOne(
        { $and: [{ checktime: data }, { routeid: item.routeid }] },
        {
          basecount: item.basecount,
          checkedcount: item.checkedcount,
          scheckedcount: item.scheckedcount,
          checktime: data,
          percent: item.percent,
          routename: item.routename,
          ssdwdm: item.ssdwdm,
          departmentname: item.departmentname,
          routeid: item.routeid,
          ssdwdmname: allData[k]._id,
        },
        { upsert: true }
      )
    })
    // console.log(
    //   '第3步，站队人员基本信息存入数据库完成＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝'
    // )
  }

  await require('./requestPerson')(data)
}

// 分输站：利川保护站|275955843072   1
// 分输站：十堰分输站|275960037376
// 分输站：武穴分输压气站|275964231680
// 分输站：红安管护站|275968425984
// 分输站：宜城分输站|275972620288
// 分输站：潜江分输站|275976814592
// 分输站：武汉西分输站|275981008896
// 分输站：襄樊分输站|275989397504
// 分输站：仙桃分输站|275993591808
// 分输站：黄陂联络压气站|276001980416
// 分输站：宜昌分输站|276006174720
// 分输站：荆州分输站|276010369024
// 分输站：武汉东分输站|276014563328
// 分输站：鄂州分输站|276018757632
// 分输站：江北分输站|276022951936   1
// 分输站：红岩寺保护站|276027146240
// 分输站：长阳分输站|276031340544
// 分输站：孝感分输站|276035534848
// 分输站：随州分输站|276039729152
// 分输站：忠县分输站|276043923456
// 分输站：枣阳分输压气站|276048117760
// 分输站：恩施分输站|276052312064
// 分输站：监利分输站|276056506368
// 分输站：榔坪分输站|276060700672
// 分输站：枝江分输站|276064894976
// 分输站：荆门分输站|276069089280
// 分输站：黄冈分输站|276073283584
// 分输站：仙人渡分输站|276077477888
