<template>
  <div id="digital-flop">
    <dv-border-box-10 style="margin-left:15px;">
      <h2>巡线人员统计</h2>
      <ul>
        <li>{{ resData[0].checkTotalNumber || 0 }}</li>
        <li>{{ resData[0].checkQuTotalNumber || 0 }}</li>
        <li @click="opendialogxx" style="cursor: pointer">
          {{ resData[0].checkTotalNumber - resData[0].checkQuTotalNumber || 0 }}
        </li>
        <li>{{ resData[0].checkQuPercent || '0%' }}</li>
        <li>{{ resData[0].avgTime || '00:00' }}</li>
      </ul>
      <ul class="second-ul">
        <li>巡检总人数</li>
        <li>合格人数</li>
        <li>未合格人数</li>
        <li>合格有效率</li>
        <li>平均时长</li>
      </ul>
    </dv-border-box-10>
    <dv-border-box-10 style="margin-right:15px;">
      <h2>跨越、盾构人员统计</h2>
      <ul>
        <li>{{ resData[0].bridgeTotalNumber || 0 }}</li>
        <li>{{ resData[0].bridgeQuTotalNumber || 0 }}</li>
        <li @click="opendialogkydg" style="cursor: pointer">
          {{ resData[0].bridgeTotalNumber - resData[0].bridgeQuTotalNumber || 0 }}
        </li>
        <li>{{ resData[0].bridgekQuPercent || '0%' }}</li>
      </ul>
      <ul class="second-ul">
        <li>巡检总人数</li>
        <li>合格人数</li>
        <li>未合格人数</li>
        <li>合格有效率</li>
      </ul>
    </dv-border-box-10>

    <!-- 巡线未合格人数对话框 -->
    <!-- 加上.sync 可以点X关闭对话框 -->
    <!-- :modal="false"是否有遮照层 -->
    <el-dialog title="巡线未合格人员" :visible.sync="diaVisiblexx" :modal="false" width="70%">
      <el-table :data="showarr" height="650">
        <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="70"></el-table-column>
        <el-table-column property="date" label="日期" align="center" width="100"></el-table-column>
        <el-table-column property="departmentname" label="所属站队" align="center" width="130"></el-table-column>
        <!-- 内容超过固定宽度，自动隐藏 :show-overflow-tooltip="true" -->
        <el-table-column
          property="username"
          label="姓名"
          align="center"
          width="140"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column property="basecount" label="应巡点" align="center" width="100"></el-table-column>
        <el-table-column property="checkedcount" label="已巡点" align="center" width="100"></el-table-column>
        <el-table-column property="uncount" label="未巡点" align="center" width="100"></el-table-column>
        <el-table-column property="percent" label="巡检率" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.percent + '%' }}
          </template>
        </el-table-column>
        <el-table-column property="pmtimelong" label="下午时长" align="center" width="120"></el-table-column>
        <el-table-column property="ampmtimelong" label="全天时长" align="center" width="120"></el-table-column>
        <el-table-column property="reason" label="原因" align="center" width="210">
          <template slot-scope="scope">
            {{ Number(scope.row.percent) < 100 ? '巡检率不足100%' : '时长不足' }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="resData[0].checkTotalNumber - resData[0].checkQuTotalNumber"
        :page-size="pagesize"
        :current-page="pagenum"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-dialog>

    <!-- 跨越、盾构未合格人员对话框 -->
    <el-dialog title="跨越、盾构未合格人员" :visible.sync="diaVisiblekydg" :modal="false">
      <el-table :data="resData[0].bridgeUnquTotalNumber">
        <el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
        <el-table-column property="departmentname" label="所属站队" align="center" width="130"></el-table-column>
        <el-table-column property="username" label="姓名" align="center" width="100"></el-table-column>
        <el-table-column property="basecount" label="应巡点" align="center" width="100"></el-table-column>
        <el-table-column property="checkedcount" label="已巡点" align="center" width="100"></el-table-column>
        <el-table-column property="uncount" label="未巡点" align="center" width="100"></el-table-column>
        <el-table-column property="percent" label="巡检率" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.percent + '%' }}
          </template>
        </el-table-column>
        <el-table-column property="reason" label="原因" align="center" width="210"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

import io from 'socket.io-client'
const socket = io('http://localhost:5001')
export default {
  data() {
    return {
      timer: null, //定时器名称
      resData: [{}], //请求到的数据
      diaVisiblexx: false, // 巡线未合格人员对话框
      diaVisiblekydg: false, // 跨越盾构未合格人员对话框
      pagenum: 1, // 巡线未合格人员 分页当前显示页码
      pagesize: 12, // 巡线未合格人员分页 每页显示条数
      showarr: [], // 巡线未合格人员 分页 切换分页时table显示的数据
      pageindex: 0, //巡线未合格人员 分页,数组数据切换的起始下标
    }
  },
  created() {
    this.getDigitalFlop(moment().format('YYYY-MM-DD'))

    socket.on('message', () => {
      this.getDigitalFlop(moment().format('YYYY-MM-DD'))
      console.log(`digitalFlop组件 顶部信息收到消息!${this.$moment().format('HH:mm:ss')}`)
    })
  },
  mounted() {
    //日期传过来时触发
    this.$bus.$on('changeDate', res => {
      // this.$nowData = res
      this.getDigitalFlop(res)
    })
  },

  methods: {
    //请求数据
    async getDigitalFlop(tempDate = moment().format('YYYY-MM-DD')) {
      const res = await this.$http.get(`index/digitalflop/${tempDate}`)
      this.resData = res.data
    },

    //巡线未合格人员对话框
    opendialogxx() {
      this.diaVisiblexx = true
      //数组截取,包前不包后   刚打开对话框时显示的数据
      this.showarr = this.resData[0].checkUnquTotalNumber.slice(this.pageindex, this.pagesize)
      this.pagenum = 1
    },
    //跨越盾构未合格人员对话框
    opendialogkydg() {
      this.diaVisiblekydg = true
    },

    //监听显示的第几页
    handleCurrentChange(newPage) {
      this.showarr = []
      //1页 0 12
      //2页 12 24
      //3页 24 36
      //4页 36 48
      this.showarr = this.resData[0].checkUnquTotalNumber.slice(this.pagesize * (newPage - 1), this.pagesize * newPage)
      this.pagenum = newPage //一定要把当前监听的页码,赋值给当前显示页码
    },

    //表格index 按顺序编号, 不会因为翻页,重新编号
    indexMethod(index) {
      return this.pagesize * (this.pagenum - 1) + index + 1
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-table::before {
  height: 0px;
}

#digital-flop {
  // position: relative;
  height: 9.375rem;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background-color: rgba(6, 30, 93, 0.5);

  .dv-border-box-10 {
    height: 9.375rem;
    width: 48.5%;
    h2 {
      text-align: center;
      margin-top: 13px;
    }
    ul {
      display: flex;
      margin-top: 7px;
      li {
        flex: 1;
        font-size: 50px;
        font-family: 'electronicFont';
        color: #ffeb7b;
        text-align: center;
        border-right: 2px solid rgba(211, 225, 248, 0.5);
      }
      li:last-child {
        border-right: none;
      }
    }
    .second-ul {
      display: flex;
      li {
        flex: 1;
        font-size: 20px;
        color: rgba(255, 255, 255, 0.7);
        font-weight: 900;
        text-align: center;
        border-right: none;
      }
    }
  }
}
</style>
