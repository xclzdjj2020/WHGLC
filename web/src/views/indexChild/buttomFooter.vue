<template>
  <div id="buttom-footer">
    <div class="inner">
      <ul>
        <li>
          <div class="block">
            <span class="demonstration">日期 : </span>
            <el-date-picker
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              @change="getSTime"
              v-model="nowData"
            >
            </el-date-picker>
          </div>
        </li>
        <li>
          实时时间 :<span style="color:#FFFFFF;margin-left:7px;">{{ nowTime }}</span>
        </li>
        <li>更新频次 : <span style="color:#FFFFFF;margin-left:7px;">每30分钟更新</span></li>
        <li>
          末次更新时间 : <span style="color:#FFFFFF;margin-left:7px;">{{ timesTamp(uptime) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import io from 'socket.io-client'
const socket = io('http://localhost:5001')

export default {
  data() {
    return {
      nowTime: '', //实时时间
      nowData: moment().format('YYYY-MM-DD'), //绑定日期
      uptime: 0, //更新时间
      timer: null, //定时器名称
      tempData: '', //临时存放的日期
    }
  },
  created() {
    this.getupdatedAt(moment().format('YYYY-MM-DD'))

    socket.on('message', () => {
      this.getupdatedAt(moment().format('YYYY-MM-DD'))
      this.nowData = moment().format('YYYY-MM-DD')
      console.log('buttomFooter组件 底部收到消息!')
    })
  },
  mounted() {
    this.nowTimes()
  },

  methods: {
    //请求数据
    async getupdatedAt(data) {
      const res = await this.$http.get(`index/pieright/${data}`)
      this.uptime = res.data[0].updatedAt
    },
    //时间戳转日期时间 2020-06-18 10:33:24
    timesTamp(timestamp) {
      var date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    },
    //实时显示当前时间（年月日时分秒）
    timeFormate(timeStamp) {
      let year = new Date(timeStamp).getFullYear()
      let month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? '0' + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1
      let date =
        new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()
      let hh =
        new Date(timeStamp).getHours() < 10 ? '0' + new Date(timeStamp).getHours() : new Date(timeStamp).getHours()
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? '0' + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes()
      let ss =
        new Date(timeStamp).getSeconds() < 10
          ? '0' + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds()
      this.nowTime = year + '年' + month + '月' + date + '日' + ' ' + hh + ':' + mm + ':' + ss
    },
    nowTimes() {
      this.timeFormate(new Date())
      setInterval(this.nowTimes, 1000)
      this.clear()
    },
    clear() {
      clearInterval(this.nowTimes)
      this.nowTimes = null
    },

    //日期改变时触发
    getSTime(val) {
      //如果选择的日期 大于现有日期则return
      if (val > moment().format('YYYY-MM-DD')) {
        alert('日期选择有误，请重新选择')
        this.nowData = this.tempData
        return
      }
      //日期改变时，临时存放改变的日期
      this.tempData = val
      this.$bus.$emit('changeDate', val) //传改变的日期
      this.getupdatedAt(val)
    },
  },
}
</script>

<style lang="scss" scoped>
#buttom-footer {
  margin-top: 10px;
}

::v-deep .inner {
  border-top: 3px solid #223a7e;
  ul {
    height: 55px;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    color: #fb5151;

    /* 设置日期选择器样式 */
    .el-input__inner {
      margin: 0 auto;
      width: 180px;
      height: 35px;
      // border: 2px solid #ffeb7b;
      background-color: #010d39 !important;
      .el-input__icon {
        line-height: 35px !important;
      }
    }
  }
}

::v-deep .inner ul .el-input__inner {
  color: #fff !important;
  font-size: 18px;
}
</style>
