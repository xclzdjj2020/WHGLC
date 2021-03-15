<template>
  <div id="pie-right">
    <dv-border-box-10>
      <h2 style="text-align:center; color:#ffeb7b;margin-top:15px;">巡检时段统计</h2>
      <div class="chart" ref="pieEcharts"></div>
    </dv-border-box-10>
  </div>
</template>

<script>
import moment from 'moment'

import io from 'socket.io-client'
const socket = io('http://localhost:5001')
export default {
  // props: {
  //   userCheckedNum: {
  //     type: Object,
  //   },
  // },
  watch: {
    userCheckedNum: {
      handler: function(nVal, oVal) {
        if (nVal) {
          this.pieCharts(nVal)
        }
      },
      deep: true, //对象里的属性值变化检测
    },
  },
  data() {
    return {
      timer: null, //定时器名称
      userCheckedNum: {},
    }
  },
  created() {
    this.getPieRight(moment().format('YYYY-MM-DD'))

    socket.on('message', () => {
      this.getPieRight(moment().format('YYYY-MM-DD'))
      console.log('pieRight组件 饼图收到消息!')
    })
  },
  mounted() {
    this.pieCharts(this.userCheckedNum)
    //日期传过来时触发
    this.$bus.$on('changeDate', res => {
      // this.$nowData = res
      this.getPieRight(res)
    })
  },

  methods: {
    //请求数据
    async getPieRight(tempDate = moment().format('YYYY-MM-DD')) {
      const res = await this.$http.get(`index/pieright/${tempDate}`)
      this.userCheckedNum = res.data[0]
    },

    pieCharts(val) {
      const myCharts = this.$echarts.init(this.$refs.pieEcharts)

      const options = {
        title: {
          text: String(val.danChecked), //主标题文本，'\n'指定换行
          //副标题
          subtext: '{b|点位/个}', //针对subtextStyle/rich设置
          top: '49%',
          left: '42%',

          textStyle: {
            //设置主标题
            fontSize: 50,
            color: '#ffeb7b',
            fontFamily: 'electronicFont',
            fontWeight: 900,
          },
          subtextStyle: {
            //设置副标题
            lineHeight: 10,
            rich: {
              // a: {
              //   color: 'red',
              //   fontSize: 18,
              // },
              b: {
                color: 'pink',
                fontSize: 16,
                // align: right,
                fontFamily: 'electronicFont',
                padding: 25,
              },
            },
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          //图例
          orient: 'horizontal', //垂直显示还是水平显示
          itemGap: 24, // 设置legend的间距
          left: 20, //legend相对位置
          top: '3%', //legend相对位置
          // 距离底部为0%
          // bottom: "0%",
          // 修改图例组件的文字为 12px
          textStyle: {
            color: 'rgba(255,255,255,.5)',
            fontSize: '15',
          },
          //这里的data name要与series中data中的name名字一样,才能匹配
          data: [
            { name: '上午6:00-8:00' },
            { name: '上午8:00-10:00' },
            { name: '上午10:00-12:00' },
            { name: '下午13:00-15:00' },
            { name: '下午15:00-17:00' },
            { name: '其它时间段' },
          ],
        },
        series: [
          {
            name: '巡检时段',
            type: 'pie',
            radius: ['40%', '55%'], //饼图内外圈大小
            center: ['50%', '55%'], //饼图位置
            avoidLabelOverlap: false,
            //显示的文字大小
            label: {
              // 在饼图扇区内显示
              // normal: {
              //   show: true,
              //   position: 'inner',
              //   formatter: '{d} + %',
              //   fontSize: 14,
              // },

              fontSize: 17, //设置线旁边的文字
              fontWeight: 'bold', //设置线旁边的文字
              //线上显示的文字 formatter:'{d}%' 可以显示百分比，但不能显示文字
              formatter: params => {
                return params.name + '\n' + '占比:' + params.percent + '%'
              },
            },
            //当鼠标停留时，显示的字体样式
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold',
              },
            },
            //设置显示的连线
            labelLine: {
              length: 25, //1段线长度
              length2: 60, //2段线的长度
              //   normal: {
              //     length: 15,
              //     length2: 100, //线的长度
              //     lineStyle: {
              //       color: '#e6e6e6', //连线的颜色
              //     },
              //   },
            },
            color: ['#C23531', '#e6cf4e', '#20d180', '#0093ff', '#EB8146', '#f36c6c'],
            //设置数据
            data: [
              { value: val.timeCheckedOthers, name: '其它时间段' },
              { value: val.timeChecked6_8, name: '上午6:00-8:00' },
              { value: val.timeChecked8_10, name: '上午8:00-10:00' },
              { value: val.timeChecked10_12, name: '上午10:00-12:00' },
              { value: val.timeChecked13_15, name: '下午13:00-15:00' },
              { value: val.timeChecked15_17, name: '下午15:00-17:00' },
            ],
          },
        ],
      }
      myCharts.setOption(options)
    },
  },
}
</script>

<style lang="scss" scoped>
#pie-right {
  height: 524px;
  width: 750px;
  margin-top: 10px;
  // margin-right: 15px;
  margin-left: 15px;
  .dv-border-box-10 {
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    .chart {
      height: 100%;
      // width: 100%;
    }
  }
}
</style>
