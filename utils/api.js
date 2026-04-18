// API配置
// 从配置文件导入密钥（如果存在）
let apiConfig = {}
try {
  apiConfig = require('./api.config.js')
} catch (e) {
  console.warn('未找到api.config.js，使用默认配置')
}

const API_CONFIG = {
  // 聚合数据万年历API
  juheKey: apiConfig.juheKey || 'YOUR_JUHE_API_KEY',
  juheUrl: 'http://v.juhe.cn/calendar/day',

  // 天行数据API
  tianxingKey: apiConfig.tianxingKey || 'YOUR_TIANXING_API_KEY',
  tianxingUrl: 'http://api.tianapi.com/lunar/index',

  // 天气API
  weatherKey: apiConfig.weatherKey || 'YOUR_WEATHER_API_KEY',
  weatherUrl: 'https://api.seniverse.com/v3/weather/now.json'
}

/**
 * 获取黄历数据
 */
function getHuangli(year, month, day) {
  return new Promise((resolve, reject) => {
    const dateStr = `${year}-${month}-${day}`

    wx.request({
      url: API_CONFIG.juheUrl,
      data: {
        key: API_CONFIG.juheKey,
        date: dateStr
      },
      success: (res) => {
        if (res.data.error_code === 0) {
          const result = res.data.result.data

          // 解析数据
          const huangliData = {
            lunarDate: `${result.lunar}`,
            jieqi: result.suit || '',
            yi: result.avoid ? result.avoid.split('.').filter(item => item) : [],
            ji: result.avoid ? result.avoid.split('.').filter(item => item) : [],
            // 聚合数据格式可能不同，需要根据实际返回调整
            ganzhiYear: result.animalsYear || '',
            weekday: result.weekday || ''
          }

          resolve(huangliData)
        } else {
          // 如果聚合数据失败，使用模拟数据
          resolve(getMockHuangli())
        }
      },
      fail: (err) => {
        console.error('获取黄历失败:', err)
        // 失败时返回模拟数据
        resolve(getMockHuangli())
      }
    })
  })
}

/**
 * 获取天气数据
 */
function getWeather() {
  return new Promise((resolve, reject) => {
    // 先获取用户位置
    wx.getLocation({
      type: 'wgs84',
      success: (location) => {
        // 这里可以调用天气API
        // 示例使用心知天气API
        wx.request({
          url: API_CONFIG.weatherUrl,
          data: {
            location: `${location.latitude}:${location.longitude}`,
            key: API_CONFIG.weatherKey
          },
          success: (res) => {
            if (res.data.results && res.data.results.length > 0) {
              const weather = res.data.results[0].now
              resolve({
                temperature: weather.temperature,
                desc: weather.text
              })
            } else {
              resolve(getMockWeather())
            }
          },
          fail: () => {
            resolve(getMockWeather())
          }
        })
      },
      fail: () => {
        // 获取位置失败，返回默认天气
        resolve(getMockWeather())
      }
    })
  })
}

/**
 * 模拟黄历数据（用于测试或API失败时）
 */
function getMockHuangli() {
  const date = new Date()
  const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月']
  const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                     '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                     '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十']

  return {
    lunarDate: `${lunarMonths[date.getMonth()]}${lunarDays[date.getDate() - 1]}`,
    jieqi: '春分',
    yi: ['祭祀', '祈福', '求嗣', '开光', '出行', '解除'],
    ji: ['动土', '破土', '安葬', '开市', '交易', '立券'],
    ganzhiYear: '甲辰年',
    weekday: '星期五'
  }
}

/**
 * 模拟天气数据
 */
function getMockWeather() {
  return {
    temperature: '22',
    desc: '晴'
  }
}

/**
 * 生成AI祝福语（可接入AI接口）
 */
function generateAIBlessing(huangliData) {
  // 这里可以接入ChatGPT、文心一言等AI接口
  // 暂时使用模板
  const templates = [
    `${huangliData.lunarDate}，愿您平安喜乐，诸事顺遂。`,
    `今日${huangliData.jieqi}，祝您身体健康，万事如意。`,
    `新的一天，愿您福寿安康，吉祥如意。`,
    `${huangliData.ganzhiYear}，祝您心想事成，好运连连。`
  ]

  return templates[Math.floor(Math.random() * templates.length)]
}

module.exports = {
  getHuangli,
  getWeather,
  generateAIBlessing
}
