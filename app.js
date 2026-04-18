App({
  onLaunch() {
    // 小程序启动时执行
    console.log('黄历小程序启动')
  },

  globalData: {
    apiKey: 'YOUR_API_KEY', // 聚合数据或天行数据的API Key
    userInfo: null
  }
})
