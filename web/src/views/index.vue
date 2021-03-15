<template>
  <div id="data-view">
    <dv-full-screen-container>
      <!-- 头部 -->
      <top-header />

      <!-- 主体 -->
      <div class="main-content">
        <digital-flop></digital-flop>
        <!-- 贯穿线 -->
        <dv-decoration-10 />
        <!-- 站队排名 -->
        <div class="block-left-right-content">
          <!-- 表格1 -->
          <!-- <scrollBoard :notqperson="notqperson" /> -->

          <div class="block-center-content">
            <!-- 左边- 上部分 轮播图 -->
            <centerSwiper />
            <!-- 左边 下部分 巡检时段占比 饼图 -->
            <pieRight />
          </div>
          <div class="right-left">
            <!-- 右侧 分页签 表格 -->
            <selectTable />
          </div>
          <!-- 表格2 -->
          <!-- <scrollBoardRight :categoryItem="categoryItem" /> -->
        </div>
      </div>
      <!-- footer -->
      <buttom-footer />
    </dv-full-screen-container>
  </div>
</template>

<script>
import topHeader from './indexChild/topHeader' //头部
import digitalFlop from './indexChild/digitalFlop' //巡检人员统计
// import scrollBoard from './indexChild/scrollBoard' //未巡检人员名单
// import scrollBoardRight from './indexChild/scrollBoardRight' //站队列表
import pieRight from './indexChild/pieRight' //巡段时段占比 饼图
import centerSwiper from './indexChild/centerSwiper' //中间轮播图
import buttomFooter from './indexChild/buttomFooter' //footer
import selectTable from './indexChild/selectTable' //footer

export default {
  components: {
    topHeader,
    digitalFlop,
    // scrollBoard,
    // scrollBoardRight,
    pieRight,
    centerSwiper,
    buttomFooter,
    selectTable,
  },
}
</script>

<style lang="scss" scoped>
#data-view {
  width: 100%;
  height: 100%;
  background-color: #030409;
  color: #fff;

  #dv-full-screen-container {
    background-image: url('../assets/img/bg.png');
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
  }

  //主体
  .main-content {
    // flex: 1;
    display: flex;
    flex-direction: column;

    .dv-decoration-10 {
      margin-top: 7px;
      width: 100%;
      height: 5px;
    }

    .block-left-right-content {
      display: flex;
      height: 750px;
      .block-center-content {
        box-sizing: border-box;
      }
    }
  }
}
</style>
