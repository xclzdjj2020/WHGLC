<template>
  <div id="scroll-board">
    <h3 style="text-align:center">巡线人员未合格</h3>
    <dv-scroll-board :config="config" style="height:790px" />
  </div>
</template>

<script>
export default {
  props: {
    notqperson: {
      type: Array,
    },
  },
  watch: {
    //监听的数据赋值给data
    notqperson(val) {
      let nowData = this.config
      nowData.data = val
      this.config = { ...nowData }
    },
  },
  data() {
    return {
      config: {
        header: ['日期', '巡检人员', '所属站队', '原因'],
        data: [],
        index: true, //编号
        columnWidth: [50, 100, 90, 95], //列宽度
        align: ['center', 'center', 'center', 'center', 'center'], //每列对齐方式
        rowNum: 15, // 表行数
        // indexHeader: '编号',
        headerBGC: '#1981f6', // 表头背景色
        headerHeight: 40, //表头高度
        oddRowBGC: 'rgba(0, 44, 81, 0.8)', // 奇数行背景色
        evenRowBGC: 'rgba(10, 29, 50, 0.8)', // 偶数行背景色
        waitTime: 2000, // 轮播时间间隔(ms)
      },
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
#scroll-board {
  width: 480px;
  height: 745px;
  box-sizing: border-box;
  margin-left: 15px;
  // height: 90%;
  overflow: hidden;
  h3 {
    margin: 10px 0;
  }
}
</style>
