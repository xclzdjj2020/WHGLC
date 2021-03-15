<template>
  <div id="scroll-board-right">
    <h3 style="text-align:center">各站基本信息</h3>
    <dv-scroll-board :config="config" style="height:700px" @mouseover="rowdata" />
  </div>
</template>

<script>
export default {
  props: {
    categoryItem: {
      type: Array,
    },
  },
  watch: {
    categoryItem(val) {
      let nowData = this.config
      nowData.data = val
      this.config = { ...nowData }
    },
  },
  data() {
    return {
      // option: {
      //   title: {
      //     //用来显示图表的标题，你可以配置该项来设置其位置和样式
      //     // text: '巡检率', //标题文本
      //     // offset: [0, 0], //标题偏移
      //     style: {
      //       //标题默认样式
      //       fill: '#ffeb7b',
      //     },
      //   },
      //   series: [
      //     {
      //       radius: '70%', //圆半径
      //       type: 'gauge', //类型
      //       startAngle: -Math.PI / 2, //仪表盘起始角度（弧度值）
      //       endAngle: Math.PI * 1.5, // 仪表盘结束角度（弧度值）
      //       arcLineWidth: 7, //圆宽度

      //       data: [{ name: 'itemA', value: 65, gradient: ['#03c2fd', '#1ed3e5', '#2fded6'] }],
      //       axisLabel: {
      //         //坐标标签配置项
      //         show: false, //是否显示
      //       },
      //       axisTick: {
      //         //坐标刻度配置项
      //         show: false,
      //       },
      //       pointer: {
      //         //仪表盘指针配置项
      //         show: false,
      //       },
      //       dataItemStyle: {
      //         lineCap: 'round',
      //       },
      //       details: {
      //         //Data子元素构成的圆弧的详情的配置项
      //         show: true,
      //         formatter: '{value}%', //详情内容格式化
      //         style: {
      //           //详情样式
      //           fill: '#1ed3e5',
      //           fontSize: 35,
      //         },
      //       },
      //     },
      //   ],
      // },
      config: {
        header: ['日期', '站队', '总人数', '巡检率'],
        data: [],
        index: true, //编号
        columnWidth: [50, 100, 120, 95], //列宽度
        align: ['center', 'center', 'center', 'center'], //每列对齐方式
        rowNum: 14, // 表行数
        // indexHeader: '编号',
        headerBGC: '#DC3545', // 表头背景色
        headerHeight: 40, //表头高度
        oddRowBGC: 'rgba(0, 44, 81, 0.8)', // 奇数行背景色
        evenRowBGC: 'rgba(10, 29, 50, 0.8)', // 偶数行背景色
        waitTime: 5000, // 轮播时间间隔(ms)
        carousel: 'page', //轮播方式'single'|'page'
      },
    }
  },
  methods: {
    //鼠标悬停
    rowdata(row) {
      // row.row[0]
      // row.row[0] = '<span class="index" style="background-color: #ffeb7b;">14</span>'
      // console.log(row)
    },
  },
}
</script>

<style lang="scss">
#scroll-board-right {
  width: 450px;
  height: 777px;
  box-sizing: border-box;
  margin-left: 15px;
  // height: 90%;
  h3 {
    margin: 10px 0;
  }
  .dv-scroll-board {
    .row:hover {
      .row-item {
        background-color: red !important;
      }
    }
  }
}
</style>
