<template>
  <div class="dataManage">
    <el-row>
      <el-card class="dataManage-card">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>数据配置</el-breadcrumb-item>
          <el-breadcrumb-item>数据管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-card></el-card>
    </el-row>
  </div>
</template>

<script>
export default {
  created() {
    // this.getData()
  },
  methods: {
    async getData() {
      const res = await this.$http.get('home/datamanage')
      // console.log(res.data[0].querycheckstatics)
    },
  },
}
</script>

<style lang="scss" scoped>
.dataManage {
  padding: 0 15px;
  .dataManage-card {
    margin-top: 20px;
  }
}
</style>
