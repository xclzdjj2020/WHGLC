<template>
  <div id="select-table">
    <el-tabs
      type="border-card"
      :key="componentKey"
      @tab-click="
        item => {
          tabClick(item)
        }
      "
    >
      <el-tab-pane v-for="(item, index) in infoTable" :key="index" :label="item.name">
        <template>
          <!-- :row-style="tableRowClassName" -->
          <el-table :data="showarr" style="width: 100%;height:100%" :row-style="tableRowClassName">
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="55"></el-table-column>
            <el-table-column prop="checktime" label="巡检日期" width="120" align="center"> </el-table-column>
            <el-table-column prop="departmentname" label="所属站队" width="140" align="center"> </el-table-column>
            <el-table-column
              prop="getcheckroutepoint"
              label="姓名"
              width="80"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ scope.row.username || '未巡检' }}
              </template>
            </el-table-column>
            <el-table-column prop="basecount" label="应巡点" width="70" align="center"> </el-table-column>
            <el-table-column prop="checkedcount" label="已巡点" width="70" align="center"> </el-table-column>
            <el-table-column prop="scheckedcount" label="未巡点" width="70" align="center">
              <template slot-scope="scope">
                {{ scope.row.basecount - scope.row.checkedcount }}
              </template>
            </el-table-column>
            <el-table-column prop="percent" label="巡检率" width="80" align="center">
              <!-- 巡检率取整 -->
              <template slot-scope="scope">
                {{ Math.round(parseFloat(scope.row.percent)) + '%' }}
              </template>
            </el-table-column>
            <el-table-column prop="amtimelong" label="上午时长" width="100" align="center"> </el-table-column>
            <el-table-column prop="pmtimelong" label="下午时长" width="100" align="center"> </el-table-column>
            <el-table-column prop="ampmtimelong" label="全天时长" width="100" align="center"> </el-table-column>
            <el-table-column prop="scheckedcount" label="备注" width="100" align="center">
              <template slot-scope="scope">
                {{
                  (scope.row.departmentname === '忠县分输站' ||
                    scope.row.departmentname === '榔坪分输站' ||
                    scope.row.departmentname === '长阳分输站' ||
                    scope.row.departmentname === '红岩寺保护站' ||
                    scope.row.departmentname === '枝江分输站') &&
                  (scope.row.basecount === 4 || scope.row.basecount === 8)
                    ? '跨越或盾构'
                    : ''
                }}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="statusData.length"
            :page-size="pagesize"
            :current-page="pagenum"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import moment from 'moment'

import io from 'socket.io-client'
const socket = io('http://localhost:5001')

export default {
  data() {
    return {
      infoTable: [], //站队ID 名字
      statusData: [], //请求到的站队所有人数据
      showarr: [], //切换分页时显示的数据
      pagenum: 1, // 分页当前显示页码
      pagesize: 12, //每页显示条数
      pageindex: 0, //分页,数组数据切换的起始下标
      tempssdwdm: '', //临时暂存的id 用于当站队显示不在激活的站队菜单 更改日期时 临时保存当前激活的站队菜单
      componentKey: 0, //强制渲染组件，改变key值用的
    }
  },
  created() {
    socket.on('message', async () => {
      await this.getStatusInfo()
      /*
      el-tabs强制渲染组件理由:在后台数据处理结束，提示前台刷新页面时，当tab的激活选项卡不在第1位(默认值)时，
      重新刷新后，tab的激活选项卡不会更改到第1位(默认值)，但table里的数据显示的是第1位的数据，与tab当前显示的激活项不符合
      所以利用重新渲染组件强制tab的激活选项卡回到第1位
      */
      this.forceRerender() //强制改变key值，重新渲染组件
      
    })
  },
  mounted() {
    this.getStatusInfo()

    //日期传过来时触发
    this.$bus.$on('changeDate', res => {
      this.$nowData = res
      this.getStatusData(res, this.tempssdwdm)
    })
  },

  methods: {
    //请求站队id 名字
    async getStatusInfo() {
      const res = await this.$http.get(`index/ssdwdm`)
      this.infoTable = res.data
      this.tempssdwdm = this.infoTable[0].ssdwdm
      this.getStatusData(moment().format('YYYY-MM-DD'), this.infoTable[0].ssdwdm)
    },

    //根据日期 站队id 请求数据
    async getStatusData(nowData = moment().format('YYYY-MM-DD'), ssdwdm) {
      const res = await this.$http.get(`index/${nowData}/${ssdwdm}`)
      this.statusData = res.data
      this.showarr = this.statusData.slice(this.pageindex, this.pagesize)
      this.pagenum = 1
    },

    //点击tab触发事件
    tabClick(item) {
      this.tempssdwdm = ''
      this.tempssdwdm = this.infoTable[item.index].ssdwdm
      this.getStatusData(this.$nowData, this.infoTable[item.index].ssdwdm) //日期 站队id
      //页面显示页数
      this.showarr = this.statusData.slice(this.pageindex, this.pagesize)
      this.pagenum = 1
    },

    //监听显示的第几页
    handleCurrentChange(newPage) {
      this.showarr = []
      //1页 0 12
      //2页 12 24
      //3页 24 36
      //4页 36 48
      this.showarr = this.statusData.slice(this.pagesize * (newPage - 1), this.pagesize * newPage)
      this.pagenum = newPage //一定要把当前监听的页码,赋值给当前显示页码
    },
    //表格index 按顺序编号, 不会因为翻页,重新编号
    indexMethod(index) {
      return this.pagesize * (this.pagenum - 1) + index + 1
    },

    //设置表格行根据条件更改背景颜色
    tableRowClassName({ row, rowIndex }) {
      //是否跨越
      if (
        (row.departmentname === '忠县分输站' ||
          row.departmentname === '榔坪分输站' ||
          row.departmentname === '长阳分输站' ||
          row.departmentname === '红岩寺保护站' ||
          row.departmentname === '枝江分输站') &&
        (row.basecount === 4 || row.basecount === 8)
      ) {
        return row.checkedcount >= row.basecount ? { color: 'chartreuse' } : { color: '#f21b19' }
      } else {
        //不是跨越
        //巡线员
        if (row.ampmtimelong >= '03:00:00' && row.pmtimelong >= '00:30:00') {
          if (row.percent === '100') {
            return {
              color: 'chartreuse', //下午和全天时长合格 且巡检率为100%  绿色
            }
          } else {
            return {
              color: 'gold', //下午和全天时长合格  巡检率不为100 黄色 提醒有未巡点
            }
          }
        } else {
          return {
            color: '#f21b19', //时长不够
          }
        }
      }
    },

    //强制改变key值，重新渲染组件
    forceRerender() {
      this.componentKey += 1
    },
  },
}
</script>

