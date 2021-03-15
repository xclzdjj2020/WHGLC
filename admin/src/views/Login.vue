<template>
  <div class="login">
    <div class="login-card">
      <h1>Login</h1>
      <el-form class="login-card-form">
        <el-form-item>
          <el-input v-model="model.username" placeholder="UserName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="model.password" placeholder="Password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="login">Sign in</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: {},
    }
  },
  created() {},
  methods: {
    async login() {
      const res = await this.$http.post('login', this.model)
      localStorage.token = res.data //token存入
      this.$router.push('home')
      this.$message({
        type: 'success',
        message: '登录成功！',
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
