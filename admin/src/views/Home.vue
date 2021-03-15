<template>
  <el-container style="height: 100%" class="container-home">
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <el-menu
        background-color="#545c64"
        text-color="#FFF"
        active-text-color="#ffd04b"
        style="height: 100%"
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="$route.path"
        router
        :default-openeds="['1']"
        unique-opened
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-s-tools"></i>
            <span>数据配置</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/home/creatdata">
              <i class="el-icon-circle-plus"></i>
              <span>新增数据</span>
            </el-menu-item>
            <el-menu-item index="/home/datamanage">
              <i class="el-icon-crop"></i>
              <span>数据管理</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>

        <el-submenu index="2">
          <template slot="title" style="padding: 0">
            <i class="el-icon-set-up"></i>
            <span>权限管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item>
              <i class="el-icon-connection"></i>
              <span>权限配置</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <i
          :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
          @click="toggleCollapse"
        ></i>
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false
    }
  },
  methods: {
    //点击侧边框收缩
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="scss">
.container-home {
  .el-menu {
    border-right: none;
  }

  .el-menu-item-group__title {
    padding: 0;
  }

  .el-header {
    background-color: #fff;
    padding: 0;
    border-bottom: 1px solid black;
    i {
      font-size: 25px;
      color: #409eff;
      margin-left: -2px;
      cursor: pointer;
    }
  }
  .main {
    padding: 0;
    margin: 0;
  }
}
</style>