<style lang="scss" scoped>
#select-table {
  width: 1120px;
  height: 730px;
  margin-top: 10px;
  margin-left: 15px;
  // position: relative;
}
.el-tabs--border-card {
  height: 730px;
  background-color: transparent !important;
  border: none;
}

//表格内容高度
::v-deep .el-table__body-wrapper {
  height: 580px;
}

//设置tabs
::v-deep .el-tabs--border-card > .el-tabs__content {
  // height: 730px;
  position: static !important;
}
//tabs头部
::v-deep .el-tabs--border-card > .el-tabs__header {
  background: linear-gradient(45deg, #333333, #00baff, #333333);
  border-bottom: 0px;
}
//每一项
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  font-size: 16px;
  color: #fff;
}
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item:first-child {
  border-radius: 5px 0 0 5px;
}
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item:last-child {
  border-radius: 0px 5px 5px 0px;
}
//设置2边按钮
::v-deep .el-icon-arrow-right:before,
::v-deep .el-icon-arrow-left:before {
  color: #eb8146;
  font-size: 15px;
}

/*表格最外层透明*/
::v-deep .el-table,
::v-deep .el-table__expanded-cell {
  font-size: 16px;
  color: chartreuse; //表格内容文字颜色
  font-weight: 900;
  background-color: transparent !important;
}
::v-deep .el-table th > .cell {
  color: #fff; //表格头部设置
  background-color: #00baff;
  line-height: 40px;
  // border-radius: 3px;
}

//表头第一个格
::v-deep .el-table th:nth-child(1) > .cell {
  border-radius: 5px 0 0 5px;
}
//表头最后一个格
::v-deep .el-table th:nth-child(12) > .cell {
  border-radius: 0px 5px 5px 0px;
}

/* 表格内背景颜色透明 */
::v-deep .el-table th,
::v-deep .el-table tr,
::v-deep .el-table td {
  background-color: transparent !important;
  border-bottom: none !important; //去掉单元格下面的横线
}

//鼠标悬停时显示的颜色
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item:not(.is-disabled):hover {
  color: #eb8146;
}

//表格最下面的一条线 去掉
.el-table::before {
  height: 0;
}

// 分页
::v-deep .el-pagination {
  // position: absolute;
  // left: 35%;
  // margin-left: -170px; /*差不多为该div宽度的一半*/
  // bottom: 0px;
  .el-pager {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
//分页样式设置
::v-deep .el-pagination.is-background .btn-prev,
::v-deep .el-pagination.is-background .btn-next {
  display: none; //去掉上一页,下一页按钮
}

//设置分页按钮
::v-deep .el-pagination.is-background .el-pager li {
  margin: 0 5px;
  border-radius: 5px;
  width: 160px;
  line-height: 25px;
  height: 25px;
  font-size: 16px;
}
</style>
