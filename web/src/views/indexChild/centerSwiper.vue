<template>
  <div id="center-swiper">
    <!-- interval轮播时间 -->
    <!-- indicator-position显示隐藏指示器 -->
    <!-- direction跑马灯方向 -->
    <el-carousel
      :interval="5000"
      height="200px"
      ref="carousel"
      indicator-position="none"
      direction="vertical"
      @change="
        (pre, next) => {
          change(pre, next)
        }
      "
    >
      <el-carousel-item v-for="(item, index) in centerItem" :key="index">
        <dv-border-box-12>
          <div class="dv12inner">
            <div class="nav-left" ref="navleft">
              <div class="icon" :class="iscolor"><i :class="isicon"></i></div>
              <div class="perstatus" ref="perstatus">巡检率:{{ item.perstatus }}%</div>
            </div>
            <div class="nav-center"></div>
            <div class="nav-right">
              <div class="data">
                <div class="data1"></div>
                <div class="data2"></div>
                <div class="data-top">巡检日期</div>
                <div class="data-buttom">{{ item.data }}</div>
              </div>
              <div class="name">{{ item.name }}</div>

              <h4 class="allperson"><i class="iconfont icon-renshu"></i>巡检总人数: {{ item.total }}人</h4>
              <h4 class="person-num"><i class="iconfont icon-hege"></i>合格人数: {{ item.total - item.number }}人</h4>
              <h4 class="person-nonum">
                <i class="iconfont icon-buhegepinunqualified"></i>未合格人数: {{ item.number }}人
              </h4>
              <!-- <div>{{ item.ssdwdm }}</div>
              <div>{{ item.id }}</div> -->
            </div>
          </div>
        </dv-border-box-12>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import '../../assets/font/iconfont.css' //字体图标
import '../../assets/font/font_swiper/iconfont.css' //字体图标 笑脸

import moment from 'moment'
import io from 'socket.io-client'
const socket = io('http://localhost:5001')

// el-carousel__item is-active el-carousel__item--card is-in-stage
export default {
  data() {
    return {
      timer: null, //定时器名称
      // percentage: null,
      iscolor: '',
      isicon: '',
      centerItem: [],
    }
  },
  created() {
    this.getCenterSwiper(moment().format('YYYY-MM-DD'))

    socket.on('message', () => {
      this.getCenterSwiper(moment().format('YYYY-MM-DD'))
      console.log('centerSwiper组件 左侧轮播图收到消息!')
    })
  },
  mounted() {
    //日期传过来时触发
    this.$bus.$on('changeDate', res => {
      // this.$nowData = res
      this.getCenterSwiper(res)
    })
  },

  methods: {
    //请求数据
    async getCenterSwiper(tempDate = moment().format('YYYY-MM-DD')) {
      const res = await this.$http.get(`index/centersiper/${tempDate}`)
      this.centerItem = res.data[0].CenterItem
    },

    //根据巡检率更换图标 颜色
    change(pre, next) {
      //取节点内容
      let innervalue = this.$refs.perstatus[pre].innerText
        .split(':')
        .pop()
        .replace('%', '')
      // this.$refs.navleft[pre].children[0].style.color = '#fd0100'
      // this.$refs.perstatus[pre].style.backgroundColor = '#ffeb7b' //利用refs设置style
      if (Number(innervalue) >= 100) {
        this.iscolor = 'colorgreen'
        this.isicon = 'iconfont icon-icon-xiaolian'
      } else if (innervalue < 100 && innervalue >= 75) {
        this.iscolor = 'coloryellow'
        this.isicon = 'iconfont icon-_kulian'
      } else if (innervalue < 75 && innervalue >= 50) {
        this.iscolor = 'colorred'
        this.isicon = 'iconfont icon-_kulian'
      } else {
        this.iscolor = 'colordarkgray'
        this.isicon = 'iconfont icon-_kulian'
      }
    },
  },
}
</script>

<style lang="scss">
#center-swiper {
  width: 750px;
  height: 200px;
  margin-left: 15px;
  margin-top: 10px;
  box-sizing: border-box;
  cursor: pointer;

  .dv12inner {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    .nav-left {
      width: 200px;
      height: 150px;
      .perstatus {
        position: absolute;
        top: 145px;
        right: 0;
        bottom: 0px;
        left: 55px;
        font-size: 18px;
      }

      i {
        position: absolute;
        top: 20px;
        right: 0;
        bottom: 0;
        left: 47px;
        font-size: 120px;
      }
    }
    .nav-center {
      width: 2px;
      height: 160px;
      margin-top: 20px;
      // margin-left: 60px;
      margin-right: 40px;
      background-color: rgba(211, 225, 248, 0.5);
    }
    .nav-right {
      // font-family: 'electronicFont';
      color: #ffeb7b;
      font-size: 18px;
      .name {
        margin-top: 10px;
        font-size: 40px;
        font-weight: 900;
        color: #fd0100;
      }

      .allperson {
        margin-top: 10px;
      }
      .person-num {
        color: greenyellow;
      }
      .person-nonum {
        color: indianred;
      }

      h4 {
        line-height: 32px;
        i {
          margin-right: 5px;
          // color: lavender;
          font-size: 18px;
        }
      }

      .data {
        position: absolute;
        top: 15px;
        right: 17px;
        width: 170px;
        height: 80px;
        border-radius: 10px;

        // background-color: #ffffff;
        .data-top {
          line-height: 40px;
          background-color: #fb5151;
          border-radius: 10px 10px 0 0;
          color: #ffffff;
          text-align: center;
          font-size: 18px;
          font-weight: 900;
        }
        .data-buttom {
          line-height: 40px;
          border-radius: 0 0 10px 10px;
          text-align: center;
          background-color: #ffffff;
          color: #fb5151;
          font-size: 18px;
          font-weight: 900;
        }
        .data1 {
          position: absolute;
          left: 20px;
          top: 30px;
          height: 20px;
          width: 8px;
          background-color: #f21b19;
          border-radius: 5px;
        }
        .data2 {
          position: absolute;
          right: 20px;
          top: 30px;
          height: 20px;
          width: 8px;
          background-color: #f21b19;
          border-radius: 5px;
        }
      }
    }
  }
  .colorred {
    color: brown;
  }
  .colorgreen {
    color: chartreuse;
  }
  .coloryellow {
    color: gold;
  }
  .colordarkgray {
    color: darkgray;
  }

  // .el-carousel__item--card {
  //   background-color: #7d7e85;
  //   // border: 2px solid #ffeb7b;
  //   opacity: 0;
  //   border-radius: 2%;
  //   .name {
  //     font-size: 22px;
  //     text-align: center;
  //     color: #ffeb7b;
  //   }
  // }
  // .el-carousel__item--card.is-active {
  //   //激活状态
  //   background-color: #060711;
  //   opacity: 1;
  // }
}
</style>
