module.exports = {
  //关闭eslint校验
  lintOnSave: false,
  devServer: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3001', // target host
        changeOrigin: true, // needed for virtual hosted sites
        logLevel: 'debug',
      },
      '/sockjs-node': {
        target: 'http://localhost:3001',
        ws: false,
        changeOrigin: true,
      },
    },
  },
}
