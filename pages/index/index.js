const app = getApp()
const api = require('../../utils/api.js')

Page({
  data: {
    solarDate: '',
    lunarDate: '',
    jieqi: '',
    weather: {
      temperature: '--',
      desc: '加载中'
    },
    yi: [],
    ji: [],
    blessing: '加载中...'
  },

  onLoad() {
    this.loadTodayData()
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadTodayData()
  },

  async loadTodayData() {
    wx.showLoading({ title: '加载中' })

    try {
      // 获取当前日期
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()

      this.setData({
        solarDate: `${year}年${month}月${day}日 ${this.getWeekDay(date)}`
      })

      // 并行请求黄历和天气数据
      const [huangliData, weatherData] = await Promise.all([
        api.getHuangli(year, month, day),
        api.getWeather()
      ])

      // 更新黄历数据
      if (huangliData) {
        this.setData({
          lunarDate: huangliData.lunarDate,
          jieqi: huangliData.jieqi,
          yi: huangliData.yi || [],
          ji: huangliData.ji || []
        })
      }

      // 更新天气数据
      if (weatherData) {
        this.setData({
          weather: {
            temperature: weatherData.temperature,
            desc: weatherData.desc
          }
        })
      }

      // 生成AI祝福语
      this.generateBlessing(huangliData)

    } catch (error) {
      console.error('加载数据失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  getWeekDay(date) {
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    return days[date.getDay()]
  },

  generateBlessing(huangliData) {
    // 这里可以接入AI接口生成祝福语
    // 暂时使用模板生成
    const templates = [
      `${huangliData.lunarDate}，愿您平安喜乐，诸事顺遂。`,
      `今日${huangliData.jieqi || ''}，祝您身体健康，万事如意。`,
      `${this.data.solarDate}，愿您福寿安康，吉祥如意。`,
      `新的一天，愿您心想事成，好运连连。`
    ]

    const blessing = templates[Math.floor(Math.random() * templates.length)]
    this.setData({ blessing })
  },

  generateCard() {
    // 跳转到平安卡生成页面
    wx.navigateTo({
      url: '/pages/card/card?data=' + encodeURIComponent(JSON.stringify({
        solarDate: this.data.solarDate,
        lunarDate: this.data.lunarDate,
        jieqi: this.data.jieqi,
        weather: this.data.weather,
        yi: this.data.yi,
        ji: this.data.ji,
        blessing: this.data.blessing
      }))
    })
  }
})
