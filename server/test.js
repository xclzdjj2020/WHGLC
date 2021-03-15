const moment = require('moment') //时间库
const axios = require('axios')
const url = 'http://180.167.227.14/ydxx/doe.ydxx.service2018/GPServer.asmx/GetCheckRoutePoint'

async function abc() {
  let res1 = await axios.post(url, {
    begindate: '2021-01-12',
    enddate: '2021-01-12',
    routeid: '37C231B7-3CE0-4A34-BA40-89BD12E76AE5',
    pageNumber: 1,
    pageSize: 50,
  })
  let res2 = await axios.post(url, {
    begindate: '2021-01-12',
    enddate: '2021-01-12',
    routeid: '37C231B7-3CE0-4A34-BA40-89BD12E76AE5',
    pageNumber: 2,
    pageSize: 50,
  })
  // console.log(JSON.parse(res1.data.d))
  // console.log(JSON.parse(res2.data.d))
  let result = JSON.parse(res1.data.d).rows.concat(JSON.parse(res2.data.d).rows)
  console.log(result[0].username)
}

abc()
const data = moment().format('YYYY-MM-DD')
console.log(data > '2021-03-12')
