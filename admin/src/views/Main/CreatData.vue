<template>
  <div class="creatdata">
    <el-row>
      <el-card class="creatdata-card">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>数据配置</el-breadcrumb-item>
          <el-breadcrumb-item>新增数据</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
    </el-row>
    <el-row>
      <el-card>
        <el-form>
          <el-form-item label="站队名称" style="width: 300px">
            <el-input></el-input>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.creatdata {
  padding: 0 15px;
  .creatdata-card {
    margin-top: 20px;
  }
}
</style>
